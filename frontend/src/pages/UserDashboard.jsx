import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const QUICK_CATS = [
  { key: 'library', label: 'Library', icon: '📚', desc: 'Books, resources, facilities' },
  { key: 'transport', label: 'Transport', icon: '🚌', desc: 'Bus routes, schedules, issues' },
  { key: 'hostel', label: 'Hostel', icon: '🏠', desc: 'Accommodation, rooms, facilities' },
  { key: 'canteen', label: 'Canteen', icon: '🍽️', desc: 'Food services' },
  { key: 'it_support', label: 'IT Support', icon: '💻', desc: 'Network, computers' },
  { key: 'maintenance', label: 'Maintenance', icon: '🔧', desc: 'Repairs, electrical' },
];

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, resolved: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/complaints/stats/summary')
      .then(r => setStats(r.data)).catch(() => {});
    axios.get('http://localhost:5000/api/complaints')
      .then(r => setRecent(r.data.slice(0, 5))).catch(() => {});
  }, []);

  const statCards = [
    {
      label: 'Total Complaints', value: stats.total,
      icon: 'fa-clipboard-list', bg: '#e0e7ff', iconColor: '#4f46e5'
    },
    {
      label: 'Pending', value: stats.pending,
      icon: 'fa-clock', bg: '#fef3c7', iconColor: '#d97706'
    },
    {
      label: 'In Progress', value: stats.in_progress,
      icon: 'fa-triangle-exclamation', bg: '#ede9fe', iconColor: '#7c3aed'
    },
    {
      label: 'Resolved', value: stats.resolved,
      icon: 'fa-circle-check', bg: '#d1fae5', iconColor: '#059669'
    },
  ];

  const getCatIcon = (cat) => {
    const icons = {
      transport: '🚌', library: '📚', it_support: '💻',
      canteen: '🍽️', hostel: '🏠', maintenance: '🔧',
      auditorium: '🎭', examination: '📝', others: '📋'
    };
    return icons[cat] || '📋';
  };

  return (
    <div style={{ display: 'flex', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Sidebar role={user?.role} />
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
          {/* Welcome */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
                Welcome back, {user?.name}! 👋
              </h2>
              <p style={{ color: '#64748b', marginTop: 4, fontSize: 13.5 }}>
                Track and manage your complaints from your personal dashboard
              </p>
            </div>
            <Link to="/complaints/new" style={{
              background: '#ff6b35', color: 'white', border: 'none',
              padding: '10px 20px', borderRadius: 8, fontSize: 13.5,
              fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <i className="fa-solid fa-plus"></i> Raise New Complaint
            </Link>
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
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
                    {card.value}
                  </div>
                  <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 4 }}>
                    {card.label}
                  </div>
                </div>
                <div style={{
                  width: 52, height: 52, borderRadius: 12,
                  background: card.bg, display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <i className={`fa-solid ${card.icon}`} style={{ fontSize: 22, color: card.iconColor }}></i>
                </div>
              </div>
            ))}
          </div>

          {/* Recent + Quick Categories */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>

            {/* Recent Complaints */}
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontWeight: 700, margin: 0 }}>Recent Complaints</h3>
                <Link to="/complaints" style={{ color: '#ff6b35', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                  View All →
                </Link>
              </div>
              {recent.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                  <i className="fa-regular fa-inbox" style={{ fontSize: 40, marginBottom: 12, display: 'block' }}></i>
                  <div style={{ fontWeight: 600 }}>No complaints yet</div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>Raise your first complaint!</div>
                </div>
              ) : recent.map(c => (
                <div key={c.id} style={{
                  display: 'flex', gap: 12, padding: '13px 0',
                  borderBottom: '1px solid #f1f5f9', alignItems: 'flex-start'
                }}>
                  <div style={{ fontSize: 26, flexShrink: 0 }}>{getCatIcon(c.category)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: '#1a2942', fontFamily: 'monospace' }}>
                        #{c.ticket_id}
                      </span>
                      <span style={{
                        fontSize: 11.5, padding: '2px 8px', borderRadius: 20, fontWeight: 600,
                        background: c.status === 'pending' ? '#fef3c7' : c.status === 'resolved' ? '#d1fae5' : c.status === 'in_progress' ? '#ede9fe' : '#dbeafe',
                        color: c.status === 'pending' ? '#d97706' : c.status === 'resolved' ? '#059669' : c.status === 'in_progress' ? '#7c3aed' : '#2563eb'
                      }}>
                        {c.status.replace('_', ' ')}
                      </span>
                      <span style={{
                        fontSize: 11.5, padding: '2px 8px', borderRadius: 20, fontWeight: 600,
                        background: c.priority === 'high' ? '#fef2f2' : c.priority === 'medium' ? '#fefce8' : '#f0fdf4',
                        color: c.priority === 'high' ? '#dc2626' : c.priority === 'medium' ? '#ca8a04' : '#16a34a'
                      }}>
                        {c.priority}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{c.subject}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                      {c.location && <><i className="fa-solid fa-location-dot" style={{ marginRight: 3 }}></i>{c.location} · </>}
                      <i className="fa-regular fa-clock" style={{ marginRight: 3 }}></i>
                      {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Categories */}
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
              <h3 style={{ fontWeight: 700, margin: '0 0 14px' }}>Quick Categories</h3>
              {QUICK_CATS.map(cat => (
                <Link key={cat.key} to={`/complaints/new?cat=${cat.key}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 10px', borderRadius: 8,
                    cursor: 'pointer', marginBottom: 4,
                    transition: 'background 0.15s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{
                      width: 36, height: 36, background: '#f0f4f8',
                      borderRadius: 8, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: 18
                    }}>
                      {cat.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{cat.label}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{cat.desc}</div>
                    </div>
                    <i className="fa-solid fa-chevron-right" style={{ marginLeft: 'auto', color: '#cbd5e1', fontSize: 11 }}></i>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}