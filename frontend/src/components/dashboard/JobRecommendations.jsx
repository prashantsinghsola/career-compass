import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function JobRecommendations() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/resume/latest')
      .then(r => setResume(r.data.resume))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="loader-ring"></div></div>;

  if (!resume || resume.status !== 'completed') {
    return (
      <div className="animate-fadeIn">
        <div className="page-header">
          <h1 className="page-title"><i className="fa-solid fa-briefcase"></i> Job Recommendations</h1>
          <p className="page-subtitle">AI-matched jobs based on your resume</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}><i className="fa-solid fa-briefcase"></i></div>
          <h3 style={{ marginBottom: '0.5rem' }}>No Recommendations Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Upload your resume to get personalized job recommendations.</p>
          <Link to="/dashboard/resume" className="btn btn-primary">Upload Resume →</Link>
        </div>
      </div>
    );
  }

  const allJobs = resume.analysis?.jobRecommendations || [];
  const types = ['all', ...new Set(allJobs.map(j => j.type))];

  const filtered = allJobs.filter(j => {
    const matchType = filter === 'all' || j.type === filter;
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const matchColor = (s) => s >= 85 ? '#10b981' : s >= 70 ? '#f59e0b' : '#94a3b8';
  const typeLabel = { 'full-time': 'Full Time', 'part-time': 'Part Time', internship: 'Internship', contract: 'Contract' };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title"><i className="fa-solid fa-briefcase"></i> Job Recommendations</h1>
        <p className="page-subtitle">{allJobs.length} jobs matched based on your resume — apply directly via LinkedIn</p>
      </div>

      {/* Filters */}
      <div className="filters-bar" style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search by title or company..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <div className="filter-tabs">
          {types.map(t => (
            <button
              key={t}
              className={`filter-tab ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t === 'all' ? 'All' : typeLabel[t] || t}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon"><i className="fa-solid fa-briefcase"></i></div>
          <div><div className="stat-card-val">{allJobs.length}</div><div className="stat-card-lbl">Total Matches Jobs</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon"><i className="fa-solid fa-stairs"></i></div>
          <div><div className="stat-card-val">{allJobs.filter(j => j.matchScore >= 85).length}</div><div className="stat-card-lbl">High Match Job (85%+)</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon"><i className="fa-solid fa-graduation-cap"></i></div>
          <div><div className="stat-card-val">{allJobs.filter(j => j.type === 'internship').length}</div><div className="stat-card-lbl">Internships</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon"><i className="fa-solid fa-business-time"></i></div>
          <div><div className="stat-card-val">{allJobs.filter(j => j.type === 'full-time').length}</div><div className="stat-card-lbl">Full-Time Roles</div></div>
        </div>
      </div>

      {/* Jobs Grid */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No jobs match your filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((job, i) => (
            <div key={i} className="job-card card">
              {/* Match Score Badge */}
              <div className="job-match-badge" style={{ background: `${matchColor(job.matchScore)}20`, color: matchColor(job.matchScore), border: `1px solid ${matchColor(job.matchScore)}40` }}>
                {job.matchScore}% Match
              </div>

              <div className="job-card-header">
                <div className="job-company-avatar">
                  {job.company?.charAt(0) || '?'}
                </div>
                <div>
                  <h3 className="job-title">{job.title}</h3>
                  <div className="job-company">{job.company}</div>
                </div>
              </div>

              <div className="job-meta">
                <span><i className="fa-solid fa-location-dot"></i> {job.location}</span>
                <span><i className="fa-solid fa-hand-holding-dollar"></i> {job.salary}</span>
              </div>
              <span className={`badge badge-${job.type === 'internship' ? 'info' : 'primary'}`} style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
                {typeLabel[job.type] || job.type}
              </span>

              <p className="job-desc">{job.description}</p>

              <div className="job-skills">
                {job.skills?.slice(0, 4).map((s, j) => (
                  <span key={j} className="skill-tag" style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}>{s}</span>
                ))}
                {job.skills?.length > 4 && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>+{job.skills.length - 4} more</span>}
              </div>

              <a
                href={job.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
              >
                Apply on LinkedIn →
              </a>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .filters-bar { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .filter-tabs { display: flex; gap: 0.4rem; flex-wrap: wrap; }
        .filter-tab { padding: 0.4rem 1rem; border-radius: 20px; border: 1px solid var(--border); background: transparent; color: var(--text-secondary); cursor: pointer; font-size: 0.82rem; font-family: inherit; transition: all 0.2s; }
        .filter-tab:hover { border-color: var(--primary); color: var(--primary-light); }
        .filter-tab.active { background: rgba(99,102,241,0.15); border-color: var(--primary); color: var(--primary-light); }
        .job-card { position: relative; display: flex; flex-direction: column; transition: transform 0.2s; }
        .job-card:hover { transform: translateY(-3px); }
        .job-match-badge { position: absolute; top: 1rem; right: 1rem; padding: 0.25rem 0.65rem; border-radius: 12px; font-size: 0.75rem; font-weight: 700; }
        .job-card-header { display: flex; align-items: center; gap: 0.875rem; margin-bottom: 0.75rem; padding-right: 80px; }
        .job-company-avatar { width: 44px; height: 44px; border-radius: 10px; background: var(--gradient); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; color: white; flex-shrink: 0; }
        .job-title { font-size: 0.95rem; font-weight: 700; line-height: 1.3; }
        .job-company { font-size: 0.8rem; color: var(--text-muted); }
        .job-meta { display: flex; gap: 1rem; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.5rem; flex-wrap: wrap; }
        .job-desc { font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 0.75rem; flex: 1; }
        .job-skills { display: flex; flex-wrap: wrap; gap: 0.35rem; }
      `}</style>
    </div>
  );
}
