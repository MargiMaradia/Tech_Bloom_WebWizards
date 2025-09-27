import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// styles consolidated into App.css

const Navbar = ({ user, setUser, cartCount = 0 }) => {
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCartCount();
      fetchUserProfile();
    } else {
      setCartItemCount(0);
    }
  }, [user]);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItemCount(response.data.itemCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserProfile(response.data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUserProfile(null);
    setCartItemCount(0);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="logo">ShopEase</Link>

        <div className="nav-wrap">
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>
        </div>

        <div className="auth-section">
          {user ? (
            <>
              <Link to="/cart" className="btn btn-ghost icon-badge">
                Cart
                {(cartItemCount || cartCount) > 0 && (
                  <span className="badge">{cartItemCount || cartCount}</span>
                )}
              </Link>

              <Link to="/orders" className="btn btn-ghost">Orders</Link>

              <div className="profile-wrap">
                <button
                  className="btn btn-primary profile-button"
                  onClick={() => { setShowDropdown(s => !s); }}
                >
                  {userProfile?.name || user?.name || 'Profile'}
                </button>

                <div className={`profile-dropdown ${showDropdown ? 'open' : ''}`}>
                  <div className="profile-card">
                    <div>
                      <strong>{userProfile?.name || user?.name || 'User'}</strong>
                      <div className="text-muted" style={{fontSize:12}}>{userProfile?.email || user?.email || ''}</div>
                    </div>
                    <div>
                      <button className="btn btn-ghost" onClick={() => navigate('/profile')}>View Profile</button>
                    </div>
                  </div>
                  <div className="dropdown-actions">
                    <button className="btn btn-ghost" onClick={() => { navigate('/orders'); setShowDropdown(false); }}>My Orders</button>
                    <button className="btn" onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              </div>

            </>
            ) : (
            <>
              <Link to="/login" className="shop-now">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
