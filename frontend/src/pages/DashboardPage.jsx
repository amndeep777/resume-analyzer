import { useState, useRef } from 'react';
import { resumeAPI } from '../api/resume';
import toast from 'react-hot-toast';
import {
  Upload,
  FileText,
  Briefcase,
  CheckCircle,
  XCircle,
  Lightbulb,
  BarChart2,
  ScanSearch,
  Gauge,
  ClipboardList,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [activeResultTab, setActiveResultTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') {
      setFile(dropped);
    } else {
      toast.error('Please upload a PDF file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { toast.error('Please upload your resume (PDF).'); return; }
    if (!jobDescription.trim()) { toast.error('Please paste a job description.'); return; }

    setLoading(true);
    setResult(null);
    setActiveResultTab('overview');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);
      const { data } = await resumeAPI.analyze(formData);
      setResult(data);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 75) return '#22c55e';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const scoreBand = result?.matchScore >= 75 ? 'Strong match' : result?.matchScore >= 50 ? 'Could be improved' : 'Needs significant updates';
  const jdWordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1><ScanSearch size={24} /> Resume Analyzer Studio</h1>
        <p>Upload your resume, drop in a job post, and get a role-fit score with targeted improvement guidance.</p>
      </div>

      <div className="analyze-grid">
        <form onSubmit={handleSubmit} className="analyze-form">
          <div
            className={`dropzone ${file ? 'dropzone--active' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file ? (
              <>
                <FileText size={32} color="#6366f1" />
                <p className="dropzone-filename">{file.name}</p>
                <span className="dropzone-hint">Click to change</span>
              </>
            ) : (
              <>
                <Upload size={32} color="#94a3b8" />
                <p>Drag & drop your resume here</p>
                <span className="dropzone-hint">PDF only · Max 10MB</span>
              </>
            )}
          </div>

          <div className="analysis-metrics">
            <div className="mini-metric-card">
              <ClipboardList size={16} />
              <div>
                <strong>{jdWordCount}</strong>
                <span>job description words</span>
              </div>
            </div>
            <div className="mini-metric-card">
              <FileText size={16} />
              <div>
                <strong>{file ? 'Attached' : 'Missing'}</strong>
                <span>resume file status</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label><Briefcase size={15} /> Job Description</label>
            <textarea
              placeholder="Paste the full job description here…"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              required
            />
            <small className="field-hint">Tip: include responsibilities, requirements, and preferred skills for better scoring.</small>
          </div>

          <button type="submit" className="btn-primary btn-large" disabled={loading}>
            {loading ? (
              <><span className="spinner" /> Analyzing with AI…</>
            ) : (
              <><BarChart2 size={18} /> Analyze Match</>
            )}
          </button>
        </form>

        <div className="results-panel">
          {!result && !loading && (
            <div className="results-empty">
              <BarChart2 size={48} color="#334155" />
              <p>Your score dashboard will appear here</p>
            </div>
          )}

          {loading && (
            <div className="results-empty">
              <div className="spinner spinner-large" />
              <p>AI is analyzing your resume…</p>
            </div>
          )}

          {result && (
            <div className="results-content">
              <div className="score-card">
                <div
                  className="score-circle"
                  style={{ '--score-color': scoreColor(result.matchScore) }}
                >
                  <span className="score-number">{result.matchScore}%</span>
                  <span className="score-label">Match</span>
                </div>
                <p className="score-band" style={{ color: scoreColor(result.matchScore) }}>
                  <Gauge size={16} /> {scoreBand}
                </p>
                <div className="score-bar-container">
                  <div
                    className="score-bar"
                    style={{
                      width: `${result.matchScore}%`,
                      backgroundColor: scoreColor(result.matchScore)
                    }}
                  />
                </div>
              </div>

              <div className="results-tabs">
                <button
                  type="button"
                  className={activeResultTab === 'overview' ? 'active' : ''}
                  onClick={() => setActiveResultTab('overview')}
                >
                  Overview
                </button>
                <button
                  type="button"
                  className={activeResultTab === 'skills' ? 'active' : ''}
                  onClick={() => setActiveResultTab('skills')}
                >
                  Skills
                </button>
                <button
                  type="button"
                  className={activeResultTab === 'suggestions' ? 'active' : ''}
                  onClick={() => setActiveResultTab('suggestions')}
                >
                  Suggestions
                </button>
              </div>

              {activeResultTab === 'overview' && (
                <div className="result-section">
                  <h3><Sparkles size={16} color="#70f0b6" /> Snapshot</h3>
                  <div className="overview-grid">
                    <div className="overview-card">
                      <span>Matched keywords</span>
                      <strong>{result.matchedKeywords?.length || 0}</strong>
                    </div>
                    <div className="overview-card">
                      <span>Missing skills</span>
                      <strong>{result.missingSkills?.length || 0}</strong>
                    </div>
                    <div className="overview-card">
                      <span>Suggestions</span>
                      <strong>{result.suggestions?.length || 0}</strong>
                    </div>
                  </div>
                </div>
              )}

              {activeResultTab === 'skills' && (
                <div className="skills-grid">
                  <div className="result-section">
                    <h3><CheckCircle size={16} color="#70f0b6" /> Matched Keywords</h3>
                    <div className="tag-list">
                      {result.matchedKeywords?.length ? result.matchedKeywords.map((k, i) => (
                        <span key={i} className="tag tag--green">{k}</span>
                      )) : <span className="empty-text">No matched keywords detected.</span>}
                    </div>
                  </div>
                  <div className="result-section">
                    <h3><XCircle size={16} color="#ff4f6d" /> Missing Skills</h3>
                    <div className="tag-list">
                      {result.missingSkills?.length ? result.missingSkills.map((s, i) => (
                        <span key={i} className="tag tag--red">{s}</span>
                      )) : <span className="empty-text">No critical missing skills found.</span>}
                    </div>
                  </div>
                </div>
              )}

              {activeResultTab === 'suggestions' && (
                <div className="result-section">
                  <h3><Lightbulb size={16} color="#f8bb33" /> Suggestions</h3>
                  <ul className="suggestions-list">
                    {(result.suggestions?.length ? result.suggestions : ['No suggestions available for this analysis.']).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
