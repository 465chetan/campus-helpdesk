import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function DeptDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, resolved: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    axios.get('/api/complaints/stats/summary').then(r => setStats(r.data)).catch(() => {});
    axios.get('/api/complaints').then(r => setRecent(r.data.slice(0, 5))).catch(() => {});
  }, []);

  return (
    <div className="app-layout">
      <Sidebar role="staff" />
      <div className="main-content">
        <div className="page-header"><h1>Department Dashboard</h1></div>
        <div className="page-content">
          <div style={{marginBottom:24}}>
            <h2 style={{fontSize:22,fontWeight:800}}>Welcome, {user?.name} 👋</h2>
            <p style={{color:'var(--text-muted)'}}>{user?.department_name || 'Your Department'} · Manage assigned complaints</p>
          </div>
          <div className="stats-grid">
            {[
              { label: 'Total Assigned', value: stats.total, icon: 'fa-ticket', color: '#dbeafe', iconColor: '#2563eb' },
              { label: 'Pending', value: stats.pending, icon: 'fa-clock', color: '#fef3c7', iconColor: '#d97706' },
              { label: 'In Progress', value: stats.in_progress, icon: 'fa-spinner', color: '#ede9fe', iconColor: '#7c3aed' },
              { label: 'Resolved', value: stats.resolved, icon: 'fa-circle-check', color: '#d1fae5', iconColor: '#059669' },
            ].map(card => (
              <div key={card.label} className="stat-card">
                <div><div className="stat-card-value">{card.value}</div><div className="stat-card-label">{card.label}</div></div>
                <div className="stat-card-icon" style={{background:card.color}}><i className={`fa-solid ${card.icon}`} style={{color:card.iconColor}}></i></div>
              </div>
            ))}
          </div>
          <div className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <h3 style={{fontWeight:700}}>Recent Complaints</h3>
              <Link to="/dept/complaints" style={{color:'var(--accent)',fontSize:13,fontWeight:600,textDecoration:'none'}}>View All →</Link>
            </div>
            {recent.length === 0 ? (
              <div className="empty-state"><i className="fa-regular fa-inbox"></i><h3>No complaints assigned</h3></div>
            ) : recent.map(c => (
              <div key={c.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid var(--border)'}}>
                <div>
                  <div style={{display:'flex',gap:8,marginBottom:3}}>
                    <span className="ticket-id">{c.ticket_id}</span>
                    <span className={`badge badge-${c.status}`}>{c.status.replace('_',' ')}</span>
                    <span className={`badge badge-${c.priority}`}>{c.priority}</span>
                  </div>
                  <div style={{fontWeight:600}}>{c.subject}</div>
                  <div style={{fontSize:12,color:'var(--text-muted)'}}>{c.user_name} · {new Date(c.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}