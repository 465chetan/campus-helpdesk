import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, ResponsiveContainer
} from 'recharts';

export default function AdminReports() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    byCategory: [], byStatus: [], byDept: [], daily: []
  });
  const [deptRatings, setDeptRatings] = useState([]);
  const [allFeedback, setAllFeedback] = useState([]);
  const [stats, setStats] = useState({
    total: 0, pending: 0, in_progress: 0, resolved: 0
  });

  useEffect(() => {
    fetchAnalytics();
    fetchFeedback();
    fetchStats();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:5000/api/users/analytics/complaints'
      );
      setAnalytics(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFeedback = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:5000/api/feedback/all'
      );
      setDeptRatings(data.deptRatings || []);
      setAllFeedback(data.feedback || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:5000/api/complaints/stats/summary'
      );
      setStats(data);
    } catch (err) {
      console.log(err);
    }
  };

  const COLORS = ['#ff6b35', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
  const STATUS_COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981'];

  const getRatingLabel = (r) => {
    const labels = {
      1: { text: 'Very Poor', color: '#ef4444' },
      2: { text: 'Poor', color: '#f97316' },
      3: { text: 'Average', color: '#eab308' },
      4: { text: 'Good', color: '#22c55e' },
      5: { text: 'Excellent', color: '#10b981' },
    };
    return labels[Math.round(r)] || { text: 'N/A', color: '#94a3b8' };
  };

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

  return (
    <div style={{ display: 'flex', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Sidebar role="admin" />
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
          <div>
            <h1 style={{ fontSize: 19, fontWeight: 700, margin: 0 }}>
              Reports & Analytics
            </h1>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
              Comprehensive insights into complaint management
            </p>
          </div>
          <button style={{
            background: '#1a2942', color: 'white', border: 'none',
            padding: '9px 18px', borderRadius: 8, fontSize: 13.5,
            fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <i className="fa-solid fa-download"></i> Export CSV
          </button>
        </div>

        <div style={{ padding: 28 }}>

          {/* Stat Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            gap: 16, marginBottom: 24
          }}>
            {statCards.map(card => (
              <div key={card.label} style={{
                background: 'white', borderRadius: 12, padding: 20,
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
              }}>
                <div>
                  <div style={{
                    fontSize: 28, fontWeight: 800,
                    color: '#1e293b', lineHeight: 1
                  }}>
                    {card.value}
                  </div>
                  <div style={{
                    fontSize: 12.5, color: '#64748b', marginTop: 4
                  }}>
                    {card.label}
                  </div>
                </div>
                <div style={{
                  width: 52, height: 52, borderRadius: 12,
                  background: card.bg, display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <i className={`fa-solid ${card.icon}`}
                    style={{ fontSize: 22, color: card.iconColor }}></i>
                </div>
              </div>
            ))}
          </div>

          {/* Daily Trend */}
          <div style={{
            background: 'white', borderRadius: 12,
            border: '1px solid #e2e8f0', padding: 24,
            marginBottom: 20
          }}>
            <h3 style={{ fontWeight: 700, margin: '0 0 16px' }}>
              <i className="fa-solid fa-chart-line"
                style={{ marginRight: 8, color: '#ff6b35' }}></i>
              Daily Complaint Trend
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={analytics.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" style={{ fontSize: 11 }} />
                <YAxis style={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone" dataKey="count"
                  stroke="#ff6b35" strokeWidth={2.5}
                  dot={{ fill: '#ff6b35', strokeWidth: 0, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Charts */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 20, marginBottom: 20
          }}>
            <div style={{
              background: 'white', borderRadius: 12,
              border: '1px solid #e2e8f0', padding: 24
            }}>
              <h3 style={{ fontWeight: 700, margin: '0 0 16px' }}>
                <i className="fa-solid fa-chart-pie"
                  style={{ marginRight: 8, color: '#ff6b35' }}></i>
                By Category
              </h3>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={analytics.byCategory}
                    dataKey="count" nameKey="category"
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={85}
                  >
                    {analytics.byCategory.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{
              background: 'white', borderRadius: 12,
              border: '1px solid #e2e8f0', padding: 24
            }}>
              <h3 style={{ fontWeight: 700, margin: '0 0 16px' }}>
                <i className="fa-solid fa-chart-pie"
                  style={{ marginRight: 8, color: '#ff6b35' }}></i>
                By Status
              </h3>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={analytics.byStatus}
                    dataKey="count" nameKey="status"
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={85}
                  >
                    {analytics.byStatus.map((_, i) => (
                      <Cell key={i} fill={STATUS_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div style={{
            background: 'white', borderRadius: 12,
            border: '1px solid #e2e8f0', padding: 24,
            marginBottom: 20
          }}>
            <h3 style={{ fontWeight: 700, margin: '0 0 16px' }}>
              <i className="fa-solid fa-chart-bar"
                style={{ marginRight: 8, color: '#ff6b35' }}></i>
              Department Performance
            </h3>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={analytics.byDept} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="department_name" style={{ fontSize: 11 }} />
                <YAxis style={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" name="Total"
                  fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved"
                  fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending"
                  fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ⭐ DEPARTMENT RATINGS SECTION */}
          <div style={{
            background: 'white', borderRadius: 12,
            border: '1px solid #e2e8f0', padding: 24,
            marginBottom: 20
          }}>
            <h3 style={{
              fontWeight: 700, margin: '0 0 20px',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <i className="fa-solid fa-star"
                style={{ color: '#ff6b35' }}></i>
              Department Ratings from Students
            </h3>

            {deptRatings.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '30px 20px', color: '#94a3b8'
              }}>
                <i className="fa-regular fa-star"
                  style={{ fontSize: 36, marginBottom: 12, display: 'block' }}></i>
                <div>No feedback received yet</div>
              </div>
            ) : (
              deptRatings.map(d => {
                const rInfo = getRatingLabel(d.avg_rating);
                const pct = (d.avg_rating / 5) * 100;
                return (
                  <div key={d.department_name} style={{
                    display: 'flex', alignItems: 'center',
                    gap: 16, marginBottom: 16, padding: '14px 16px',
                    background: '#f8fafc', borderRadius: 10,
                    border: '1px solid #e2e8f0'
                  }}>
                    {/* Dept Name */}
                    <div style={{ width: 140, flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>
                        {d.department_name}
                      </div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>
                        {d.total_feedback} review{d.total_feedback !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Stars */}
                    <div style={{ display: 'flex', gap: 3 }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} style={{
                          fontSize: 18,
                          filter: d.avg_rating >= s
                            ? 'none'
                            : 'grayscale(100%) opacity(0.3)'
                        }}>⭐</span>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        height: 8, background: '#e2e8f0',
                        borderRadius: 4, overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%', width: `${pct}%`,
                          background: rInfo.color,
                          borderRadius: 4,
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>

                    {/* Score + Label */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{
                        fontSize: 20, fontWeight: 800,
                        color: rInfo.color
                      }}>
                        {d.avg_rating}
                      </div>
                      <div style={{
                        fontSize: 11, color: rInfo.color,
                        fontWeight: 600
                      }}>
                        {rInfo.text}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ⭐ RECENT FEEDBACK TABLE */}
          {allFeedback.length > 0 && (
            <div style={{
              background: 'white', borderRadius: 12,
              border: '1px solid #e2e8f0', padding: 24
            }}>
              <h3 style={{
                fontWeight: 700, margin: '0 0 16px',
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                <i className="fa-solid fa-comments"
                  style={{ color: '#ff6b35' }}></i>
                Recent Student Feedback
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['Student', 'Ticket', 'Department', 'Rating', 'Comment', 'Date'].map(h => (
                        <th key={h} style={{
                          padding: '10px 14px', fontSize: 11.5,
                          fontWeight: 700, color: '#94a3b8',
                          textTransform: 'uppercase', textAlign: 'left',
                          borderBottom: '1px solid #e2e8f0'
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allFeedback.slice(0, 10).map(f => (
                      <tr key={f.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 600, fontSize: 13 }}>
                          {f.user_name}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            fontFamily: 'monospace', fontSize: 12,
                            fontWeight: 700, color: '#1a2942'
                          }}>
                            {f.ticket_id}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 13 }}>
                          {f.department_name}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', gap: 2 }}>
                            {[1, 2, 3, 4, 5].map(s => (
                              <span key={s} style={{
                                fontSize: 14,
                                filter: f.rating >= s
                                  ? 'none'
                                  : 'grayscale(100%) opacity(0.3)'
                              }}>⭐</span>
                            ))}
                          </div>
                        </td>
                        <td style={{
                          padding: '12px 14px', fontSize: 12.5,
                          color: '#64748b', maxWidth: 200,
                          overflow: 'hidden', textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {f.comment || '-'}
                        </td>
                        <td style={{
                          padding: '12px 14px', fontSize: 12,
                          color: '#94a3b8'
                        }}>
                          {new Date(f.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}