import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const features = [
  { icon: '🎯', title: 'AI Resume Analysis', desc: 'Upload your resume and get instant ATS score, detailed feedback, and actionable improvements powered by Career Campass.' },
  { icon: '🔍', title: 'Skill Gap Detection', desc: 'Identify missing skills for your dream role with curated learning resources from top platforms.' },
  { icon: '💼', title: 'Job Recommendations', desc: 'Get personalized job matches with direct LinkedIn apply links based on your skills and experience.' },
  { icon: '📈', title: 'Progress Tracking', desc: 'Track your learning journey with visual dashboards, completion metrics, and performance analytics.' },
  { icon: '🏆', title: 'Gamification & Badges', desc: 'Earn points and badges as you complete skills and apply to jobs. Stay motivated throughout your journey.' },
  { icon: '🛣️', title: 'Learning Paths', desc: 'Follow structured learning paths with courses, videos, and projects tailored to your career goals.' },
];

const stats = [
  { value: '10K+', label: 'Resumes Analyzed' },
  { value: '95%', label: 'Match Accuracy' },
  { value: '500+', label: 'Job Roles Covered' },
  { value: '50+', label: 'Learning Platforms' },
];

export default function HomePage() {
  return (
    <div className="home">
      {/* Navbar */}
      <nav className="home-nav">
        <div className="home-nav-inner">
          <div className="home-logo">
            <span className="logo-icon"><img 
      src={process.env.PUBLIC_URL + '/logo.png'} 
      alt="Career Compass Logo" 
      style={{ height: '60px', width: 'auto' }} 
    /></span>
            <span>Career Compass</span>
          </div>
          <div className="home-nav-links">
            <a href="#features">Features</a>
            <a href="#stats">Why US</a>
            <Link to="/login" className="btn btn-outline btn-sm">Log In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">AI-Powered Career Platform</div>
        <h1 className="hero-title">
          Navigate Your Career<br />
          <span className="gradient-text">With AI Intelligence</span>
        </h1>
        <p className="hero-subtitle">
          Upload your resume, discover skill gaps, get personalized job recommendations,
          and track your growth — all powered by advanced AI.
        </p>
        <div className="hero-cta">
          <Link to="/register" className="btn btn-primary btn-lg">Start For Free →</Link>
          <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
        </div>
        {/* Floating cards */}
        <div className="hero-visual">
          <div className="float-card card-1">
            <div className="fc-icon">📄</div>
            <div>
              <div className="fc-label">ATS Score</div>
              <div className="fc-value">87/100</div>
            </div>
          </div>
          <div className="float-card card-2">
            <div className="fc-icon">⚡</div>
            <div>
              <div className="fc-label">Skills Matched</div>
              <div className="fc-value">12 / 15</div>
            </div>
          </div>
          <div className="float-card card-3">
            <div className="fc-icon">💼</div>
            <div>
              <div className="fc-label">Jobs Found</div>
              <div className="fc-value">48 Matches</div>
            </div>
          </div>
          <div className="hero-orb orb-1"></div>
          <div className="hero-orb orb-2"></div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section" id="stats">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <h2 className="section-title">Everything You Need to<br /><span className="gradient-text">Land Your Dream Job</span></h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Ready to Launch Your Career?</h2>
          <p>Join thousands of students who have found their dream jobs with Career Compass.</p>
          <Link to="/register" className="btn btn-primary btn-lg">Create Free Account →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-logo">Career Compass</div>
        <p>Build by career compass team & with MERN Stack</p>
       
      {/* Connect with Founders — Footer Section */}
<div style={{ marginTop: '1rem' }}>
  <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
    Connect with Founders
  </p>
  <div style={{ display: 'flex', flexDirection: 'row',justifyContent: 'center', flexWrap: 'wrap', gap: '1.2rem' }}>
    {[
      { name: 'Prashant Singh', url: 'https://www.linkedin.com/in/prashant-singh-78ps/' },
      { name: 'Sagar Bharti',   url: 'https://www.linkedin.com/in/sagarbharti' },
      { name: 'Chhavi Kumar',   url: 'https://www.linkedin.com/in/chhavi-kumar-988395338' },
      { name: 'Vinay Mavi',     url: 'https://www.linkedin.com/in/vinay-kumar-4b4b15319/vinay-mavi' },
    ].map((f, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{f.name}</span>&nbsp;&nbsp;  
        <a href={f.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', background: 'rgba(10,102,194,0.15)', border: '1px solid rgba(10,102,194,0.3)', borderRadius: '5px' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#0A66C2">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </div>
    ))}
  </div>
</div>
        <p className="footer-copy">© 2026 Career Compass.IIMT Final Year B.Tech CSE Project.</p>
      </footer>
    </div>
  );
}
