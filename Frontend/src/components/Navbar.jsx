import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);

  // --- Helper for guest cart ---
  const getGuestCart = () => JSON.parse(localStorage.getItem('guest_cart') || '[]');

  // --- Fetch cart count and user profile ---
  useEffect(() => {
    updateCartCount();
    if (user) fetchUserProfile();

    // Listen for guest cart changes in other tabs
    const handleStorageChange = () => updateCartCount();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  // Fetch logged-in user's profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile(response.data.user);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  };

  // Fetch cart count (API for logged-in or localStorage for guest)
  const updateCartCount = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItemCount(response.data.itemCount || 0);
      } catch (err) {
        console.error('Failed to fetch cart count:', err);
      }
    } else {
      const guestCart = getGuestCart();
      const count = guestCart.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartItemCount(count);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUserProfile(null);
    setCartItemCount(0);
    navigate('/');
  };

  const handleProfileClick = () => navigate('/profile');

  // --- Styles ---
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
  const logoStyle = { fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', textDecoration: 'none' };
  const linksContainerStyle = { display: 'flex', alignItems: 'center', gap: '2rem' };
  const navLinksStyle = { display: 'flex', alignItems: 'center', gap: '1.5rem' };
  const linkStyle = { color: '#fff', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '4px', transition: 'all 0.3s ease', fontSize: '16px' };
  const authSectionStyle = { display: 'flex', alignItems: 'center', gap: '1rem' };
  const buttonStyle = { backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.3s ease', fontSize: '14px', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' };
  const cartButtonStyle = { ...buttonStyle, backgroundColor: '#28a745', position: 'relative' };
  const ordersButtonStyle = { ...buttonStyle, backgroundColor: '#007bff' };
  const profileButtonStyle = { ...buttonStyle, backgroundColor: '#6f42c1', position: 'relative' };
  const logoutButtonStyle = { ...buttonStyle, backgroundColor: '#dc3545' };
  const signupButtonStyle = { ...buttonStyle, backgroundColor: '#28a745' };
  const badgeStyle = { position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#dc3545', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid #333' };
  const userDropdownStyle = { position: 'absolute', top: '100%', right: 0, backgroundColor: 'white', color: '#333', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', padding: '1rem', minWidth: '250px', zIndex: 1001, display: 'none' };

  return (
    <nav style={navbarStyle}>
      <Link to="/" style={logoStyle}>ShopEase</Link>

      <div style={linksContainerStyle}>
        <div style={navLinksStyle}>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/products" style={linkStyle}>Products</Link>
          <Link to="/about" style={linkStyle}>About</Link>
          <Link to="/contact" style={linkStyle}>Contact</Link>
        </div>

        <div style={authSectionStyle}>
          <Link to="/cart" style={cartButtonStyle}>
            Cart {cartItemCount > 0 && <span style={badgeStyle}>{cartItemCount}</span>}
          </Link>

          {user ? (
            <>
              <Link to="/orders" style={ordersButtonStyle}>Orders</Link>

              <div style={{ position: 'relative' }}>
                <button
                  onClick={handleProfileClick}
                  style={profileButtonStyle}
                  onMouseEnter={e => {
                    e.target.style.backgroundColor = '#563d7c';
                    const dropdown = e.target.nextSibling;
                    if (dropdown) dropdown.style.display = 'block';
                  }}
                  onMouseLeave={e => { e.target.style.backgroundColor = '#6f42c1'; }}
                >
                  {userProfile?.name || user?.name || "Profile"}
                </button>
                <div style={userDropdownStyle} onMouseEnter={e => e.target.style.display='block'} onMouseLeave={e => e.target.style.display='none'}>
                  <div style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0 }}>{userProfile?.name || user?.name || 'User'}</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{userProfile?.email || user?.email || 'No email'}</p>
                  </div>
                  <button onClick={handleProfileClick} style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    View Full Profile
                  </button>
                </div>
              </div>

              <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={buttonStyle}>Login</Link>
              <Link to="/register" style={signupButtonStyle}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
