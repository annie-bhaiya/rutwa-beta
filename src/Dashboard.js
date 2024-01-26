import { Component } from "react";
import { auth, db } from "./config/firebase";
import { onValue, ref, remove, set } from "firebase/database";
import { Loader } from "./Loader";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './dashboard.css'
const MySwal = withReactContent(Swal)

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            cart: {},
            loading: true,
            products: {}
        }
    }

    componentDidMount() {
        auth.onAuthStateChanged(u => {
            this.setState({
                user: u || {}
            })
            onValue(ref(db, '/users/' + u.uid + '/cart'), (p) => {
                this.setState({
                    cart: p.val()
                })
                console.log(p.val())
                this.setState({
                    loading: false
                })
            })
            onValue(ref(db, '/products/'), (p) => {
                this.setState({
                    products: p.val()
                })
            })
        })
    }

    empty = () => {
        MySwal.fire({
            title: 'Do you want to empty the cart?',
            showCancelButton: true,
            confirmButtonText: 'Empty Cart',
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              remove(ref(db, '/users/' + this.state.user.uid + '/cart'))
              Swal.fire('Your Cart is Refreshed and Ready for New Finds!', '', 'success')
            }
          })
    }

    deleteItem = (id) =>{
        MySwal.fire({
            title: 'Do you want to remove this item from your cart?',
            showCancelButton: true,
            confirmButtonText: 'Remove Item',
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              remove(ref(db, '/users/' + this.state.user.uid + '/cart/'+id))
              Swal.fire('The product has been removed from your cart!', '', 'success')
            }
          })
    }

    increaseQuantity = (id) => {
        const newQuantity = this.state.cart[id].quantity + 1;
        set(ref(db, '/users/' + this.state.user.uid + '/cart/' + id + '/quantity'), newQuantity);
    }

    decreaseQuantity = (id) => {
        const newQuantity = Math.max(this.state.cart[id].quantity - 1, 0);
        set(ref(db, '/users/' + this.state.user.uid + '/cart/' + id + '/quantity'), newQuantity);
    }

    render() {
        if (this.state.loading) {
            return <Loader />
        }
        console.log(this.state.user)
        var products = [];
        var p = this.state.cart;
        var productDetails = this.state.products;
        for (const id in p) {
            const product = productDetails[id];
            if (product) {
                products.push(
                    <div className="product-card" key={id}>
                        <a className="product-page-link" href={`/product/${p[id].productId}`}>
                        <img className="product-thumbnail" src={product.thumbnail} alt={product.title} />
                            <h3 className="product-page-link-text">{product.title}</h3>
                        </a>
                        <p className="product-quantity" style={{"text-align":"center"}}>Quantity: {p[id].quantity}</p>
                        <button className="product-quantity-increase" style={{display:"inline-block"}} onClick={() => this.increaseQuantity(id)}>+</button>
                        <button className="product-quantity-decrease" style={{display:"inline-block"}} onClick={() => this.decreaseQuantity(id)}>-</button>
                        <button className="product-remove-button" style={{display:"inline-block"}} onClick={() => this.deleteItem(id)}>Remove item</button>
                    </div>
                );
            }
        }
        if(p){
            var btn = <div className="submit-container"><button className="btn btn-primary" onClick={this.empty}>Empty cart</button><a className="btn btn-primary" href="/products">Continue Shopping</a> </div>
        }else{
            var btn = <div className="submit-container">You have no products in your cart.<br /><br /><br /><br /> <a className="btn btn-primary" href="/products">Shop Now</a> </div>
        }
        return (
            <div>
                <h2>Cart</h2>
                <div className="submit-container">
                {products}</div>
                {btn}
                
            </div>
        )
    }
}
