import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError(null);
    setMsg(null);
    try {
      // adjust the URL if needed
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      setMsg(res.data.msg || 'Registration successful! Please login.');
      // Optionally redirect to login in 2s
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        err.response?.data?.error ||
        'Error registering. Please try again.'
      );
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 520 }}>
      <div className="card shadow">
        <h2 className="mb-3">Register</h2>
        {msg && <div className="alert alert-success mb-3">{msg}</div>}
        {error && <div className="alert alert-danger mb-3">{error}</div>}
        <form onSubmit={onSubmit} className="form">
          <div>
            <label className="label">Name</label>
            <input className="input" name="name" placeholder="Name" value={form.name} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
          </div>
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
