import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    currentRole: '', experience: 'fresher',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match!');
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Let\'s start your journey 🚀');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-orb orb-1"></div>
      <div className="auth-orb orb-2"></div>

      <div className="auth-container auth-register">
        <Link to="/" className="auth-logo">Career Compass</Link>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Start your AI-powered career journey today</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-input" placeholder="Prashant Singh"
                value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-input" placeholder="Min. 6 characters"
                value={form.password} onChange={handleChange} required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" name="confirmPassword" className="form-input" placeholder="Repeat password"
                value={form.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Current Role / Field</label>
              <input type="text" name="currentRole" className="form-input" placeholder="e.g. B.Tech CSE Student"
                value={form.currentRole} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Experience Level</label>
              <select name="experience" className="form-input" value={form.experience} onChange={handleChange}>
                <option value="fresher">Fresher / Student</option>
                <option value="1-2 years">1–2 Years</option>
                <option value="3-5 years">3–5 Years</option>
                <option value="5+ years">5+ Years</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg auth-btn" disabled={loading}>
            {loading ? <><span className="btn-spinner"></span>Creating Account...</> : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
