import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ user, setUser, cartCount = 0 }) => {
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);

  // Fetch cart count when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchCartCount();
      fetchUserProfile();
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

  const navbarStyle = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
    textDecoration: 'none',
    transition: 'color 0.3s ease'
  };

  const linksContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  };

  const navLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  };

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    fontSize: '16px'
  };

  const authSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const cartButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#28a745',
    position: 'relative'
  };

  const ordersButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff'
  };

  const profileButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6f42c1',
    position: 'relative'
  };

  const logoutButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545'
  };

  const signupButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#28a745'
  };

  const badgeStyle = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#dc3545',
    color: '#fff',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    border: '2px solid #333'
  };

  const userDropdownStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: 'white',
    color: '#333',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    padding: '1rem',
    minWidth: '250px',
    zIndex: 1001,
    display: 'none'
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUserProfile(null);
    setCartItemCount(0);
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <nav style={navbarStyle}>
      <Link to="/" style={logoStyle}>
        ShopEase
      </Link>

      <div style={linksContainerStyle}>
        <div style={navLinksStyle}>
          <Link
            to="/"
            style={linkStyle}
            onMouseEnter={e => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
          >
            Home
          </Link>
          <Link
            to="/products"
            style={linkStyle}
            onMouseEnter={e => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
          >
            Products
          </Link>
          <Link
            to="/about"
            style={linkStyle}
            onMouseEnter={e => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
          >
            About
          </Link>
          <Link
            to="/contact"
            style={linkStyle}
            onMouseEnter={e => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
          >
            Contact
          </Link>
        </div>

        <div style={authSectionStyle}>
          {user ? (
            <>
              <Link
                to="/cart"
                style={cartButtonStyle}
                onMouseEnter={e => e.target.style.backgroundColor = '#218838'}
                onMouseLeave={e => e.target.style.backgroundColor = '#28a745'}
              >
                 Cart
                {(cartItemCount || cartCount) > 0 && (
                  <span style={badgeStyle}>{cartItemCount || cartCount}</span>
                )}
              </Link>
              
              <Link
                to="/orders"
                style={ordersButtonStyle}
                onMouseEnter={e => e.target.style.backgroundColor = '#0056b3'}
                onMouseLeave={e => e.target.style.backgroundColor = '#007bff'}
              >
                 Orders
              </Link>
              
              {/* Updated Profile Button with User Info */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={handleProfileClick}
                  style={profileButtonStyle}
                  onMouseEnter={e => {
                    e.target.style.backgroundColor = '#563d7c';
                    const dropdown = e.target.nextSibling;
                    if (dropdown) dropdown.style.display = 'block';
                  }}
                  onMouseLeave={e => {
                    e.target.style.backgroundColor = '#6f42c1';
                  }}
                >
                   {userProfile?.name || user?.name || "Profile"}
                </button>
                
                {/* User Info Dropdown */}
                <div 
                  style={userDropdownStyle}
                  onMouseEnter={e => e.target.style.display = 'block'}
                  onMouseLeave={e => e.target.style.display = 'none'}
                >
                  <div style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, color: '#333' }}>
                      {userProfile?.name || user?.name || 'User'}
                    </h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                      {userProfile?.email || user?.email || 'No email'}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleProfileClick}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      marginTop: '0.5rem',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                style={logoutButtonStyle}
                onMouseEnter={e => e.target.style.backgroundColor = '#c82333'}
                onMouseLeave={e => e.target.style.backgroundColor = '#dc3545'}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={buttonStyle}
                onMouseEnter={e => e.target.style.backgroundColor = '#0056b3'}
                onMouseLeave={e => e.target.style.backgroundColor = '#007bff'}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={signupButtonStyle}
                onMouseEnter={e => e.target.style.backgroundColor = '#218838'}
                onMouseLeave={e => e.target.style.backgroundColor = '#28a745'}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
