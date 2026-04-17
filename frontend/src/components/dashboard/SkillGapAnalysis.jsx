import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function SkillGapAnalysis() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/resume/latest')
      .then(r => setResume(r.data.resume))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const importanceConfig = {
    critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', icon: '🔴' },
    important: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', icon: '🟡' },
    'nice-to-have': { color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)', icon: '🔵' },
  };

  const resourceIcon = (type) => ({ video: '▶️', article: '📖', course: '🎓', book: '📚', project: '🛠️' }[type] || '🔗');

  if (loading) return <div className="loading-screen"><div className="loader-ring"></div></div>;

  if (!resume || resume.status !== 'completed') {
    return (
      <div className="animate-fadeIn">
        <div className="page-header">
          <h1 className="page-title">Skill Gap Analysis</h1>
          <p className="page-subtitle">Discover skills you need to land your dream job</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
          <h3 style={{ marginBottom: '0.5rem' }}>No Analysis Available</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Upload and analyze your resume first to see skill gaps.</p>
          <Link to="/dashboard/resume" className="btn btn-primary">Upload Resume →</Link>
        </div>
      </div>
    );
  }

  const gaps = resume.analysis?.skillGaps || [];
  const existingSkills = resume.parsedData?.skills || [];
  const critical = gaps.filter(g => g.importance === 'critical');
  const important = gaps.filter(g => g.importance === 'important');
  const niceToHave = gaps.filter(g => g.importance === 'nice-to-have');

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">Skill Gap Analysis</h1>
        <p className="page-subtitle">AI-identified gaps and curated resources to bridge them</p>
      </div>

      {/* Summary Stats */}
      <div className="stats-row" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(16,185,129,0.1)' }}>✅</div>
          <div>
            <div className="stat-card-val">{existingSkills.length}</div>
            <div className="stat-card-lbl">Skills You Have</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(239,68,68,0.1)' }}>🔴</div>
          <div>
            <div className="stat-card-val">{critical.length}</div>
            <div className="stat-card-lbl">Critical Gaps</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(245,158,11,0.1)' }}>🟡</div>
          <div>
            <div className="stat-card-val">{important.length}</div>
            <div className="stat-card-lbl">Important Gaps</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(6,182,212,0.1)' }}>🔵</div>
          <div>
            <div className="stat-card-val">{niceToHave.length}</div>
            <div className="stat-card-lbl">Nice to Have</div>
          </div>
        </div>
      </div>

      {/* Current Skills */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <span className="card-title">Your Current Skills</span>
          <span className="badge badge-success">{existingSkills.length} skills</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {existingSkills.map((s, i) => (
            <span key={i} className="skill-tag" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.25)', color: '#6ee7b7' }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Skill Gaps */}
      {gaps.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
          <h3>Great Resume!</h3>
          <p style={{ color: 'var(--text-muted)' }}>No significant skill gaps detected.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {gaps.map((gap, i) => {
            const cfg = importanceConfig[gap.importance] || importanceConfig['nice-to-have'];
            return (
              <div key={i} className="card" style={{ borderColor: cfg.border }}>
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{cfg.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{gap.skill}</div>
                      <span style={{
                        display: 'inline-block', marginTop: '0.2rem',
                        padding: '0.15rem 0.6rem', borderRadius: '12px',
                        fontSize: '0.72rem', fontWeight: 600,
                        background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`
                      }}>{gap.importance}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Learning Resources
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.6rem' }}>
                    {gap.resources?.map((res, j) => (
                      <a key={j} href={res.url} target="_blank" rel="noreferrer" className="resource-link">
                        <span className="resource-icon">{resourceIcon(res.type)}</span>
                        <div className="resource-info">
                          <div className="resource-title">{res.title}</div>
                          <div className="resource-type">{res.type}</div>
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>→</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .resource-link { display: flex; align-items: center; gap: 0.7rem; padding: 0.7rem 0.9rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 10px; text-decoration: none; color: var(--text-primary); transition: all 0.2s; }
        .resource-link:hover { border-color: var(--primary); background: rgba(99,102,241,0.06); }
        .resource-icon { font-size: 1.1rem; flex-shrink: 0; }
        .resource-title { font-size: 0.82rem; font-weight: 500; line-height: 1.3; }
        .resource-type { font-size: 0.7rem; color: var(--text-muted); text-transform: capitalize; margin-top: 0.1rem; }
        .resource-info { flex: 1; min-width: 0; }
      `}</style>
    </div>
  );
}
