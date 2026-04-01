import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const STATUS_COLORS = {
  completed: '#10b981',
  'in-progress': '#f59e0b',
  'not-started': '#64748b',
};

export default function ProgressTracker() {
  const { user, fetchProfile } = useAuth();
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, sRes] = await Promise.all([
        axios.get('/api/progress'),
        axios.get('/api/progress/stats/summary'),
      ]);
      setProgress(pRes.data.progress);
      setStats(sRes.data.stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const pieData = stats ? [
    { name: 'Completed', value: stats.completed, color: STATUS_COLORS.completed },
    { name: 'In Progress', value: stats.inProgress, color: STATUS_COLORS['in-progress'] },
    { name: 'Not Started', value: stats.notStarted, color: STATUS_COLORS['not-started'] },
  ].filter(d => d.value > 0) : [];

  const barData = progress.map(p => ({
    name: p.skill.length > 12 ? p.skill.slice(0, 12) + '...' : p.skill,
    completion: p.completionPercentage,
    fill: STATUS_COLORS[p.status],
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.82rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>{label}</div>
          <div style={{ color: 'var(--primary-light)' }}>{payload[0].value}% complete</div>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="loading-screen"><div className="loader-ring"></div></div>;

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">📈 Progress Tracker</h1>
        <p className="page-subtitle">Track your learning journey and career readiness</p>
      </div>

      {/* XP & Badges */}
      <div className="content-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="card xp-card">
          <div className="card-header"><span className="card-title">⚡ XP Points</span></div>
          <div className="xp-display">
            <div className="xp-number">{user?.points || 0}</div>
            <div className="xp-label">Experience Points</div>
          </div>
          <div className="xp-breakdown">
            <div className="xp-item"><span>📄 Resume Upload</span><span>+50 XP</span></div>
            <div className="xp-item"><span>✅ Skill Completed</span><span>+100 XP</span></div>
            <div className="xp-item"><span>🎯 Tracking Started</span><span>+10 XP</span></div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">📊 Overview</span></div>
          {stats ? (
            <>
              <div className="stats-row" style={{ marginBottom: '1.25rem' }}>
                <div className="stat-card"><div className="stat-card-icon" style={{ background: 'rgba(16,185,129,0.1)' }}>✅</div><div><div className="stat-card-val">{stats.completed}</div><div className="stat-card-lbl">Done</div></div></div>
                <div className="stat-card"><div className="stat-card-icon" style={{ background: 'rgba(245,158,11,0.1)' }}>⏳</div><div><div className="stat-card-val">{stats.inProgress}</div><div className="stat-card-lbl">Active</div></div></div>
                <div className="stat-card"><div className="stat-card-icon">📋</div><div><div className="stat-card-val">{stats.total}</div><div className="stat-card-lbl">Total</div></div></div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Overall Completion</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{ width: `${stats.avgCompletion}%` }}></div>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{stats.avgCompletion}%</span>
                </div>
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No progress data yet. Start learning!</p>
          )}
        </div>
      </div>

      {/* Charts */}
      {progress.length > 0 && (
        <div className="content-grid" style={{ marginBottom: '1.5rem' }}>
          {/* Bar Chart */}
          <div className="card">
            <div className="card-header"><span className="card-title">📊 Skills Completion</span></div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="completion" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="card">
            <div className="card-header"><span className="card-title">🍩 Status Breakdown</span></div>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend formatter={(v) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{v}</span>} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>No data yet</p>
            )}
          </div>
        </div>
      )}

      {/* Detailed List */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">📋 All Tracked Skills</span>
          <span className="badge badge-primary">{progress.length}</span>
        </div>

        {progress.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No skills tracked yet.</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Go to Learning Paths and click "Track Progress" on a skill.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {progress.map((p, i) => (
              <div key={i} className="progress-item">
                <div className="progress-item-header">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.skill}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                      Started {new Date(p.createdAt).toLocaleDateString()}
                      {p.completedAt && ` · Completed ${new Date(p.completedAt).toLocaleDateString()}`}
                    </div>
                  </div>
                  <span className="badge" style={{
                    background: `${STATUS_COLORS[p.status]}20`,
                    color: STATUS_COLORS[p.status],
                    border: `1px solid ${STATUS_COLORS[p.status]}30`,
                  }}>
                    {p.status === 'completed' ? '✓ ' : p.status === 'in-progress' ? '⏳ ' : '○ '}
                    {p.status.replace('-', ' ')}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{ width: `${p.completionPercentage}%`, background: STATUS_COLORS[p.status] }}></div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: STATUS_COLORS[p.status], minWidth: '36px', textAlign: 'right' }}>
                    {p.completionPercentage}%
                  </span>
                </div>
                {p.resourcesAccessed?.length > 0 && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    📚 {p.resourcesAccessed.length} resource{p.resourcesAccessed.length > 1 ? 's' : ''} accessed
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .xp-display { text-align: center; padding: 1rem 0; }
        .xp-number { font-size: 3.5rem; font-weight: 900; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1; }
        .xp-label { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.3rem; }
        .xp-breakdown { margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .xp-item { display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--text-secondary); padding: 0.4rem 0; border-bottom: 1px solid var(--border); }
        .xp-item:last-child { border-bottom: none; }
        .xp-item span:last-child { color: var(--accent); font-weight: 600; }
        .progress-item { padding: 0.875rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 12px; }
        .progress-item-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
      `}</style>
    </div>
  );
}
