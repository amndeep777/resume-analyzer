import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FileText, Mail, Lock, Sparkles, Target, WandSparkles } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-showcase">
        <div className="auth-showcase-chip"><Sparkles size={14} /> Career-grade resume scoring</div>
        <h1>Land interviews with a resume that actually matches the role.</h1>
        <p>ResumeIQ compares your resume to job requirements, highlights missing skills, and tells you exactly what to improve.</p>
        <div className="auth-showcase-points">
          <div><Target size={16} /> Instant match scoring</div>
          <div><WandSparkles size={16} /> Practical AI suggestions</div>
        </div>
      </section>
      <div className="auth-card">
        <div className="auth-logo">
          <FileText size={36} />
          <h1>ResumeIQ</h1>
          <p>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label><Mail size={14} /> Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label><Lock size={14} /> Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="auth-footer">
          Do not have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
