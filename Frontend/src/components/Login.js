import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login({ setUser }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      console.log('🔐 Attempting login for:', form.email);

      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      
      console.log('✅ Login successful:', res.data);

      // Store token in localStorage
      localStorage.setItem('token', res.data.token);
      
      // Set user in state
      setUser(res.data.user || { email: form.email });
      
      setMsg('Login successful! Redirecting...');
      
      // Redirect to home page after successful login
      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (err) {
      console.error('❌ Login error:', err);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.msg || 
                          'Login failed. Please try again.';
      
      setMsg(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={onSubmit} className="login-form">
        <h2>Login</h2>
        <p>Welcome back! Please login to your account</p>

        {msg && (
          <div className={`message ${msg.includes('successful') ? 'success-message' : 'error-message'}`}>
            {msg}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={onChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={onChange}
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className={`login-btn ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="form-links">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        <div className="register-link">
          <p>Don't have an account?</p>
          <Link to="/register">Sign up here</Link>
        </div>

        <div className="register-link" style={{ marginTop: '12px' }}>
          <p>Are you an administrator?</p>
          <Link to="/admin/login">Admin Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
