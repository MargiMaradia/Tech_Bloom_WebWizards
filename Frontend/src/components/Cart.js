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

  // === LocalStorage helpers for guest cart ===
  const getGuestCart = () => JSON.parse(localStorage.getItem('guest_cart') || '[]');
  const saveGuestCart = (items) => localStorage.setItem('guest_cart', JSON.stringify(items));

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Guest cart
      const guestItems = getGuestCart();
      setCartItems(guestItems);
      setTotalPrice(guestItems.reduce((sum, i) => sum + (i.subtotal || i.price * i.quantity), 0));
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      setCartItems(response.data.items || []);
      setTotalPrice(parseFloat(response.data.total) || 0);
      setLoading(false);
    } catch (err) {
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

  // Recalculate total
  const recalculateTotal = useCallback(() => {
    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal || item.price * item.quantity), 0);
    setTotalPrice(total);
  }, [cartItems]);

  useEffect(() => { recalculateTotal(); }, [cartItems, recalculateTotal]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating(prev => ({ ...prev, [itemId]: true }));
    const token = localStorage.getItem('token');

    if (!token) {
      // Guest cart
      const updated = cartItems.map(item => item._id === itemId ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity } : item);
      setCartItems(updated);
      saveGuestCart(updated);
      setUpdating(prev => ({ ...prev, [itemId]: false }));
      return;
    }

    // Logged-in user
    try {
      await axios.put('http://localhost:5000/api/cart/update', { itemId, quantity: newQuantity }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const updated = cartItems.map(item => item._id === itemId ? { ...item, quantity: newQuantity, subtotal: (item.price * newQuantity).toFixed(2) } : item);
      setCartItems(updated);
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    } catch (err) {
      alert('Failed to update item quantity');
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId) => {
    if (!window.confirm('Remove this item?')) return;
    const token = localStorage.getItem('token');

    if (!token) {
      const updated = cartItems.filter(item => item._id !== itemId);
      setCartItems(updated);
      saveGuestCart(updated);
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      setCartItems(prev => prev.filter(item => item._id !== itemId));
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Clear entire cart?')) return;
    const token = localStorage.getItem('token');

    if (!token) {
      setCartItems([]);
      saveGuestCart([]);
      return;
    }

    try {
      await axios.delete('http://localhost:5000/api/cart/clear', {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      setCartItems([]);
    } catch (err) {
      alert('Failed to clear cart');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return alert('Cart is empty');

    sessionStorage.setItem('checkoutData', JSON.stringify({
      items: cartItems,
      total: totalPrice,
      type: 'cart_checkout'
    }));

    navigate('/buy-now/cart-checkout');
  };

  if (loading) return <div className="cart-container"><h2>Loading...</h2></div>;
  if (error) return <div className="cart-container"><h2>{error}</h2><button onClick={() => navigate('/login')}>Login</button></div>;

  return (
  <div className="cart-container">
    {cartItems.length === 0 ? (
      <div className="empty-cart">
        <h3>Your cart is empty!</h3>
        <button className="continue-btn" onClick={() => navigate('/products')}>
          Continue Shopping
        </button>
      </div>
    ) : (
      <>
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item._id || item.id} className="cart-item-card">
              <div className="cart-item-left">
                <img 
                  src={item.image || '/placeholder-image.jpg'} 
                  alt={item.name || item.title} 
                  className="cart-item-image"
                />
              </div>

              <div className="cart-item-middle">
                <h4 className="cart-item-title">{item.name || item.title}</h4>
                <p className="cart-item-price">₹{item.price}</p>
                <p className="cart-item-subtotal">
                  Subtotal: ₹{(item.subtotal || item.price * item.quantity).toFixed(2)}
                </p>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  className="cart-quantity-input"
                  onChange={e => updateQuantity(item._id || item.id, parseInt(e.target.value))}
                  disabled={updating[item._id || item.id]}
                />
              </div>

              <div className="cart-item-right">
                <button 
                  className="remove-btn" 
                  onClick={() => removeItem(item._id || item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
          <div className="cart-actions">
            <button onClick={() => navigate('/products')} className="continue-btn">
              Continue Shopping
            </button>
            <button onClick={handleCheckout} className="checkout-btn">
              Checkout
            </button>
            <button onClick={clearCart} className="clear-btn">
              Clear Cart
            </button>
          </div>
        </div>
      </>
    )}
  </div>
);
}
export default Cart;
