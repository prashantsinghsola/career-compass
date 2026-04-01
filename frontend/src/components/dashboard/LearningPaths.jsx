import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function LearningPaths() {
  const [resume, setResume] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      axios.get('/api/resume/latest'),
      axios.get('/api/progress'),
    ]).then(([rRes, pRes]) => {
      if (rRes.status === 'fulfilled') setResume(rRes.value.data.resume);
      if (pRes.status === 'fulfilled') setProgress(pRes.value.data.progress);
    }).finally(() => setLoading(false));
  }, []);

  const startTracking = async (skill) => {
    try {
      await axios.post('/api/progress', { skill });
      const res = await axios.get('/api/progress');
      setProgress(res.data.progress);
      toast.success(`Started tracking "${skill}" 🎯`);
    } catch (err) {
      if (err.response?.status === 400) toast.info('Already tracking this skill!');
      else toast.error('Failed to start tracking.');
    }
  };

  const updateProgress = async (id, data) => {
    try {
      await axios.put(`/api/progress/${id}`, data);
      const res = await axios.get('/api/progress');
      setProgress(res.data.progress);
      if (data.status === 'completed') toast.success('Skill completed! +100 XP 🏆');
    } catch {
      toast.error('Failed to update progress.');
    }
  };

  if (loading) return <div className="loading-screen"><div className="loader-ring"></div></div>;

  if (!resume || resume.status !== 'completed') {
    return (
      <div className="animate-fadeIn">
        <div className="page-header">
          <h1 className="page-title">📚 Learning Paths</h1>
          <p className="page-subtitle">Structured paths to master the skills you need</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <h3 style={{ marginBottom: '0.5rem' }}>No Learning Paths Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Upload your resume to get personalized learning paths.</p>
          <Link to="/dashboard/resume" className="btn btn-primary">Upload Resume →</Link>
        </div>
      </div>
    );
  }

  const paths = resume.analysis?.learningPaths || [];
  const trackedSkills = new Set(progress.map(p => p.skill));

  const platformColors = {
    Coursera: '#0056D2', Udemy: '#A435F0', YouTube: '#FF0000',
    Google: '#4285F4', AWS: '#FF9900', Microsoft: '#00A4EF',
    default: '#6366f1'
  };

  const typeIcons = { course: '🎓', article: '📖', video: '▶️', book: '📚', project: '🛠️' };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">📚 Learning Paths</h1>
        <p className="page-subtitle">AI-curated resources to bridge your skill gaps</p>
      </div>

      {/* Tracked Skills Summary */}
      {progress.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <span className="card-title">⚡ Skills You're Tracking</span>
            <span className="badge badge-primary">{progress.length} active</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {progress.map((p, i) => (
              <div key={i} className="tracked-skill">
                <div className="tracked-skill-info">
                  <span className="tracked-skill-name">{p.skill}</span>
                  <span className={`badge badge-${p.status === 'completed' ? 'success' : p.status === 'in-progress' ? 'warning' : 'info'}`}>
                    {p.status}
                  </span>
                </div>
                <div className="tracked-skill-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${p.completionPercentage}%` }}></div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: '32px', textAlign: 'right' }}>
                    {p.completionPercentage}%
                  </span>
                </div>
                {p.status !== 'completed' && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => updateProgress(p._id, { completionPercentage: Math.min(100, p.completionPercentage + 25), status: 'in-progress' })}>+25%</button>
                    <button className="btn btn-success btn-sm" onClick={() => updateProgress(p._id, { status: 'completed', completionPercentage: 100 })}>✓ Complete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Paths */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {paths.map((path, i) => {
          const isTracked = trackedSkills.has(path.skill);
          return (
            <div key={i} className="card">
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="path-skill-icon">🎯</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{path.skill}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{path.resources?.length} resources</div>
                  </div>
                </div>
                {!isTracked ? (
                  <button className="btn btn-primary btn-sm" onClick={() => startTracking(path.skill)}>
                    + Track Progress
                  </button>
                ) : (
                  <span className="badge badge-success">✓ Tracking</span>
                )}
              </div>

              <div className="resources-grid">
                {path.resources?.map((res, j) => {
                  const platformColor = Object.keys(platformColors).find(k => res.platform?.includes(k));
                  const pColor = platformColors[platformColor] || platformColors.default;
                  return (
                    <a key={j} href={res.url} target="_blank" rel="noreferrer" className="resource-card">
                      <div className="resource-card-header">
                        <span className="resource-type-icon">{typeIcons[res.type] || '🔗'}</span>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: pColor }}>{res.platform}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{res.duration}</div>
                        </div>
                      </div>
                      <div className="resource-card-title">{res.title}</div>
                      <div className="resource-card-footer">
                        <span className="badge" style={{ background: `${pColor}15`, color: pColor, border: `1px solid ${pColor}30`, fontSize: '0.68rem' }}>{res.type}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Open →</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {paths.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h3>No learning paths needed!</h3>
          <p style={{ color: 'var(--text-muted)' }}>Your resume looks comprehensive.</p>
        </div>
      )}

      <style>{`
        .tracked-skill { padding: 0.75rem; background: rgba(255,255,255,0.03); border-radius: 10px; border: 1px solid var(--border); }
        .tracked-skill-info { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
        .tracked-skill-name { font-size: 0.875rem; font-weight: 600; }
        .tracked-skill-progress { display: flex; align-items: center; gap: 0.75rem; }
        .path-skill-icon { width: 40px; height: 40px; background: rgba(99,102,241,0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
        .resources-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem; margin-top: 0.25rem; }
        .resource-card { display: flex; flex-direction: column; gap: 0.6rem; padding: 0.9rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 12px; text-decoration: none; color: var(--text-primary); transition: all 0.2s; }
        .resource-card:hover { border-color: var(--primary); background: rgba(99,102,241,0.06); transform: translateY(-2px); }
        .resource-card-header { display: flex; align-items: center; gap: 0.6rem; }
        .resource-type-icon { font-size: 1.3rem; }
        .resource-card-title { font-size: 0.82rem; font-weight: 500; line-height: 1.4; flex: 1; }
        .resource-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
      `}</style>
    </div>
  );
}
