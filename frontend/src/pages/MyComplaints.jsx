import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function MyComplaints() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter]);

  const fetchComplaints = async () => {
    try {
      const url = statusFilter
        ? `http://localhost:5000/api/complaints?status=${statusFilter}`
        : `http://localhost:5000/api/complaints`;
      const { data } = await axios.get(url);
      setComplaints(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (c) => {
    setSelected(c);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/complaints/${c.id}`
      );
      setUpdates(data.updates || []);
    } catch (err) {
      setUpdates([]);
    }
  };

  const getCatIcon = (cat) => {
    const icons = {
      transport: '🚌', library: '📚', it_support: '💻',
      canteen: '🍽️', hostel: '🏠', maintenance: '🔧',
      auditorium: '🎭', examination: '📝', others: '📋'
    };
    return icons[cat] || '📋';
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: { bg: '#fef3c7', color: '#d97706' },
      assigned: { bg: '#dbeafe', color: '#2563eb' },
      in_progress: { bg: '#ede9fe', color: '#7c3aed' },
      resolved: { bg: '#d1fae5', color: '#059669' },
    };
    return styles[status] || { bg: '#f1f5f9', color: '#475569' };
  };

  const getPriorityStyle = (priority) => {
    const styles = {
      high: { bg: '#fef2f2', color: '#dc2626' },
      medium: { bg: '#fefce8', color: '#ca8a04' },
      low: { bg: '#f0fdf4', color: '#16a34a' },
    };
    return styles[priority] || { bg: '#f1f5f9', color: '#475569' };
  };

  return (
    <div style={{ display: 'flex', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Sidebar role={user?.role} />
      <div style={{
        marginLeft: 260, flex: 1,
        minHeight: '100vh', background: '#f0f4f8'
      }}>

        {/* Header */}
        <div style={{
          background: 'white', padding: '14px 28px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 50
        }}>
          <h1 style={{ fontSize: 19, fontWeight: 700, margin: 0 }}>
            My Complaints
          </h1>
          <button
            onClick={() => navigate('/complaints/new')}
            style={{
              background: '#ff6b35', color: 'white', border: 'none',
              padding: '9px 18px', borderRadius: 8, fontSize: 13.5,
              fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8
            }}
          >
            <i className="fa-solid fa-plus"></i> New Complaint
          </button>
        </div>

        <div style={{ padding: 28 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 20
          }}>
            <div>
              <h2 style={{ fontSize: 21, fontWeight: 800, margin: 0 }}>
                My Complaints
              </h2>
              <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
                Track all your submitted complaints
              </p>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{
                padding: '9px 14px', borderRadius: 8,
                border: '1.5px solid #e2e8f0', fontSize: 13.5,
                fontFamily: 'inherit', outline: 'none',
                background: 'white', cursor: 'pointer'
              }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Complaints List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <i className="fa-solid fa-spinner fa-spin"
                style={{ fontSize: 32, color: '#ff6b35' }}></i>
            </div>
          ) : complaints.length === 0 ? (
            <div style={{
              background: 'white', borderRadius: 16,
              border: '1px solid #e2e8f0', padding: '60px 20px',
              textAlign: 'center'
            }}>
              <i className="fa-regular fa-folder-open"
                style={{ fontSize: 48, color: '#cbd5e1', marginBottom: 16, display: 'block' }}></i>
              <h3 style={{ fontWeight: 700, color: '#64748b', margin: '0 0 8px' }}>
                No complaints found
              </h3>
              <p style={{ color: '#94a3b8', fontSize: 13.5, margin: '0 0 20px' }}>
                You haven't raised any complaints yet
              </p>
              <button
                onClick={() => navigate('/complaints/new')}
                style={{
                  background: '#ff6b35', color: 'white', border: 'none',
                  padding: '10px 24px', borderRadius: 8, fontSize: 14,
                  fontWeight: 600, cursor: 'pointer'
                }}
              >
                Raise Your First Complaint
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {complaints.map(c => {
                const statusStyle = getStatusStyle(c.status);
                const priorityStyle = getPriorityStyle(c.priority);
                return (
                  <div key={c.id} style={{
                    background: 'white', borderRadius: 12,
                    border: '1px solid #e2e8f0', padding: 20,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.15s'
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', gap: 16
                    }}>

                      {/* Left - Icon + Info */}
                      <div style={{ display: 'flex', gap: 14, flex: 1 }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 12,
                          background: '#f0f4f8', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: 24, flexShrink: 0
                        }}>
                          {getCatIcon(c.category)}
                        </div>
                        <div style={{ flex: 1 }}>
                          {/* Badges */}
                          <div style={{
                            display: 'flex', gap: 8,
                            marginBottom: 6, flexWrap: 'wrap',
                            alignItems: 'center'
                          }}>
                            <span style={{
                              fontSize: 11.5, fontWeight: 700,
                              color: '#1a2942', fontFamily: 'monospace',
                              background: '#f0f4f8', padding: '2px 8px',
                              borderRadius: 6
                            }}>
                              #{c.ticket_id}
                            </span>
                            <span style={{
                              fontSize: 11.5, padding: '3px 10px',
                              borderRadius: 20, fontWeight: 600,
                              background: statusStyle.bg,
                              color: statusStyle.color
                            }}>
                              {c.status?.replace('_', ' ')}
                            </span>
                            <span style={{
                              fontSize: 11.5, padding: '3px 10px',
                              borderRadius: 20, fontWeight: 600,
                              background: priorityStyle.bg,
                              color: priorityStyle.color
                            }}>
                              {c.priority}
                            </span>
                          </div>

                          {/* Subject */}
                          <div style={{
                            fontWeight: 700, fontSize: 15,
                            color: '#1e293b', marginBottom: 4
                          }}>
                            {c.subject}
                          </div>

                          {/* Meta */}
                          <div style={{
                            fontSize: 12.5, color: '#94a3b8',
                            display: 'flex', gap: 12, flexWrap: 'wrap'
                          }}>
                            {c.department_name && (
                              <span>
                                <i className="fa-solid fa-building"
                                  style={{ marginRight: 4 }}></i>
                                {c.department_name}
                              </span>
                            )}
                            {c.location && (
                              <span>
                                <i className="fa-solid fa-location-dot"
                                  style={{ marginRight: 4 }}></i>
                                {c.location}
                              </span>
                            )}
                            <span>
                              <i className="fa-regular fa-clock"
                                style={{ marginRight: 4 }}></i>
                              {new Date(c.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right - Action Buttons */}
                      <div style={{
                        display: 'flex', flexDirection: 'column',
                        gap: 8, flexShrink: 0
                      }}>

                        {/* View Details Button */}
                        <button
                          onClick={() => openDetail(c)}
                          style={{
                            background: 'white', color: '#1a2942',
                            border: '1.5px solid #e2e8f0',
                            padding: '7px 16px', borderRadius: 8,
                            fontSize: 12.5, cursor: 'pointer',
                            fontWeight: 600, fontFamily: 'inherit',
                            display: 'flex', alignItems: 'center', gap: 6
                          }}
                        >
                          <i className="fa-solid fa-eye"></i>
                          View Details
                        </button>

                        {/* ⭐ GIVE FEEDBACK BUTTON - only for resolved */}
                        {c.status === 'resolved' && (
                          <button
                            onClick={() => navigate(`/feedback/${c.id}`)}
                            style={{
                              background: '#ff6b35', color: 'white',
                              border: 'none', padding: '7px 16px',
                              borderRadius: 8, fontSize: 12.5,
                              cursor: 'pointer', fontWeight: 600,
                              fontFamily: 'inherit',
                              display: 'flex', alignItems: 'center', gap: 6
                            }}
                          >
                            <i className="fa-solid fa-star"></i>
                            Give Feedback
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 200, padding: 20
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: 'white', borderRadius: 16, padding: 28,
              maxWidth: 560, width: '100%',
              maxHeight: '90vh', overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', marginBottom: 16
            }}>
              <div>
                <span style={{
                  fontSize: 12, fontWeight: 700, color: '#1a2942',
                  fontFamily: 'monospace', display: 'block', marginBottom: 4
                }}>
                  #{selected.ticket_id}
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
                  {selected.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: 'none', border: 'none',
                  fontSize: 22, cursor: 'pointer', color: '#94a3b8'
                }}
              >×</button>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                background: getStatusStyle(selected.status).bg,
                color: getStatusStyle(selected.status).color
              }}>
                {selected.status?.replace('_', ' ')}
              </span>
              <span style={{
                fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                background: getPriorityStyle(selected.priority).bg,
                color: getPriorityStyle(selected.priority).color
              }}>
                {selected.priority}
              </span>
              {selected.department_name && (
                <span style={{
                  fontSize: 12, padding: '3px 10px', borderRadius: 20,
                  background: '#f1f5f9', color: '#475569', fontWeight: 600
                }}>
                  🏢 {selected.department_name}
                </span>
              )}
            </div>

            {/* Description */}
            <p style={{
              color: '#475569', fontSize: 13.5,
              marginBottom: 16, lineHeight: 1.6
            }}>
              {selected.description}
            </p>

            {/* Details Grid */}
            <div style={{
              background: '#f8fafc', borderRadius: 8,
              padding: 14, fontSize: 13,
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 10, marginBottom: 20
            }}>
              {[
                ['Category', selected.category?.replace('_', ' ')],
                ['Priority', selected.priority],
                ['Location', selected.location || '-'],
                ['Block/Room', selected.block ? `${selected.block} ${selected.room_no}` : '-'],
                ['Submitted', new Date(selected.created_at).toLocaleDateString('en-IN')],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{
                    fontSize: 11, color: '#94a3b8',
                    fontWeight: 600, marginBottom: 2
                  }}>
                    {k}
                  </div>
                  <div style={{
                    fontWeight: 600, textTransform: 'capitalize'
                  }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <h4 style={{ fontWeight: 700, marginBottom: 14, fontSize: 14 }}>
              <i className="fa-solid fa-timeline"
                style={{ marginRight: 6, color: '#ff6b35' }}></i>
              Activity Timeline
            </h4>
            <div style={{ paddingLeft: 20, position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 7, top: 0, bottom: 0,
                width: 2, background: '#e2e8f0'
              }}></div>

              {/* Initial submission */}
              <div style={{ position: 'relative', marginBottom: 16 }}>
                <div style={{
                  position: 'absolute', left: -20, top: 4,
                  width: 14, height: 14, borderRadius: '50%',
                  background: '#ff6b35', border: '2px solid white',
                  boxShadow: '0 0 0 2px #ff6b35'
                }}></div>
                <div style={{
                  background: '#f8fafc', borderRadius: 8,
                  padding: '10px 14px'
                }}>
                  <span style={{
                    fontSize: 11.5, padding: '2px 8px', borderRadius: 20,
                    background: '#fef3c7', color: '#d97706', fontWeight: 600
                  }}>
                    pending
                  </span>
                  <p style={{ fontSize: 13, margin: '4px 0 2px' }}>
                    Complaint submitted successfully
                  </p>
                  <div style={{ fontSize: 11.5, color: '#94a3b8' }}>
                    {new Date(selected.created_at).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Updates */}
              {updates.map((u, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: 16 }}>
                  <div style={{
                    position: 'absolute', left: -20, top: 4,
                    width: 14, height: 14, borderRadius: '50%',
                    background: '#ff6b35', border: '2px solid white',
                    boxShadow: '0 0 0 2px #ff6b35'
                  }}></div>
                  <div style={{
                    background: '#f8fafc', borderRadius: 8,
                    padding: '10px 14px'
                  }}>
                    {u.status && (
                      <span style={{
                        fontSize: 11.5, padding: '2px 8px', borderRadius: 20,
                        background: getStatusStyle(u.status).bg,
                        color: getStatusStyle(u.status).color, fontWeight: 600
                      }}>
                        {u.status.replace('_', ' ')}
                      </span>
                    )}
                    {u.message && (
                      <p style={{ fontSize: 13, margin: '4px 0 2px' }}>
                        {u.message}
                      </p>
                    )}
                    <div style={{ fontSize: 11.5, color: '#94a3b8' }}>
                      By {u.updater_name} · {new Date(u.created_at).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feedback Button in Modal */}
            {selected.status === 'resolved' && (
              <button
                onClick={() => {
                  setSelected(null);
                  navigate(`/feedback/${selected.id}`);
                }}
                style={{
                  width: '100%', marginTop: 16,
                  background: '#ff6b35', color: 'white',
                  border: 'none', padding: '12px',
                  borderRadius: 8, fontSize: 14,
                  fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8
                }}
              >
                <i className="fa-solid fa-star"></i>
                Give Feedback & Rating
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}