import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, FileText, History, LayoutDashboard, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <FileText size={22} />
        <Link to="/dashboard">ResumeAI</Link>
      </div>
      {user && (
        <div className="navbar-links">
          <Link to="/dashboard"><LayoutDashboard size={16} /> Analyze</Link>
          <Link to="/history"><History size={16} /> History</Link>
          {isAdmin && <Link to="/admin"><Shield size={16} /> Admin</Link>}
          <span className="navbar-user">Hi, {user.username}</span>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
