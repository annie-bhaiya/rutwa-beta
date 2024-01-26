import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { db, auth, storage } from "./config/firebase";
import {
  get as getDatabase,
  onValue,
  push,
  ref as databaseRef,
  set,
  remove,
  get,
} from "firebase/database"; 
import {
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  ref as storageRef,
} from "firebase/storage"; 
import { Loader } from "./Loader";
import AddToCart from './AddtoCart'
import './productDetail.css'

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class ProductDetail extends Component {
  state = {
    product: {
      id: "",
      title: "",
      thumbnail: "",
      photos: {},
      brand: "",
      group: "",
      desc: "",
      size: [],
      price: 0,
      mrp: 0,
      netWeight: 0,
      country: "",
      packer: "",
      manufacturer: "",
      closure: "",
      color: "",
      fabric: "",
      collar: "",
      quantity: 1,
      sleeve: "",
      type: "",
      variants: [],
    },
    user: {},
    photos: [],
    reviews: [],
    newReviewTitle: "",
    newReviewDesc: "",
    newReviewPhotos: [],
    newReviewRating: 0,
    quantity: 1,
    loading: true, // Added loading state
    selectedRating: 0, 
  };

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      this.setState({ user: user });
    });

    const productId = this.props.params.id;

    // Fetch product details
    const productRef = databaseRef(db, "/products/" + productId);
    onValue(productRef, (p) => {
      this.setState({
        product: {
          id: p.val().id,
          title: p.val().title,
          thumbnail: p.val().thumbnail,
          photos: p.val().photos,
          brand: p.val().brand,
          group: p.val().group,
          desc: p.val().desc,
          size: p.val().size,
          price: p.val().price,
          mrp: p.val().mrp,
          netWeight: p.val()["net-weight"],
          country: p.val().country,
          packer: p.val().packer,
          manufacturer: p.val().manufacturer,
          closure: p.val().closure,
          color: p.val().color,
          fabric: p.val().fabric,
          collar: p.val().collar,
          quantity: p.val().quantity,
          sleeve: p.val().sleeve,
          type: p.val().type,
          variants: p.val().variants,
        },
        loading: false, // Set loading to false once data is fetched
      });
    });

    // Fetch photos for this product
    const photosRef = databaseRef(db, "/products/" + productId + "/photos/");
    onValue(photosRef, (photosSnapshot) => {
      const photos = [];
      photosSnapshot.forEach((photo) => {
        photos.push(photo.val().url);
      });
      this.setState({
        photos: photos,
      });
    });

    const reviewsRef = databaseRef(db, "/products/" + productId + "/reviews/");
    onValue(reviewsRef, (reviewsSnapshot) => {
      const reviews = [];

      reviewsSnapshot.forEach((review) => {
        const reviewData = review.val();
        const photos = reviewData.photos || [];
        reviews.push({
          ...reviewData,
          photos: photos,
        });

        const userRef = databaseRef(db, "/users/" + reviewData.uid);
        onValue(userRef, (userSnapshot) => {
          const userData = userSnapshot.val();
          if (userData) {
            this.setState((prevState) => ({
              reviews: prevState.reviews.map((r) => {
                if (r.uid === reviewData.uid) {
                  return {
                    ...r,
                    user: userData,
                  };
                }
                return r;
              }),
            }));
          }
        });
      });

      this.setState({
        reviews: reviews,
      });
    });
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleFileInputChange = (event) => {
    const files = event.target.files;
    this.setState({
      newReviewPhotos: files,
    });
  };

  handleRatingChange = (rating) => {
    this.setState({ newReviewRating: rating });
  };

  deleteReview = (review) => {
    const reviewRef = databaseRef(
      db,
      "/products/" + this.props.params.id + "/reviews/"
    );

    const updatedReviews = this.state.reviews.filter(
      (r) => r !== review
    );

    set(reviewRef, updatedReviews);

    this.setState({
      reviews: updatedReviews,
    });
  };

  reportReview = (review) => {
    const reviewsRef = databaseRef(
      db,
      "/products/" + this.props.params.id + "/reviews/"
    );

    get(reviewsRef).then((reviewsSnapshot) => {
      reviewsSnapshot.forEach((reviewSnapshot) => {
        const reviewData = reviewSnapshot.val();
        if (reviewData.desc === review.desc) {
          const reportRef = databaseRef(
            db,
            "/products/" +
              this.props.params.id +
              "/reviews/" +
              reviewSnapshot.key +
              "/reports"
          );

          get(reportRef).then((reports) => {
            if (reports.exists()) {
              set(reportRef, reports.val() + 1).then(()=>{
                window.location.reload();
              });
            } else {
              set(reportRef, 1).then(()=>{
                window.location.reload();
              });
            }
          });
        }
      });
    });
  };

  addToCart = (quantity) => {
    let productId = this.props.params.id;
    let uid = this.state.user.uid;
    let cartRef = databaseRef(db, "/users/" + uid + "/cart/");
  
    get(databaseRef(db, "/users/" + uid + "/cart/" + productId)).then((snapshot) => {
      if (snapshot.exists()) {
        const productRef = databaseRef(db, "/users/" + uid + "/cart/" + productId + "/quantity");
        get(productRef).then((quantitySnapshot) => {
          set(productRef, parseInt(quantitySnapshot.val()) + parseInt(quantity))
            .then(() => {
              window.location.reload();
            });
        });
      } else {
        set(databaseRef(db, "/users/" + uid + "/cart/" + productId), {
          productId: productId,
          quantity: parseInt(1),
          title: this.state.product.title,
        })
          .then(() => {
            window.location.reload();
          });
      }
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const uid = auth.currentUser.uid;

    if (this.state.newReviewRating === 0) {
      alert("Please provide a rating before submitting your review.");
      return;
    }

    const newReview = {
      title: this.state.newReviewTitle,
      desc: this.state.newReviewDesc,
      photos: [],
      rating: this.state.newReviewRating,
      uid: uid,
    };

    const newReviewRef = databaseRef(
      db,
      "/products/" + this.props.params.id + "/reviews/"
    );

    const newReviewSnapshot = await push(newReviewRef, newReview);

    const photoUploadPromises = [];
    for (let i = 0; i < this.state.newReviewPhotos.length; i++) {
      const file = this.state.newReviewPhotos[i];
      const photoRef = storageRef(
        storage,
        'path-to-your-storage-location/' + newReviewSnapshot.key + '/' + file.name
      );

      const photoUploadTask = uploadBytesResumable(photoRef, file);
      photoUploadPromises.push(photoUploadTask);

      photoUploadTask.on("state_changed", (snapshot) => {
        // Handle upload progress if needed
      });

      await photoUploadTask;

      const photoUrl = await getDownloadURL(photoRef);

      newReview.photos.push(photoUrl);
    }

    await set(
      databaseRef(
        db,
        "/products/" + this.props.params.id + "/reviews/" + newReviewSnapshot.key
      ),
      newReview
    ).then(()=>{
      window.location.reload();
    });
  };

  render() {
    if (this.state.loading) {
      return <Loader />
    }

    return (
      <div>
        <div className="product-info">
          <h2 className="product-title">{this.state.product.title}</h2>
          {this.state.photos.map((photoUrl, index) => (
            <img className="product-image"
              src={photoUrl}
              alt={`Product Photo ${index}`}
              key={index}
            />
          ))}
          <div className="product-details">
            <p className="product-detail">Price: ₹{this.state.product.price}</p>
            <p className="product-detail">Net Weight: {this.state.product.netWeight}g</p>
            <p className="product-detail">Color: {this.state.product.color}</p>
            <p className="product-detail">Fabric: {this.state.product.fabric}</p>
            <p className="product-detail">Collar: {this.state.product.collar}</p>
            <p className="product-detail">Sleeve: {this.state.product.sleeve}</p>
          </div>
          <p className="product-description">{this.state.product.desc}</p>
          <button className="add-to-cart-button" onClick={this.addToCart}>
            Add to Cart
          </button>
        </div>
        <div className="reviews-container">
          <h2 className="reviews-title">Reviews</h2>
          <ul className="reviews"> 
            {this.state.reviews.map((review, index) => (
              <li className="review" key={index}>
                <h4 className="review-title">{review.title}</h4>
                <p className="review-desc">{review.desc}</p>
                <div className="rating-container">
                  <label className="rating-title">Rating:</label>
                  <div className="star-container">
                    {[...Array(5)].map((_, i) => (
                      <label key={i} className="star">
                        ★
                      </label>
                    ))}
                  </div>
                </div>
                {review.uid === this.state.user.uid ? (
                  <button className="review-delete-button" onClick={() => this.deleteReview(review)}>
                    Delete
                  </button>
                ) : (
                  <button className="review-report-button" onClick={() => this.reportReview(review)}>
                    Report
                  </button>
                )}
                {review.user && (
                  <div className="review-user-info">
                    <img
                      className="user-pfp"
                      src={review.user.photoURL}
                      alt={`User Photo`}
                      width="50"
                      height="50"
                    />
                    <span>{review.user.displayName}</span>
                  </div>
                )}
                <div className="review-images-container">
                  {review.photos.map((photoUrl, photoIndex) => (
                    <img
                      className="review-image"
                      src={photoUrl}
                      alt={`Review Photo ${photoIndex}`}
                      key={photoIndex}
                    />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="review-write-container">
          <h2 className="review-write-title">Write a Review</h2>
          <form onSubmit={this.handleSubmit}>
            <div>
              <label className="review-label">Title:</label>
              <input
                type="text"
                name="newReviewTitle"
                value={this.state.newReviewTitle}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div>
              <label className="review-label">Description:</label>
              <textarea
                name="newReviewDesc"
                value={this.state.newReviewDesc}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div>
              <label className="review-label">Rating:</label>
              {[...Array(5)].map((_, i) => (
                <label key={i} className="star-label">
                  <input
                    type="radio"
                    name="newReviewRating"
                    value={i + 1}
                    checked={this.state.selectedRating === i + 1}
                    onChange={() => this.handleRatingChange(i + 1)}
                    required
                    style={{ display: "none" }}
                  />
                  <span
                    className="star"
                    style={{
                      cursor: "pointer",
                      fontSize: "30px",
                      color: i < this.state.selectedRating ? "yellow" : "grey",
                    }}
                    role="img"
                    aria-label="star"
                  >
                    ⭐
                  </span>
                </label>
              ))}
            </div>
            <div>
              <label className="review-label">Photos:</label>
              <input
                type="file"
                name="newReviewPhotos"
                multiple
                onChange={this.handleFileInputChange}
              />
            </div>
            <button type="submit">Submit Review</button>
          </form>
        </div>
      </div>
    );
  }
}

export default withParams(ProductDetail);
