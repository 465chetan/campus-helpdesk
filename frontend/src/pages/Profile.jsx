import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, login, token } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, in_progress: 0 });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/auth/profile');
      setProfile(data);
      setForm({ name: data.name, phone: data.phone || '' });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/complaints/stats/summary');
      setStats(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put('http://localhost:5000/api/auth/profile', form);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: { bg: '#fee2e2', color: '#991b1b' },
      staff: { bg: '#dbeafe', color: '#1e40af' },
      student: { bg: '#d1fae5', color: '#065f46' },
      faculty: { bg: '#fef3c7', color: '#92400e' },
    };
    return colors[role] || { bg: '#f1f5f9', color: '#475569' };
  };

  const getRoleIcon = (role) => {
    const icons = {
      admin: 'fa-shield-halved',
      staff: 'fa-user-tie',
      student: 'fa-user-graduate',
      faculty: 'fa-chalkboard-teacher',
    };
    return icons[role] || 'fa-user';
  };

  if (!profile) return (
    <div style={{ display: 'flex', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Sidebar role={user?.role} />
      <div style={{ marginLeft: 260, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTopColor: '#ff6b35', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
      </div>
    </div>
  );

  const roleStyle = getRoleColor(profile.role);

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
          <h1 style={{ fontSize: 19, fontWeight: 700, margin: 0 }}>My Profile</h1>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none', border: '1.5px solid #e2e8f0',
              padding: '7px 16px', borderRadius: 8,
              fontSize: 13, cursor: 'pointer', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6, color: '#64748b'
            }}
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>

        <div style={{ padding: 28, maxWidth: 900, margin: '0 auto' }}>

          {success && (
            <div style={{
              background: '#d1fae5', color: '#065f46',
              padding: '12px 16px', borderRadius: 8,
              marginBottom: 20, fontSize: 13.5,
              display: 'flex', alignItems: 'center', gap: 8,
              border: '1px solid #a7f3d0'
            }}>
              <i className="fa-solid fa-circle-check"></i>
              {success}
            </div>
          )}

          {/* Profile Header Card */}
          <div style={{
            background: 'white', borderRadius: 16,
            border: '1px solid #e2e8f0', marginBottom: 20,
            overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}>
            {/* Cover */}
            <div style={{
              height: 100,
              background: 'linear-gradient(135deg, #1a2942 0%, #2d4a7a 100%)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute', right: 20, top: 20,
                display: 'flex', gap: 8
              }}>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'white', padding: '7px 16px',
                      borderRadius: 8, fontSize: 13,
                      cursor: 'pointer', fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: 6
                    }}
                  >
                    <i className="fa-solid fa-pen"></i> Edit Profile
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setEditing(false)}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white', padding: '7px 16px',
                        borderRadius: 8, fontSize: 13, cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      disabled={loading}
                      style={{
                        background: '#ff6b35', border: 'none',
                        color: 'white', padding: '7px 16px',
                        borderRadius: 8, fontSize: 13,
                        cursor: 'pointer', fontWeight: 600
                      }}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Avatar + Info */}
            <div style={{ padding: '0 28px 28px', position: 'relative' }}>
              {/* Avatar */}
              <div style={{
                width: 90, height: 90, borderRadius: '50%',
                background: '#ff6b35', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: 36,
                border: '4px solid white',
                marginTop: -45, marginBottom: 16,
                boxShadow: '0 4px 12px rgba(255,107,53,0.3)'
              }}>
                {profile.name?.charAt(0).toUpperCase()}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  {editing ? (
                    <input
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      style={{
                        fontSize: 22, fontWeight: 800, color: '#1a2942',
                        border: '1.5px solid #ff6b35', borderRadius: 8,
                        padding: '6px 12px', fontFamily: 'inherit',
                        outline: 'none', marginBottom: 8, width: 280
                      }}
                    />
                  ) : (
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a2942', margin: '0 0 6px' }}>
                      {profile.name}
                    </h2>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 12.5, padding: '4px 12px', borderRadius: 20,
                      background: roleStyle.bg, color: roleStyle.color, fontWeight: 700
                    }}>
                      <i className={`fa-solid ${getRoleIcon(profile.role)}`} style={{ marginRight: 5 }}></i>
                      {profile.role?.toUpperCase()}
                    </span>
                    {profile.department_name && (
                      <span style={{
                        fontSize: 12.5, padding: '4px 12px', borderRadius: 20,
                        background: '#f0f9ff', color: '#0369a1', fontWeight: 600
                      }}>
                        <i className="fa-solid fa-building" style={{ marginRight: 5 }}></i>
                        {profile.department_name}
                      </span>
                    )}
                  </div>
                </div>

                {/* UID Badge */}
                {profile.uid && (
                  <div style={{
                    background: '#f8fafc', border: '1.5px solid #e2e8f0',
                    borderRadius: 10, padding: '12px 20px', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>
                      UNIVERSITY ID
                    </div>
                    <div style={{
                      fontSize: 20, fontWeight: 800, color: '#1a2942',
                      fontFamily: 'monospace', letterSpacing: 1
                    }}>
                      {profile.uid}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* Personal Information */}
            <div style={{
              background: 'white', borderRadius: 16,
              border: '1px solid #e2e8f0', padding: 24,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{
                fontSize: 15, fontWeight: 700, margin: '0 0 20px',
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                <i className="fa-solid fa-user" style={{ color: '#ff6b35' }}></i>
                Personal Information
              </h3>

              {[
                { label: 'Full Name', value: profile.name, icon: 'fa-user', editable: true, field: 'name' },
                { label: 'Email Address', value: profile.email, icon: 'fa-envelope', editable: false },
                { label: 'Phone Number', value: profile.phone || 'Not provided', icon: 'fa-phone', editable: true, field: 'phone' },
                { label: 'University ID', value: profile.uid || 'Not assigned', icon: 'fa-id-card', editable: false },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 600, marginBottom: 5 }}>
                    <i className={`fa-solid ${item.icon}`} style={{ marginRight: 5 }}></i>
                    {item.label}
                  </div>
                  {editing && item.editable && item.field ? (
                    <input
                      value={form[item.field]}
                      onChange={e => setForm({ ...form, [item.field]: e.target.value })}
                      placeholder={`Enter ${item.label.toLowerCase()}`}
                      style={{
                        width: '100%', padding: '9px 12px',
                        border: '1.5px solid #ff6b35', borderRadius: 8,
                        fontSize: 13.5, fontFamily: 'inherit',
                        outline: 'none', boxSizing: 'border-box'
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1e293b', padding: '9px 0' }}>
                      {item.value}
                    </div>
                  )}
                  <div style={{ height: 1, background: '#f1f5f9', marginTop: 8 }}></div>
                </div>
              ))}
            </div>

            {/* Account Details + Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Account Details */}
              <div style={{
                background: 'white', borderRadius: 16,
                border: '1px solid #e2e8f0', padding: 24,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
              }}>
                <h3 style={{
                  fontSize: 15, fontWeight: 700, margin: '0 0 20px',
                  display: 'flex', alignItems: 'center', gap: 8
                }}>
                  <i className="fa-solid fa-shield-halved" style={{ color: '#ff6b35' }}></i>
                  Account Details
                </h3>
                {[
                  { label: 'Role', value: profile.role?.toUpperCase(), icon: 'fa-user-tag' },
                  { label: 'Department', value: profile.department_name || 'Not Assigned', icon: 'fa-building' },
                  { label: 'Member Since', value: new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), icon: 'fa-calendar' },
                  { label: 'Account Status', value: 'Active', icon: 'fa-circle-check' },
                ].map(item => (
                  <div key={item.label} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>
                      <i className={`fa-solid ${item.icon}`} style={{ marginRight: 5 }}></i>
                      {item.label}
                    </div>
                    <div style={{
                      fontSize: 13.5, fontWeight: 600,
                      color: item.label === 'Account Status' ? '#059669' : '#1e293b'
                    }}>
                      {item.label === 'Account Status' && <i className="fa-solid fa-circle" style={{ fontSize: 8, marginRight: 6, color: '#059669' }}></i>}
                      {item.value}
                    </div>
                    <div style={{ height: 1, background: '#f1f5f9', marginTop: 10 }}></div>
                  </div>
                ))}
              </div>

              {/* Complaint Stats */}
              {(profile.role === 'student' || profile.role === 'faculty') && (
                <div style={{
                  background: 'white', borderRadius: 16,
                  border: '1px solid #e2e8f0', padding: 24,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                }}>
                  <h3 style={{
                    fontSize: 15, fontWeight: 700, margin: '0 0 16px',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}>
                    <i className="fa-solid fa-chart-pie" style={{ color: '#ff6b35' }}></i>
                    My Complaint Stats
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { label: 'Total', value: stats.total, bg: '#e0e7ff', color: '#4f46e5', icon: 'fa-clipboard-list' },
                      { label: 'Pending', value: stats.pending, bg: '#fef3c7', color: '#d97706', icon: 'fa-clock' },
                      { label: 'In Progress', value: stats.in_progress, bg: '#ede9fe', color: '#7c3aed', icon: 'fa-spinner' },
                      { label: 'Resolved', value: stats.resolved, bg: '#d1fae5', color: '#059669', icon: 'fa-circle-check' },
                    ].map(s => (
                      <div key={s.label} style={{
                        background: s.bg, borderRadius: 10,
                        padding: '14px', textAlign: 'center'
                      }}>
                        <i className={`fa-solid ${s.icon}`} style={{ fontSize: 20, color: s.color, marginBottom: 6, display: 'block' }}></i>
                        <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 11.5, color: s.color, fontWeight: 600, opacity: 0.8 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}