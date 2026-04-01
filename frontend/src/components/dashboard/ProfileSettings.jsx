import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function ProfileSettings() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    currentRole: user?.currentRole || '',
    targetRole: user?.targetRole || '',
    experience: user?.experience || 'fresher',
    linkedinUrl: user?.linkedinUrl || '',
    githubUrl: user?.githubUrl || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated! ✅');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">👤 Profile Settings</h1>
        <p className="page-subtitle">Manage your account and career preferences</p>
      </div>

      <div className="content-grid">
        {/* Profile Card */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '2rem' }}>
            <div className="profile-avatar-big">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <h2 style={{ marginTop: '1rem', marginBottom: '0.25rem' }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user?.email}</p>
            {user?.currentRole && (
              <span className="badge badge-primary" style={{ marginTop: '0.75rem' }}>{user.currentRole}</span>
            )}

            <div className="divider"></div>

            <div className="profile-stats-grid">
              <div className="profile-stat">
                <div className="profile-stat-val" style={{ color: 'var(--accent)' }}>{user?.points || 0}</div>
                <div className="profile-stat-lbl">XP Points</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-val">{user?.resumeParseCount || 0}</div>
                <div className="profile-stat-lbl">Resumes</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-val">{user?.badges?.length || 0}</div>
                <div className="profile-stat-lbl">Badges</div>
              </div>
            </div>
          </div>

          {/* Badges */}
          {user?.badges?.length > 0 && (
            <div className="card">
              <div className="card-header"><span className="card-title">🏆 Earned Badges</span></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {user.badges.map((b, i) => (
                  <div key={i} className="badge-display">
                    <span style={{ fontSize: '1.5rem' }}>{b.icon}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Edit Form */}
        <div className="card">
          <div className="card-header"><span className="card-title">✏️ Edit Profile</span></div>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" value={user?.email} disabled style={{ opacity: 0.5 }} />
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Current Role / Field</label>
                <input type="text" name="currentRole" className="form-input" placeholder="e.g. B.Tech CSE Student" value={form.currentRole} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Target Role</label>
                <input type="text" name="targetRole" className="form-input" placeholder="e.g. Full Stack Developer" value={form.targetRole} onChange={handleChange} />
              </div>
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

            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input type="url" name="linkedinUrl" className="form-input" placeholder="https://linkedin.com/in/yourprofile" value={form.linkedinUrl} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input type="url" name="githubUrl" className="form-input" placeholder="https://github.com/yourusername" value={form.githubUrl} onChange={handleChange} />
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
              {saving ? <><span className="btn-spinner"></span> Saving...</> : '💾 Save Changes'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .profile-avatar-big { width: 80px; height: 80px; background: var(--gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; color: white; margin: 0 auto; }
        .profile-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem; }
        .profile-stat { text-align: center; }
        .profile-stat-val { font-size: 1.4rem; font-weight: 800; }
        .profile-stat-lbl { font-size: 0.75rem; color: var(--text-muted); }
        .badge-display { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; padding: 0.75rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 12px; min-width: 60px; }
        .btn-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
      `}</style>
    </div>
  );
}
