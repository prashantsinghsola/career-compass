import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

export default function Overview() {
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [progressStats, setProgressStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rRes, pRes] = await Promise.allSettled([
          axios.get('/api/resume/latest'),
          axios.get('/api/progress/stats/summary'),
        ]);
        if (rRes.status === 'fulfilled') setResume(rRes.value.data.resume);
        if (pRes.status === 'fulfilled') setProgressStats(pRes.value.data.stats);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const atsScore = resume?.analysis?.atsScore || 0;
  const atsColor = atsScore >= 80 ? '#10b981' : atsScore >= 60 ? '#f59e0b' : '#ef4444';
  const atsLabel = atsScore >= 80 ? 'Excellent' : atsScore >= 60 ? 'Good' : 'Needs Work';

  const radialData = [{ name: 'ATS', value: atsScore, fill: atsColor }];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="page-subtitle">Here's your career progress dashboard</p>
      </div>

      {/* Quick Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card-icon"><i className="fa-solid fa-coins"></i></div>
          <div>
            <div className="stat-card-val">{user?.points || 0}</div>
            <div className="stat-card-lbl">XP Points</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon"><i className="fa-solid fa-file-lines"></i></div>
          <div>
            <div className="stat-card-val">{user?.resumeParseCount || 0}</div>
            <div className="stat-card-lbl">Resumes Parsed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon"><i className="fa-solid fa-arrow-trend-up"></i></div>
          <div>
            <div className="stat-card-val">{progressStats?.inProgress || 0}</div>
            <div className="stat-card-lbl">Skills In Progress</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon"><i className="fa-solid fa-clipboard-check"></i></div>
          <div>
            <div className="stat-card-val">{progressStats?.completed || 0}</div>
            <div className="stat-card-lbl">Skills Completed</div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        {/* ATS Score Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title"><i className="fa-solid fa-file-circle-check"></i> ATS Resume Score</span>
            {resume && <span className={`badge badge-${atsScore >= 80 ? 'success' : atsScore >= 60 ? 'warning' : 'danger'}`}>{atsLabel}</span>}
          </div>
          {resume ? (
            <div className="ats-display">
              <ResponsiveContainer width="100%" height={160}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData} startAngle={180} endAngle={0}>
                  <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'var(--border)' }} />
                  <Tooltip formatter={(val) => [`${val}/100`, 'Score']} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="ats-score-center">
                <div className="ats-number" style={{ color: atsColor }}>{atsScore}</div>
                <div className="ats-label">out of 100</div>
              </div>
              <p className="ats-summary">{resume.analysis?.summary || 'Upload a resume to see your analysis.'}</p>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon"><i className="fa-regular fa-file"></i></div>
              <p>No resume uploaded yet</p>
              <Link to="/dashboard/resume" className="btn btn-primary btn-sm">Upload Resume</Link>
            </div>
          )}
        </div>

        {/* Skill Gaps */}
        <div className="card">
          <div className="card-header">
            <span className="card-title"><i className="fa-solid fa-code"></i> Top Skill Gaps</span>
            {resume && <Link to="/dashboard/skills" className="btn btn-outline btn-sm">View All</Link>}
          </div>
          {resume?.analysis?.skillGaps?.length > 0 ? (
            <div className="skill-gap-list">
              {resume.analysis.skillGaps.slice(0, 5).map((gap, i) => (
                <div key={i} className="skill-gap-item">
                  <div className="skill-gap-info">
                    <span className="skill-gap-name">{gap.skill}</span>
                    <span className={`badge badge-${gap.importance === 'critical' ? 'danger' : gap.importance === 'important' ? 'warning' : 'info'}`}>
                      {gap.importance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon"><i className="fa-solid fa-magnifying-glass"></i></div>
              <p>Upload your resume to see skill gaps</p>
            </div>
          )}
        </div>

        {/* Job Recommendations */}
        <div className="card">
          <div className="card-header">
            <span className="card-title"><i className="fa-solid fa-briefcase"></i> Top Job Matches</span>
            {resume && <Link to="/dashboard/jobs" className="btn btn-outline btn-sm">View All</Link>}
          </div>
          {resume?.analysis?.jobRecommendations?.length > 0 ? (
            <div className="job-list">
              {resume.analysis.jobRecommendations.slice(0, 4).map((job, i) => (
                <div key={i} className="job-item">
                  <div className="job-item-info">
                    <div className="job-item-title">{job.title}</div>
                    <div className="job-item-sub">{job.company} · {job.location}</div>
                  </div>
                  <div className="job-item-right">
                    <div className="job-match" style={{ color: job.matchScore >= 80 ? 'var(--success)' : 'var(--accent)' }}>
                      {job.matchScore}%
                    </div>
                    <a href={job.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">Apply</a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon"><i className="fa-solid fa-briefcase"></i></div>
              <p>Upload your resume to get job matches</p>
            </div>
          )}
        </div>

        {/* Strengths & Suggestions */}
        <div className="card">
          <div className="card-header">
            <span className="card-title"><i className="fa-solid fa-lightbulb"></i> AI Suggestions</span>
          </div>
          {resume?.analysis?.suggestions?.length > 0 ? (
            <>
              <div className="suggestions-section">
                <h4 className="section-mini-title"><i className="fa-solid fa-square-check"></i> Strengths</h4>
                <ul className="suggestion-list">
                  {resume.analysis.strengths?.slice(0, 3).map((s, i) => (
                    <li key={i} className="suggestion-item strength">{s}</li>
                  ))}
                </ul>
              </div>
              <div className="divider"></div>
              <div className="suggestions-section">
                <h4 className="section-mini-title">🔧 Improvements</h4>
                <ul className="suggestion-list">
                  {resume.analysis.suggestions?.slice(0, 3).map((s, i) => (
                    <li key={i} className="suggestion-item">{s}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon"><i className="fa-regular fa-lightbulb"></i></div>
              <p>Upload your resume to get AI-powered suggestions</p>
            </div>
          )}
        </div>
      </div>

      {/* Badges */}
      {user?.badges?.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header"><span className="card-title"><i className="fa-solid fa-medal"></i> Your Badges</span></div>
          <div className="badges-grid">
            {user.badges.map((b, i) => (
              <div key={i} className="badge-card">
                <div className="badge-icon">{b.icon}</div>
                <div className="badge-title">{b.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .ats-display { position: relative; text-align: center; }
        .ats-score-center { margin-top: -1.5rem; }
        .ats-number { font-size: 2.5rem; font-weight: 800; line-height: 1; }
        .ats-label { font-size: 0.8rem; color: var(--text-muted); }
        .ats-summary { font-size: 0.85rem; color: var(--text-secondary); margin-top: 1rem; line-height: 1.6; }
        .empty-state { text-align: center; padding: 2rem 1rem; }
        .empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
        .empty-state p { color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1rem; }
        .skill-gap-item { padding: 0.65rem 0; border-bottom: 1px solid var(--border); }
        .skill-gap-item:last-child { border-bottom: none; }
        .skill-gap-info { display: flex; align-items: center; justify-content: space-between; }
        .skill-gap-name { font-size: 0.875rem; font-weight: 500; }
        .job-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .job-item { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background: rgba(255,255,255,0.03); border-radius: 10px; border: 1px solid var(--border); }
        .job-item-title { font-size: 0.875rem; font-weight: 600; }
        .job-item-sub { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem; }
        .job-item-right { display: flex; align-items: center; gap: 0.75rem; }
        .job-match { font-size: 0.875rem; font-weight: 700; min-width: 36px; text-align: right; }
        .section-mini-title { font-size: 0.85rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--text-secondary); }
        .suggestion-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
        .suggestion-item { font-size: 0.83rem; color: var(--text-secondary); padding-left: 1.2rem; position: relative; line-height: 1.5; }
        .suggestion-item::before { content: '→'; position: absolute; left: 0; color: var(--primary-light); }
        .suggestion-item.strength::before { content: '✓'; color: var(--success); }
        .suggestions-section { margin-bottom: 0.25rem; }
        .badges-grid { display: flex; flex-wrap: wrap; gap: 1rem; }
        .badge-card { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid var(--border); min-width: 80px; }
        .badge-icon { font-size: 1.8rem; }
        .badge-title { font-size: 0.72rem; color: var(--text-muted); text-align: center; }
      `}</style>
    </div>
  );
}
