import { Component } from "react";
import { db } from "./config/firebase";
import { onValue, ref } from "firebase/database";
import { Loader } from "./Loader";

export class ProductsList extends Component {
  state = {
    products: [],
    loading: true,
    searchQuery: '', // Added searchQuery state
  }

  componentDidMount() {
    onValue(ref(db, '/products'), (p) => {
      this.setState({
        products: p.val(),
        loading: false
      });
    });
  }

  handleSearchChange = (event) => {
    this.setState({
      searchQuery: event.target.value
    });
  }
  truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + "...";
    } else {
        return str;
    }
}

  render() {
    if (this.state.loading) {
      return <Loader />;
    }

    var products = [];
    var p = this.state.products;
    const searchQuery = this.state.searchQuery.toLowerCase();

    for (const product in p) {
      if (p[product].title.toLowerCase().includes(searchQuery)) {
        products.push(
          <div className="product-card" key={product}> <a className="product-page-link" href={`/product/${p[product].id}`}>
                        <img className="product-thumbnail" src={p[product].thumbnail} alt={p[product].title} />
                       
                            <h3 className="product-page-link-text">{p[product].title}</h3>
                        </a>
                        <h4 className="product-page-description">{this.truncateString(p[product].desc, 60)}</h4>
                    </div>
        );
      }
    }

    return (
      <div>
        <h2>All Products</h2>
        <input
          type="text"
          value={this.state.searchQuery}
          onChange={this.handleSearchChange}
          placeholder="Search Products"
        /><div className="results">
          {products.length > 0 ? products : <p>No matching products found</p>}
      </div></div>
    )
  }
}
