import React, { useState } from 'react';
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
import './ProductDetailUpdated.css'; // Replace with the correct path to your CSS file
import "./fa/css/all.min.css"

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class ProductDetailss extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 3,
      inputrating: 0,
      
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
    quantity: 1,
    loading: true, // Added loading state
    selectedRating: 0,
    };
  }

  componentDidMount() {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('reviewRating');

    stars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = star.dataset.rating;
        this.updateStars(rating);
        ratingInput.value = rating;
      });
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
  updateStars(rating) {
    this.setState({ inputrating: parseInt(rating) });
  }
  handleSubmit = async (event) => {
    event.preventDefault();

    const uid = auth.currentUser.uid;

    if (this.state.inputrating === 0) {
      alert("Please provide a rating before submitting your review.");
      return;
    }

    const newReview = {
      title: this.state.newReviewTitle,
      desc: this.state.newReviewDesc,
      photos: [],
      rating: this.state.inputrating,
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
    return (
      <div>
        <header>
          <nav></nav>
        </header>
        <main>
          <div className="container">
            <div className="product-intro">
              <div className="product-image"><img src="/raw.png" alt="" /></div>
              <div className="product-basics">
                <div className="product-rating" value={this.state.rating}>
                  {[1, 2, 3, 4, 5].map((star, index) => (
                    <span
                      key={index}
                      className={index < this.state.rating ? 'active star' : 'stars'}
                      data-rating={index + 1}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
                <div>
                  <h2>Women's Hoodie</h2>
                  <h3>₹ 699</h3>
                  <p>A very amazing hoodie for women</p>
                  <div className="buttons">
                    <button>Buy now</button>
                    <button>Add to cart</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="white-space"></div>

          <div className="key-details">
            <div className="details">
              <div className="product-detail"><i className="fas fa-weight"></i> Net Weight: 100g</div>
              <div className="product-detail"><i className="fas fa-palette"></i> Color: Black</div>
              <div className="product-detail"><i className="fas fa-tshirt"></i> Fabric: Cotton</div>
              <div className="product-detail"><i className="fa-solid fa-mitten"></i> Sleeve: Full</div>
            </div>
          </div>

          <div className="white-space"></div>

          <div className="review-form">
            <h2>Write a Review</h2>
            <form onSubmit={this.handleSubmit} id="reviewForm">
              <label htmlFor="reviewTitle">Review Title:</label>
              <input type="text" id="reviewTitle" 
                name="newReviewTitle"
                value={this.state.newReviewTitle}
                onChange={this.handleInputChange}
                required />

              <label htmlFor="reviewDescription">Review Description:</label>
              <textarea id="reviewDescription"  name="newReviewDesc"
                value={this.state.newReviewDesc}
                onChange={this.handleInputChange}
                required></textarea>

              <label htmlFor="reviewRating">Rating:</label>
              <div className="rating-container">
              {[1, 2, 3, 4, 5].map((star, index) => (
                    <span
                      key={index}
                      className={index < this.state.inputrating ? 'active star' : 'star'}
                      data-rating={index + 1}
                    >
                      &#9733;
                    </span>
                  ))}
              </div>
              <input type="hidden" id="reviewRating" name="reviewRating" required />

              <label htmlFor="productPhotos">Product Photos (Optional):</label>
              <input type="file" id="productPhotos" name="newReviewPhotos"
                multiple
                onChange={this.handleFileInputChange} />

              <button type="submit">Submit Review</button>
            </form>
          </div>

          <div className="white-space"></div>

          <div className="reviews">
          {this.state.reviews.map((review, index) => (
            <div className="review" key={index}>
              <div className="user-info">
              <img src={review.user?.photoURL} alt="User Photo" className="user-photo" />

                <div className="user-name">{review.user?.displayName}</div>
               
              </div>
              <div className="review-title">{review.title}</div>
              <div className="review-description">{review.desc}</div>
              <div className="review-rating">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i}>
                        ★
                      </span>
                    ))}
                  </div>
              <div className="product-photos">
                {review.photos.map((photoUrl, photoIndex) => (
                <img  src={photoUrl}
                alt={`Review Photo ${photoIndex}`}
                key={photoIndex} className="product-photo" />
             ))} </div>
            </div>
            ))}
          </div>

          <div className="white-space"></div>

          <div className="products-container">
            <div className="product-card">
              <img src="/raw.png" alt="Product 1" />
              <h3>Product 1</h3>
              <p>Description of Product 1 goes here. It is a fantastic product!</p>
              <div className="product-buttons">
                <button>Add to Cart</button>
                <button>Info</button>
              </div>
            </div>

            <div className="product-card">
              <img src="/raw.png" alt="Product 2" />
              <h3>Product 2</h3>
              <p>Description of Product 2 goes here. Another amazing product!</p>
              <div className="product-buttons">
                <button>Add to Cart</button>
                <button>Info</button>
              </div>
            </div>

            <div className="product-card">
              <img src="/raw.png" alt="Product 3" />
              <h3>Product 3</h3>
              <p>Description of Product 3 goes here. Yet another fantastic product!</p>
              <div className="product-buttons">
                <button>Add to Cart</button>
                <button>Info</button>
              </div>
            </div>

            <div className="product-card">
              <img src="/raw.png" alt="Product 4" />
              <h3>Product 4</h3>
              <p>Description of Product 4 goes here. Yet another fantastic product!</p>
              <div className="product-buttons">
                <button>Add to Cart</button>
                <button>Info</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default withParams(ProductDetailss);
