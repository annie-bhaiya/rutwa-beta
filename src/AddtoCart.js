import React, { useState } from "react";


const AddToCart = ({ addToCart }) => {
    const [quantity, setQuantity] = useState(1);
  
    const handleInputChange = (event) => {
      setQuantity(event.target.value);
    };
  
    return (
      <div>
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            min="1"
          />
        </label>
        <button onClick={() => addToCart(quantity)}>Add to Cart</button>
      </div>
    );
  };
  
  export default AddToCart;
  