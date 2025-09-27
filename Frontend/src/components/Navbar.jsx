import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Clean, conflict-free Navbar implementation (inline styles)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    backgroundColor: 'var(--footer-bg)',
    color: 'var(--text)',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'var(--text)',
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
    color: 'var(--muted)',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'all 0.18s ease',
    fontSize: '16px',
    fontWeight: 700
  };

  const authSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const buttonStyle = {
    backgroundColor: 'var(--accent)',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    fontSize: '14px',
    fontWeight: '800',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const cartButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'var(--accent)',
    position: 'relative'
  };

  const ordersButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'var(--accent)'
  };

  const profileButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'var(--accent)'
  };

  const logoutButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'var(--danger)'
  };

  const signupButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'var(--accent-2)',
    color: 'var(--text)'
  };

  const badgeStyle = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: 'var(--danger)',
    color: '#fff',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    border: '2px solid var(--footer-bg)'
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
            onMouseEnter={e => e.target.style.backgroundColor = 'rgba(0,0,0,0.03)'}
            onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
          >
            Home
          </Link>
          <Link
            to="/products"
            style={linkStyle}
            onMouseEnter={e => e.target.style.backgroundColor = 'rgba(0,0,0,0.03)'}
            onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
          >
            Products
          </Link>
          <Link
            to="/about"
            style={linkStyle}
            onMouseEnter={e => e.target.style.backgroundColor = 'rgba(0,0,0,0.03)'}
            onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
          >
            About
          </Link>
          <Link
            to="/contact"
            style={linkStyle}
            onMouseEnter={e => e.target.style.backgroundColor = 'rgba(0,0,0,0.03)'}
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
                onMouseEnter={e => e.target.style.backgroundColor = 'rgba(184,139,90,0.9)'}
                onMouseLeave={e => e.target.style.backgroundColor = 'var(--accent)'}
              >
                 Cart
                {(cartItemCount || cartCount) > 0 && (
                  <span style={badgeStyle}>{cartItemCount || cartCount}</span>
                )}
              </Link>
              
              <Link
                to="/orders"
                style={ordersButtonStyle}
                onMouseEnter={e => e.target.style.backgroundColor = 'rgba(75,59,148,0.95)'}
                onMouseLeave={e => e.target.style.backgroundColor = 'var(--accent)'}
              >
                 Orders
              </Link>
              
              {/* Updated Profile Button with User Info */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={handleProfileClick}
                  style={profileButtonStyle}
                  onMouseEnter={e => {
                    e.target.style.backgroundColor = 'rgba(111,66,193,0.95)';
                    const dropdown = e.target.nextSibling;
                    if (dropdown) dropdown.style.display = 'block';
                  }}
                  onMouseLeave={e => {
                    e.target.style.backgroundColor = 'var(--accent)';
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
                onMouseEnter={e => e.target.style.backgroundColor = 'var(--danger)'}
                onMouseLeave={e => e.target.style.backgroundColor = 'var(--danger)'}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={buttonStyle}
                onMouseEnter={e => e.target.style.backgroundColor = 'rgba(75,101,255,0.95)'}
                onMouseLeave={e => e.target.style.backgroundColor = 'var(--accent)'}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={signupButtonStyle}
                onMouseEnter={e => e.target.style.backgroundColor = 'var(--accent-2)'}
                onMouseLeave={e => e.target.style.backgroundColor = 'var(--accent-2)'}
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
