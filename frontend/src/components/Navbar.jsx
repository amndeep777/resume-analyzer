import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, FileText, History, LayoutDashboard, Shield, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-shell">
        <Link to={user ? '/dashboard' : '/login'} className="navbar-brand">
          <FileText size={22} />
          <span>ResumeIQ</span>
        </Link>

        {user && (
          <button
            className="navbar-menu-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        )}

        {user ? (
          <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}><LayoutDashboard size={16} /> Analyze</Link>
            <Link to="/history" onClick={() => setMenuOpen(false)}><History size={16} /> History</Link>
            {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)}><Shield size={16} /> Admin</Link>}
            <span className="navbar-user">Hi, {user.username}</span>
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <div className="navbar-links navbar-links--public">
            <Link to="/login"><Sparkles size={16} /> Sign In</Link>
            <Link to="/register" className="btn-primary">Create Account</Link>
          </div>
        )}
      </div>
      {menuOpen && <button className="navbar-mobile-overlay" onClick={() => setMenuOpen(false)} aria-label="Close menu" />}
    </nav>
  );
}
