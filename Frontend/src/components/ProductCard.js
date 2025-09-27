import React from 'react';
import axios from 'axios';

function ProductCard({ product }) {
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to add items to cart');
        return;
      }

      const res = await axios.post('http://localhost:5000/api/cart/add', {
        productId: product._id,
        quantity: 1
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert('Product added to cart!');
      console.log('Added to cart:', res.data);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p className="price">${product.price}</p>
      <button 
        onClick={handleAddToCart}
        className="btn btn-primary"
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
