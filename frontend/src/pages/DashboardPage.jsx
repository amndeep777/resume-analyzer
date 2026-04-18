import { useState, useRef } from 'react';
import { resumeAPI } from '../api/resume';
import toast from 'react-hot-toast';
import { Upload, FileText, Briefcase, CheckCircle, XCircle, Lightbulb, BarChart2 } from 'lucide-react';

export default function DashboardPage() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
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

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Analyze Resume</h1>
        <p>Upload your resume and paste a job description to get an AI-powered match score.</p>
      </div>

      <div className="analyze-grid">
        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="analyze-form">
          {/* PDF Drop Zone */}
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

          {/* Job Description */}
          <div className="form-group">
            <label><Briefcase size={15} /> Job Description</label>
            <textarea
              placeholder="Paste the full job description here…"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-large" disabled={loading}>
            {loading ? (
              <><span className="spinner" /> Analyzing with AI…</>
            ) : (
              <><BarChart2 size={18} /> Analyze Match</>
            )}
          </button>
        </form>

        {/* Results Panel */}
        <div className="results-panel">
          {!result && !loading && (
            <div className="results-empty">
              <BarChart2 size={48} color="#334155" />
              <p>Your analysis results will appear here</p>
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
              {/* Score */}
              <div className="score-card">
                <div
                  className="score-circle"
                  style={{ '--score-color': scoreColor(result.matchScore) }}
                >
                  <span className="score-number">{result.matchScore}%</span>
                  <span className="score-label">Match</span>
                </div>
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

              {/* Matched Keywords */}
              {result.matchedKeywords?.length > 0 && (
                <div className="result-section">
                  <h3><CheckCircle size={16} color="#22c55e" /> Matched Keywords</h3>
                  <div className="tag-list">
                    {result.matchedKeywords.map((k, i) => (
                      <span key={i} className="tag tag--green">{k}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {result.missingSkills?.length > 0 && (
                <div className="result-section">
                  <h3><XCircle size={16} color="#ef4444" /> Missing Skills</h3>
                  <div className="tag-list">
                    {result.missingSkills.map((s, i) => (
                      <span key={i} className="tag tag--red">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions?.length > 0 && (
                <div className="result-section">
                  <h3><Lightbulb size={16} color="#f59e0b" /> Suggestions</h3>
                  <ul className="suggestions-list">
                    {result.suggestions.map((s, i) => (
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
