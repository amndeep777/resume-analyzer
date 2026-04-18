import { useEffect, useState } from 'react';
import { resumeAPI } from '../api/resume';
import toast from 'react-hot-toast';
import { History, FileText, Calendar, BarChart2 } from 'lucide-react';

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    resumeAPI.getHistory()
      .then(({ data }) => setAnalyses(data))
      .catch(() => toast.error('Failed to load history.'))
      .finally(() => setLoading(false));
  }, []);

  const scoreColor = (score) => {
    if (score >= 75) return '#22c55e';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) return <div className="page-container"><div className="spinner spinner-large" /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1><History size={24} /> Analysis History</h1>
        <p>Your past resume analyses — {analyses.length} total</p>
      </div>

      {analyses.length === 0 ? (
        <div className="results-empty">
          <BarChart2 size={48} color="#334155" />
          <p>No analyses yet. Upload your first resume!</p>
        </div>
      ) : (
        <div className="history-list">
          {analyses.map((a) => (
            <div
              key={a.id}
              className={`history-card ${expanded === a.id ? 'history-card--open' : ''}`}
            >
              <div className="history-card-header" onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
                <div className="history-card-left">
                  <FileText size={18} />
                  <span className="history-filename">{a.resumeFileName}</span>
                  <span className="history-date">
                    <Calendar size={13} />
                    {new Date(a.analyzedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="history-score" style={{ color: scoreColor(a.matchScore) }}>
                  {a.matchScore}% match
                </div>
              </div>

              {expanded === a.id && (
                <div className="history-card-body">
                  <div className="result-section">
                    <h4>Job Description</h4>
                    <p className="jd-preview">{a.jobDescription?.slice(0, 300)}…</p>
                  </div>
                  {a.matchedKeywords?.length > 0 && (
                    <div className="result-section">
                      <h4>Matched Keywords</h4>
                      <div className="tag-list">
                        {a.matchedKeywords.map((k, i) => <span key={i} className="tag tag--green">{k}</span>)}
                      </div>
                    </div>
                  )}
                  {a.missingSkills?.length > 0 && (
                    <div className="result-section">
                      <h4>Missing Skills</h4>
                      <div className="tag-list">
                        {a.missingSkills.map((s, i) => <span key={i} className="tag tag--red">{s}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
