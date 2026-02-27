import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function FeedbackForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchComplaint();
    fetchExistingFeedback();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const { data } = await axios.get(
        `https://mru-helpdesk-backend.onrender.com/api/complaints/${id}`
      );
      setComplaint(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchExistingFeedback = async () => {
    try {
      const { data } = await axios.get(
        `https://mru-helpdesk-backend.onrender.com/api/feedback/complaint/${id}`
      );
      if (data) {
        setExistingFeedback(data);
        setRating(data.rating);
        setComment(data.comment || '');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating!');
      return;
    }
    setLoading(true);
    try {
      await axios.post('https://mru-helpdesk-backend.onrender.com/api/feedback', {
        complaint_id: parseInt(id),
        rating,
        comment
      });
      setSuccess(true);
      setTimeout(() => navigate('/complaints'), 2500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const getRatingLabel = (r) => {
    const labels = {
      1: { text: 'Very Poor', color: '#ef4444', emoji: '😞' },
      2: { text: 'Poor', color: '#f97316', emoji: '😕' },
      3: { text: 'Average', color: '#eab308', emoji: '😐' },
      4: { text: 'Good', color: '#22c55e', emoji: '😊' },
      5: { text: 'Excellent', color: '#10b981', emoji: '🤩' },
    };
    return labels[r] || null;
  };

  const currentRating = hover || rating;
  const ratingInfo = getRatingLabel(currentRating);

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
            Feedback & Rating
          </h1>
          <button
            onClick={() => navigate('/complaints')}
            style={{
              background: 'none', border: '1.5px solid #e2e8f0',
              padding: '7px 16px', borderRadius: 8, fontSize: 13,
              cursor: 'pointer', fontWeight: 600, color: '#64748b',
              display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>

        <div style={{ padding: 28, maxWidth: 650, margin: '0 auto' }}>

          {/* Success Message */}
          {success && (
            <div style={{
              background: '#d1fae5', border: '1px solid #a7f3d0',
              borderRadius: 12, padding: 28, textAlign: 'center', marginBottom: 24
            }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
              <h3 style={{ fontWeight: 800, color: '#065f46', margin: '0 0 8px' }}>
                Thank You for Your Feedback!
              </h3>
              <p style={{ color: '#047857', fontSize: 14, margin: 0 }}>
                Your feedback helps us improve our services. Redirecting...
              </p>
            </div>
          )}

          {/* Already Submitted */}
          {existingFeedback && !success && (
            <div style={{
              background: '#fef3c7', border: '1px solid #fde68a',
              borderRadius: 12, padding: 16, marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 13.5, color: '#92400e'
            }}>
              <i className="fa-solid fa-circle-info" style={{ fontSize: 18 }}></i>
              <div>
                <strong>Feedback Already Submitted!</strong>
                <div style={{ fontSize: 12.5, marginTop: 2 }}>
                  You already rated this complaint {existingFeedback.rating} ⭐
                </div>
              </div>
            </div>
          )}

          {/* Complaint Info Card */}
          {complaint && (
            <div style={{
              background: 'white', borderRadius: 16,
              border: '1px solid #e2e8f0', padding: 24,
              marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: 16
              }}>
                <div>
                  <div style={{
                    fontSize: 12, fontWeight: 700, color: '#1a2942',
                    fontFamily: 'monospace', marginBottom: 6
                  }}>
                    #{complaint.ticket_id}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
                    {complaint.subject}
                  </h3>
                </div>
                <span style={{
                  fontSize: 12, padding: '4px 12px', borderRadius: 20,
                  background: '#d1fae5', color: '#059669', fontWeight: 700
                }}>
                  ✅ Resolved
                </span>
              </div>
              <div style={{
                display: 'flex', gap: 20, fontSize: 13,
                color: '#64748b', flexWrap: 'wrap'
              }}>
                <span>
                  <i className="fa-solid fa-building" style={{ marginRight: 5 }}></i>
                  {complaint.department_name}
                </span>
                <span>
                  <i className="fa-solid fa-tag" style={{ marginRight: 5, textTransform: 'capitalize' }}></i>
                  {complaint.category?.replace('_', ' ')}
                </span>
                <span>
                  <i className="fa-regular fa-calendar" style={{ marginRight: 5 }}></i>
                  {new Date(complaint.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Feedback Form */}
          {!existingFeedback && !success && (
            <div style={{
              background: 'white', borderRadius: 16,
              border: '1px solid #e2e8f0', padding: 28,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{
                fontSize: 17, fontWeight: 700, margin: '0 0 6px',
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                <i className="fa-solid fa-star" style={{ color: '#ff6b35' }}></i>
                Rate Your Experience
              </h3>
              <p style={{ color: '#64748b', fontSize: 13.5, margin: '0 0 28px' }}>
                How satisfied are you with how your complaint was handled by{' '}
                <strong>{complaint?.department_name}</strong> department?
              </p>

              {/* Star Rating */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{
                  display: 'flex', justifyContent: 'center',
                  gap: 12, marginBottom: 16
                }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <div
                      key={star}
                      onClick={() => !existingFeedback && setRating(star)}
                      onMouseEnter={() => !existingFeedback && setHover(star)}
                      onMouseLeave={() => !existingFeedback && setHover(0)}
                      style={{
                        fontSize: 44,
                        cursor: existingFeedback ? 'default' : 'pointer',
                        transition: 'transform 0.15s',
                        transform: (hover || rating) >= star ? 'scale(1.2)' : 'scale(1)',
                        filter: (hover || rating) >= star
                          ? 'none'
                          : 'grayscale(100%) opacity(0.3)',
                      }}
                    >
                      ⭐
                    </div>
                  ))}
                </div>

                {/* Rating Label */}
                {ratingInfo && (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '8px 20px', borderRadius: 20,
                    background: `${ratingInfo.color}15`,
                    border: `1.5px solid ${ratingInfo.color}30`
                  }}>
                    <span style={{ fontSize: 20 }}>{ratingInfo.emoji}</span>
                    <span style={{
                      fontSize: 15, fontWeight: 700,
                      color: ratingInfo.color
                    }}>
                      {ratingInfo.text}
                    </span>
                  </div>
                )}

                {!currentRating && (
                  <p style={{ color: '#94a3b8', fontSize: 13.5, margin: '12px 0 0' }}>
                    Click on a star to rate
                  </p>
                )}
              </div>

              {/* Comment */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block', fontSize: 13,
                  fontWeight: 600, marginBottom: 8
                }}>
                  <i className="fa-solid fa-comment" style={{ marginRight: 6, color: '#ff6b35' }}></i>
                  Additional Comments
                  <span style={{
                    fontSize: 11.5, color: '#94a3b8',
                    fontWeight: 400, marginLeft: 6
                  }}>
                    (Optional)
                  </span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your experience. What did the department do well? What could be improved?"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px',
                    borderRadius: 8, border: '1.5px solid #e2e8f0',
                    fontSize: 14, fontFamily: 'inherit',
                    resize: 'vertical', outline: 'none',
                    boxSizing: 'border-box', lineHeight: 1.6
                  }}
                  onFocus={e => e.target.style.borderColor = '#ff6b35'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Quick Feedback Tags */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block', fontSize: 13,
                  fontWeight: 600, marginBottom: 10
                }}>
                  Quick Tags
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    'Fast Response', 'Professional', 'Helpful Staff',
                    'Slow Response', 'Good Communication',
                    'Needs Improvement', 'Excellent Service', 'Resolved Quickly'
                  ].map(tag => (
                    <span
                      key={tag}
                      onClick={() => setComment(prev =>
                        prev ? `${prev}, ${tag}` : tag
                      )}
                      style={{
                        padding: '6px 14px', borderRadius: 20,
                        border: '1.5px solid #e2e8f0',
                        fontSize: 12.5, cursor: 'pointer',
                        background: comment.includes(tag) ? '#fff4f0' : 'white',
                        color: comment.includes(tag) ? '#ff6b35' : '#64748b',
                        borderColor: comment.includes(tag) ? '#ff6b35' : '#e2e8f0',
                        fontWeight: 500, transition: 'all 0.15s'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || rating === 0}
                style={{
                  width: '100%', padding: '14px',
                  borderRadius: 10, border: 'none',
                  background: rating === 0 ? '#e2e8f0' : '#ff6b35',
                  color: rating === 0 ? '#94a3b8' : 'white',
                  fontSize: 15, fontWeight: 700,
                  cursor: rating === 0 ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s'
                }}
              >
                {loading ? (
                  <><i className="fa-solid fa-spinner fa-spin"></i> Submitting...</>
                ) : (
                  <><i className="fa-solid fa-paper-plane"></i> Submit Feedback</>
                )}
              </button>

              {rating === 0 && (
                <p style={{
                  textAlign: 'center', fontSize: 12.5,
                  color: '#94a3b8', marginTop: 10
                }}>
                  Please select a star rating to submit
                </p>
              )}
            </div>
          )}

          {/* Already Submitted — Show Their Feedback */}
          {existingFeedback && (
            <div style={{
              background: 'white', borderRadius: 16,
              border: '1px solid #e2e8f0', padding: 28,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ fontWeight: 700, margin: '0 0 16px' }}>
                Your Submitted Feedback
              </h3>
              <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} style={{
                    fontSize: 32,
                    filter: existingFeedback.rating >= s ? 'none' : 'grayscale(100%) opacity(0.3)'
                  }}>⭐</span>
                ))}
                <span style={{
                  fontSize: 15, fontWeight: 700, marginLeft: 8,
                  color: getRatingLabel(existingFeedback.rating)?.color,
                  alignSelf: 'center'
                }}>
                  {getRatingLabel(existingFeedback.rating)?.text}
                </span>
              </div>
              {existingFeedback.comment && (
                <div style={{
                  background: '#f8fafc', borderRadius: 8,
                  padding: 14, fontSize: 13.5, color: '#475569', lineHeight: 1.6
                }}>
                  "{existingFeedback.comment}"
                </div>
              )}
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 12 }}>
                <i className="fa-regular fa-clock" style={{ marginRight: 5 }}></i>
                Submitted on {new Date(existingFeedback.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}