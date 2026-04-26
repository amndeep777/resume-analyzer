import { useEffect, useState } from 'react';
import { adminAPI } from '../api/admin';
import toast from 'react-hot-toast';
import { Shield, Users, BarChart2, Search, UserCog } from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    Promise.all([adminAPI.getStats(), adminAPI.getUsers()])
      .then(([statsRes, usersRes]) => {
        setStats(statsRes.data);
        setUsers(usersRes.data);
      })
      .catch(() => toast.error('Failed to load admin data.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === 'ALL' ? true : u.role === roleFilter;
    const q = query.trim().toLowerCase();
    const matchQuery = !q || u.username?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    return matchRole && matchQuery;
  });

  const adminCount = users.filter((u) => u.role === 'ADMIN').length;

  if (loading) return <div className="page-container"><div className="spinner spinner-large" /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1><Shield size={24} /> Admin Dashboard</h1>
        <p>Platform overview — full charts coming in Task 7</p>
      </div>

      {stats && (
        <div className="admin-stats-grid">
          <div className="stat-card">
            <Users size={28} color="#52d7ff" />
            <div>
              <div className="stat-number">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>
          <div className="stat-card">
            <BarChart2 size={28} color="#15d66f" />
            <div>
              <div className="stat-number">{stats.totalAnalyses}</div>
              <div className="stat-label">Total Analyses</div>
            </div>
          </div>
          <div className="stat-card">
            <UserCog size={28} color="#f8bb33" />
            <div>
              <div className="stat-number">{adminCount}</div>
              <div className="stat-label">Admin Accounts</div>
            </div>
          </div>
        </div>
      )}

      <div className="admin-toolbar">
        <label className="history-search">
          <Search size={16} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users"
          />
        </label>
        <label>
          Role
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="ALL">All roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
        </label>
      </div>

      <div className="admin-table-wrapper">
        <h2>All Users ({filteredUsers.length})</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td><span className={`role-badge role-badge--${u.role?.toLowerCase()}`}>{u.role}</span></td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
