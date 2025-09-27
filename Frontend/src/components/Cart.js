import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [updating, setUpdating] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view your cart');
        setLoading(false);
        return;
      }

      console.log('🛒 Fetching cart items...');
      
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Cart data received:', response.data);
      
      setCartItems(response.data.items || []);
      setTotalPrice(parseFloat(response.data.total) || 0);
      setLoading(false);

    } catch (err) {
      console.error('❌ Failed to fetch cart:', err);
      
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to load cart items');
      }
      setLoading(false);
    }
  };

  // Recalculate total price whenever cartItems change
  const recalculateTotal = useCallback(() => {
    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);
    setTotalPrice(total);
  }, [cartItems]);

  useEffect(() => {
    recalculateTotal();
  }, [cartItems, recalculateTotal]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.put('http://localhost:5000/api/cart/update', {
        itemId: itemId,
        quantity: newQuantity
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Update local state immediately for better UX
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === itemId 
            ? { ...item, quantity: newQuantity, subtotal: (item.price * newQuantity).toFixed(2) }
            : item
        )
      );

      setUpdating(prev => ({ ...prev, [itemId]: false }));
      console.log('✅ Quantity updated successfully');
      
    } catch (err) {
      console.error('❌ Failed to update quantity:', err);
      alert('Failed to update item quantity');
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item from cart?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:5000/api/cart/remove/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Remove item from local state
      setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
      console.log('✅ Item removed successfully');
      
    } catch (err) {
      console.error('❌ Failed to remove item:', err);
      alert('Failed to remove item from cart');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Navigate to buy-now page with cart data
    const checkoutData = {
      items: cartItems,
      total: totalPrice,
      type: 'cart_checkout'
    };
    
    // Store checkout data temporarily
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    
    // Navigate to buy-now page
    navigate('/buy-now/cart-checkout');
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      await axios.delete('http://localhost:5000/api/cart/clear', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setCartItems([]);
      setTotalPrice(0);
      console.log('✅ Cart cleared successfully');
      
    } catch (err) {
      console.error('❌ Failed to clear cart:', err);
      alert('Failed to clear cart');
    }
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading">
          <h2>Loading your cart...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <div className="error">
          <h2>Cart Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <div className="header-content">
          <h2>Your Shopping Cart</h2>
          <p className="cart-count">
            {cartItems.length === 0 ? 'No items in cart' : `${cartItems.length} item(s) in cart`}
          </p>
        </div>
        {cartItems.length > 0 && (
          <button onClick={clearCart} className="btn-clear">
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty!</h3>
          <p>Add some products to your cart to see them here.</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.image || '/placeholder-image.jpg'} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  <p className="item-category">Category: {item.category}</p>
                  <p className="item-price">₹{item.price}</p>
                </div>
                
                <div className="item-quantity">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updating[item._id]}
                      className="qty-btn"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > 0 && value <= 99) {
                          updateQuantity(item._id, value);
                        }
                      }}
                      className="quantity-input"
                      disabled={updating[item._id]}
                    />
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={updating[item._id] || item.quantity >= 99}
                      className="qty-btn"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  {updating[item._id] && <span className="updating">Updating...</span>}
                </div>
                
                <div className="item-subtotal">
                  <p><strong>₹{item.subtotal}</strong></p>
                </div>
                
                <div className="item-actions">
                  <button 
                    onClick={() => removeItem(item._id)}
                    className="btn-remove"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-details">
              <h3>Order Summary</h3>
              <div className="summary-line">
                <span>Items ({cartItems.length}):</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Shipping:</span>
                <span className="free-shipping">FREE</span>
              </div>
              <div className="summary-line total">
                <span><strong>Total:</strong></span>
                <span><strong>₹{totalPrice.toFixed(2)}</strong></span>
              </div>
            </div>
            
            <div className="checkout-actions">
              <button 
                onClick={() => navigate('/products')} 
                className="btn-secondary"
              >
                Continue Shopping
              </button>
              <button 
                onClick={handleCheckout} 
                className="btn-checkout"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout ({cartItems.length})
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
