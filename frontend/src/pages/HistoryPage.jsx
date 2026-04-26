import { useEffect, useState } from 'react';
import { resumeAPI } from '../api/resume';
import toast from 'react-hot-toast';
import { History, FileText, Calendar, BarChart2, Search, ChevronDown } from 'lucide-react';

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [query, setQuery] = useState('');
  const [minScore, setMinScore] = useState('0');
  const [sortBy, setSortBy] = useState('latest');

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

  const filteredAnalyses = analyses
    .filter((a) => a.matchScore >= Number(minScore || 0))
    .filter((a) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return a.resumeFileName?.toLowerCase().includes(q) || a.jobDescription?.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.matchScore - a.matchScore;
      return new Date(b.analyzedAt) - new Date(a.analyzedAt);
    });

  if (loading) return <div className="page-container"><div className="spinner spinner-large" /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1><History size={24} /> Analysis History</h1>
        <p>Your past resume analyses — {analyses.length} total</p>
      </div>

      <div className="history-toolbar">
        <label className="history-search">
          <Search size={16} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by filename or role text"
          />
        </label>
        <label>
          Minimum score
          <select value={minScore} onChange={(e) => setMinScore(e.target.value)}>
            <option value="0">Any</option>
            <option value="50">50%+</option>
            <option value="70">70%+</option>
            <option value="85">85%+</option>
          </select>
        </label>
        <label>
          Sort by
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="latest">Newest first</option>
            <option value="score">Highest score</option>
          </select>
        </label>
      </div>

      {filteredAnalyses.length === 0 ? (
        <div className="results-empty">
          <BarChart2 size={48} color="#334155" />
          <p>No analyses match these filters yet.</p>
        </div>
      ) : (
        <div className="history-list">
          {filteredAnalyses.map((a) => (
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
                <ChevronDown size={16} className={`history-chevron ${expanded === a.id ? 'open' : ''}`} />
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
