import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';
import bgImage from '../assets/lbg.jpg';


export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! ');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }}>
    


      <div className="auth-orb orb-1"></div>
      <div className="auth-orb orb-2"></div>

      <div className="auth-container">
        <Link to="/" className="auth-logo" >
         <img 
            src={process.env.PUBLIC_URL + '/logo.png'} // process.env.PUBLIC_URL it give full address of public folder image use on hosting time
             alt="Career Compass Logo"  
             style={{
                  width: '150px',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                }}
           />
        </Link>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to continue your career journey</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg auth-btn" disabled={loading}>
            {loading ? <><span className="btn-spinner"></span>Signing In...</> : 'Sign In →'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one free</Link>
        </p>
        <Link to="/" className="btn btn-primary btn-sm" style={{ marginTop: '1rem', display: 'inline-flex'}}>
          ← Back to Home
        </Link>
            
        {/* <div className="auth-demo">
          <p>Demo credentials: <strong>demo@test.com</strong> / <strong>demo123</strong></p>
        </div> */}
      </div>
    </div>
  );
}
