import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resume, setResume] = useState(null);
  const [history, setHistory] = useState([]);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    fetchResume();
    fetchHistory();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await axios.get('/api/resume/latest');
      setResume(res.data.resume);
    } catch {}
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/resume/history');
      setHistory(res.data.resumes);
    } catch {}
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleUpload = async () => {
    if (!file) return toast.warn('Please select a file first.');
    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const res = await axios.post('/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResume(res.data.resume);
      setFile(null);
      fetchHistory();
      toast.success('Resume analyzed successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const scoreColor = (s) => s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">📄 Resume Analyzer</h1>
        <p className="page-subtitle">Upload your resume and get an instant AI-powered analysis</p>
      </div>

      {/* Upload Zone */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <span className="card-title">Upload Resume</span>
          <span className="badge badge-primary">PDF · DOCX · TXT · Max 5MB</span>
        </div>

        <div
          className={`upload-zone ${drag ? 'drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current.click()}
        >
          <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" hidden onChange={e => setFile(e.target.files[0])} />
          {file ? (
            <div className="file-selected">
              <div className="file-icon">📄</div>
              <div className="file-name">{file.name}</div>
              <div className="file-size">{(file.size / 1024).toFixed(1)} KB</div>
            </div>
          ) : (
            <>
              <div className="upload-icon">☁️</div>
              <div className="upload-text">Drag & drop your resume here</div>
              <div className="upload-sub">or click to browse files</div>
            </>
          )}
        </div>

        <div className="upload-actions">
          {file && <button className="btn btn-outline" onClick={() => setFile(null)}>✕ Remove</button>}
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? (
              <><span className="btn-spinner"></span> Analyzing with AI...</>
            ) : (
              '🔍 Analyze Resume'
            )}
          </button>
        </div>

        {uploading && (
          <div className="analyzing-banner">
            <div className="analyzing-dots">
              <span></span><span></span><span></span>
            </div>
            <span>Carrer Campass is analyzing your resume... this may take 15–30 seconds</span>
          </div>
        )}
      </div>

      {/* Results */}
      {resume?.status === 'completed' && (
        <div>
          {/* ATS Score */}
          <div className="content-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="card ats-card">
              <div className="ats-score-big" style={{ color: scoreColor(resume.analysis.atsScore) }}>
                {resume.analysis.atsScore}
              </div>
              <div className="ats-score-label">ATS Score</div>
              <div className="progress-bar" style={{ margin: '1rem 0' }}>
                <div className="progress-fill" style={{ width: `${resume.analysis.atsScore}%`, background: scoreColor(resume.analysis.atsScore) }}></div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                {resume.analysis.summary}
              </p>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">📋 Parsed Profile</span></div>
              <div className="parsed-info">
                <div className="parsed-row"><span>👤</span><span>{resume.parsedData?.name || '—'}</span></div>
                <div className="parsed-row"><span>📧</span><span>{resume.parsedData?.email || '—'}</span></div>
                <div className="parsed-row"><span>📱</span><span>{resume.parsedData?.phone || '—'}</span></div>
                <div className="parsed-row"><span>📍</span><span>{resume.parsedData?.location || '—'}</span></div>
              </div>
              <div className="divider"></div>
              <div className="card-title" style={{ marginBottom: '0.75rem' }}>Skills Extracted</div>
              <div className="skills-wrap">
                {resume.parsedData?.skills?.map((s, i) => (
                  <span key={i} className="skill-tag">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="content-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="card">
              <div className="card-header"><span className="card-title">✅ Strengths</span></div>
              <ul className="sw-list">
                {resume.analysis.strengths?.map((s, i) => (
                  <li key={i} className="sw-item strength"><span className="sw-dot">✓</span>{s}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">⚠️ Weaknesses</span></div>
              <ul className="sw-list">
                {resume.analysis.weaknesses?.map((w, i) => (
                  <li key={i} className="sw-item"><span className="sw-dot">!</span>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Education & Experience */}
          {resume.parsedData?.experience?.length > 0 && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header"><span className="card-title">💼 Experience</span></div>
              <div className="timeline">
                {resume.parsedData.experience.map((exp, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-title">{exp.title}</div>
                      <div className="timeline-sub">{exp.company} · {exp.duration}</div>
                      <div className="timeline-desc">{exp.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload History */}
      {history.length > 0 && (
        <div className="card">
          <div className="card-header"><span className="card-title">🕑 Upload History</span></div>
          <div className="history-list">
            {history.map((h, i) => (
              <div key={i} className="history-item">
                <div className="history-name">📄 {h.fileName}</div>
                <div className="history-meta">
                  <span className={`badge badge-${h.status === 'completed' ? 'success' : h.status === 'failed' ? 'danger' : 'warning'}`}>{h.status}</span>
                  {h.analysis?.atsScore && <span style={{ fontSize: '0.8rem', color: scoreColor(h.analysis.atsScore) }}>{h.analysis.atsScore}/100</span>}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(h.createdAt).toLocaleDateString()}</span>
                  {h.isLatest && <span className="badge badge-primary">Latest</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .upload-zone { border: 2px dashed var(--border); border-radius: 14px; padding: 3rem 2rem; text-align: center; cursor: pointer; transition: all 0.2s; margin-bottom: 1rem; }
        .upload-zone:hover, .upload-zone.drag-over { border-color: var(--primary); background: rgba(99,102,241,0.05); }
        .upload-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
        .upload-text { font-size: 1rem; font-weight: 600; margin-bottom: 0.3rem; }
        .upload-sub { font-size: 0.85rem; color: var(--text-muted); }
        .file-selected { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
        .file-icon { font-size: 2.5rem; }
        .file-name { font-weight: 600; font-size: 0.95rem; }
        .file-size { font-size: 0.8rem; color: var(--text-muted); }
        .upload-actions { display: flex; gap: 1rem; justify-content: flex-end; }
        .btn-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        .analyzing-banner { display: flex; align-items: center; gap: 1rem; margin-top: 1rem; padding: 0.9rem 1.2rem; background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2); border-radius: 10px; font-size: 0.875rem; color: var(--primary-light); }
        .analyzing-dots { display: flex; gap: 4px; }
        .analyzing-dots span { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); animation: pulse 1s ease-in-out infinite; }
        .analyzing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .analyzing-dots span:nth-child(3) { animation-delay: 0.4s; }
        .ats-card { text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ats-score-big { font-size: 5rem; font-weight: 900; line-height: 1; }
        .ats-score-label { font-size: 0.9rem; color: var(--text-muted); margin-top: 0.3rem; }
        .parsed-info { display: flex; flex-direction: column; gap: 0.5rem; }
        .parsed-row { display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; color: var(--text-secondary); }
        .skills-wrap { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .sw-list { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
        .sw-item { display: flex; gap: 0.6rem; font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; }
        .sw-dot { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; flex-shrink: 0; background: rgba(239,68,68,0.15); color: #fca5a5; }
        .sw-item.strength .sw-dot { background: rgba(16,185,129,0.15); color: #6ee7b7; }
        .timeline { display: flex; flex-direction: column; gap: 0; }
        .timeline-item { display: flex; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border); }
        .timeline-item:last-child { border-bottom: none; }
        .timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--primary); margin-top: 5px; flex-shrink: 0; }
        .timeline-title { font-weight: 600; font-size: 0.9rem; }
        .timeline-sub { font-size: 0.78rem; color: var(--text-muted); margin: 0.2rem 0; }
        .timeline-desc { font-size: 0.83rem; color: var(--text-secondary); line-height: 1.5; }
        .history-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .history-item { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background: rgba(255,255,255,0.03); border-radius: 10px; }
        .history-name { font-size: 0.875rem; font-weight: 500; }
        .history-meta { display: flex; align-items: center; gap: 0.75rem; }
      `}</style>
    </div>
  );
}
