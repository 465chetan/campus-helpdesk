import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, resolved: 0, assigned: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    axios.get('https://mru-helpdesk-backend.onrender.com/api/complaints/stats/summary')
      .then(r => setStats(r.data)).catch(() => {});
    axios.get('https://mru-helpdesk-backend.onrender.com/api/complaints')
      .then(r => setRecent(r.data.slice(0, 8))).catch(() => {});
  }, []);

  const statCards = [
    { label: 'Total Complaints', value: stats.total, icon: 'fa-clipboard-list', bg: '#e0e7ff', iconColor: '#4f46e5' },
    { label: 'Pending', value: stats.pending, icon: 'fa-clock', bg: '#fef3c7', iconColor: '#d97706' },
    { label: 'In Progress', value: stats.in_progress, icon: 'fa-triangle-exclamation', bg: '#ede9fe', iconColor: '#7c3aed' },
    { label: 'Resolved', value: stats.resolved, icon: 'fa-circle-check', bg: '#d1fae5', iconColor: '#059669' },
  ];

  return (
    <div style={{ display: 'flex', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Sidebar role="admin" />
      <div style={{ marginLeft: 260, flex: 1, minHeight: '100vh', background: '#f0f4f8' }}>

        {/* Header */}
        <div style={{
          background: 'white', padding: '14px 28px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 50
        }}>
          <h1 style={{ fontSize: 19, fontWeight: 700, margin: 0 }}>Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 13 }}></i>
              <input placeholder="Search..." style={{ paddingLeft: 32, paddingRight: 14, paddingTop: 8, paddingBottom: 8, border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', width: 200 }} />
            </div>
            <i className="fa-regular fa-bell" style={{ fontSize: 18, color: '#64748b', cursor: 'pointer' }}></i>
          </div>
        </div>

        <div style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Welcome, {user?.name}! 👋</h2>
              <p style={{ color: '#64748b', marginTop: 4 }}>Manage and monitor all campus complaints</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/admin/reports" style={{ background: 'white', color: '#1e293b', border: '1.5px solid #e2e8f0', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="fa-solid fa-chart-bar"></i> Reports
              </Link>
              <Link to="/admin/complaints" style={{ background: '#ff6b35', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="fa-solid fa-ticket"></i> All Complaints
              </Link>
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
            {statCards.map(card => (
              <div key={card.label} style={{
                background: 'white', borderRadius: 12, padding: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
              }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{card.value}</div>
                  <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 4 }}>{card.label}</div>
                </div>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`fa-solid ${card.icon}`} style={{ fontSize: 22, color: card.iconColor }}></i>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Complaints Table */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, margin: 0 }}>Recent Complaints</h3>
              <Link to="/admin/complaints" style={{ color: '#ff6b35', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Ticket ID', 'Subject', 'User', 'Category', 'Priority', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ padding: '11px 14px', fontSize: 11.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '13px 14px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 12.5, fontWeight: 700, color: '#1a2942' }}>{c.ticket_id}</span>
                      </td>
                      <td style={{ padding: '13px 14px', fontWeight: 600, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.subject}</td>
                      <td style={{ padding: '13px 14px' }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{c.user_name}</div>
                        <div style={{ fontSize: 11.5, color: '#94a3b8' }}>{c.user_email}</div>
                      </td>
                      <td style={{ padding: '13px 14px', textTransform: 'capitalize', fontSize: 13 }}>{c.category?.replace('_', ' ')}</td>
                      <td style={{ padding: '13px 14px' }}>
                        <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 600, background: c.priority === 'high' ? '#fef2f2' : c.priority === 'medium' ? '#fefce8' : '#f0fdf4', color: c.priority === 'high' ? '#dc2626' : c.priority === 'medium' ? '#ca8a04' : '#16a34a' }}>
                          {c.priority}
                        </span>
                      </td>
                      <td style={{ padding: '13px 14px' }}>
                        <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 600, background: c.status === 'pending' ? '#fef3c7' : c.status === 'resolved' ? '#d1fae5' : c.status === 'in_progress' ? '#ede9fe' : '#dbeafe', color: c.status === 'pending' ? '#d97706' : c.status === 'resolved' ? '#059669' : c.status === 'in_progress' ? '#7c3aed' : '#2563eb' }}>
                          {c.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '13px 14px', fontSize: 12, color: '#94a3b8' }}>
                        {new Date(c.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
