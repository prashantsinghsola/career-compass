import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Overview from '../components/dashboard/Overview';
import ResumeUpload from '../components/dashboard/ResumeUpload';
import SkillGapAnalysis from '../components/dashboard/SkillGapAnalysis';
import JobRecommendations from '../components/dashboard/JobRecommendations';
import LearningPaths from '../components/dashboard/LearningPaths';
import ProgressTracker from '../components/dashboard/ProgressTracker';
import ProfileSettings from '../components/dashboard/ProfileSettings';
import './DashboardPage.css';

const navItems = [
  { path: '', icon: <i className="fa-solid fa-house"></i>, label: 'Overview', end: true },
  { path: 'resume', icon: <i className="fa-regular fa-file"></i>, label: 'Resume' },
  { path: 'skills', icon: <i className="fa-solid fa-magnifying-glass"></i>, label: 'Skill Gaps' },
  { path: 'jobs', icon: <i className="fa-solid fa-briefcase"></i>, label: 'Jobs' },
  { path: 'learning', icon: <i className="fa-solid fa-graduation-cap"></i>, label: 'Learning' },
  { path: 'progress', icon: <i className="fa-solid fa-arrow-trend-up"></i>, label: 'Progress' },
  { path: 'profile', icon: <i className="fa-solid fa-user"></i>, label: 'Profile' },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo"> <span>Career Compass</span></div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        {/* User info */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-email">{user?.email}</div>
          </div>
        </div>

        {/* Points badge */}
        <div className="sidebar-points">
          <span>⚡</span>
          <span>{user?.points || 0} XP</span>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={`/dashboard/${item.path}`}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <span><i className="fa-solid fa-right-from-bracket"></i></span> Logout
        </button>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="dashboard-main">
        {/* Top bar */}
        <header className="dash-topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="topbar-right">
            <div className="topbar-points">⚡ {user?.points || 0} XP</div>
            <div className="topbar-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
          </div>
        </header>

        {/* Content */}
        <div className="dash-content">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="resume" element={<ResumeUpload />} />
            <Route path="skills" element={<SkillGapAnalysis />} />
            <Route path="jobs" element={<JobRecommendations />} />
            <Route path="learning" element={<LearningPaths />} />
            <Route path="progress" element={<ProgressTracker />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
