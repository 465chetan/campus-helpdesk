import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('https://mru-helpdesk-backend.onrender.com/api/auth/login', form);
      login(data.user, data.token);
      if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'staff') navigate('/dept');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #1a2942 0%, #0f172a 100%)',
    }}>

      {/* Left Side - Branding */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 60, color: 'white'
      }}>
        <img
          src="/logo.png"
          alt="Malla Reddy University"
          style={{
            width: 120, height: 120,
            objectFit: 'contain', marginBottom: 24,
            filter: 'drop-shadow(0 4px 20px rgba(255,107,53,0.3))'
          }}
        />
        <h1 style={{
          fontSize: 32, fontWeight: 900,
          color: '#ff6b35', margin: '0 0 8px',
          textAlign: 'center', lineHeight: 1.2
        }}>
          MALLA REDDY
        </h1>
        <h2 style={{
          fontSize: 20, fontWeight: 600,
          color: 'white', margin: '0 0 16px', textAlign: 'center'
        }}>
          UNIVERSITY
        </h2>
        <div style={{
          width: 60, height: 3,
          background: '#ff6b35', borderRadius: 2, marginBottom: 20
        }} />
        <p style={{
          fontSize: 15, color: 'rgba(255,255,255,0.6)',
          textAlign: 'center', maxWidth: 320, lineHeight: 1.7
        }}>
          Smart Campus Helpdesk & Service Department System
        </p>

        {/* Feature highlights */}
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { icon: 'fa-ticket', text: 'Raise & Track Complaints' },
            { icon: 'fa-building', text: 'Auto Department Routing' },
            { icon: 'fa-chart-bar', text: 'Real-time Analytics' },
            { icon: 'fa-envelope', text: 'Email Notifications' },
          ].map(item => (
            <div key={item.text} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              color: 'rgba(255,255,255,0.7)', fontSize: 14
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'rgba(255,107,53,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <i className={`fa-solid ${item.icon}`} style={{ color: '#ff6b35', fontSize: 13 }}></i>
              </div>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        width: 480, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: 40, background: 'rgba(255,255,255,0.03)',
        borderLeft: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{
          background: 'white', borderRadius: 20, padding: 40,
          width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
        }}>

          {/* Form Header */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{
              fontSize: 24, fontWeight: 800,
              color: '#1a2942', margin: '0 0 6px'
            }}>
              Welcome Back!
            </h3>
            <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>
              Sign in to your campus helpdesk account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: '#fee2e2', color: '#991b1b',
              padding: '12px 16px', borderRadius: 8,
              fontSize: 13, marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 8,
              border: '1px solid #fecaca'
            }}>
              <i className="fa-solid fa-circle-xmark"></i>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 600, color: '#1e293b', marginBottom: 6
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fa-regular fa-envelope" style={{
                  position: 'absolute', left: 12,
                  top: '50%', transform: 'translateY(-50%)',
                  color: '#94a3b8', fontSize: 14
                }}></i>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  style={{
                    width: '100%', padding: '11px 14px 11px 38px',
                    borderRadius: 8, border: '1.5px solid #e2e8f0',
                    fontSize: 14, fontFamily: 'inherit',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#ff6b35'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 600, color: '#1e293b', marginBottom: 6
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fa-solid fa-lock" style={{
                  position: 'absolute', left: 12,
                  top: '50%', transform: 'translateY(-50%)',
                  color: '#94a3b8', fontSize: 14
                }}></i>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{
                    width: '100%', padding: '11px 14px 11px 38px',
                    borderRadius: 8, border: '1.5px solid #e2e8f0',
                    fontSize: 14, fontFamily: 'inherit',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#ff6b35'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                borderRadius: 8, border: 'none',
                background: loading ? '#fb9d75' : '#ff6b35',
                color: 'white', fontSize: 15,
                fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                transition: 'background 0.2s'
              }}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <p style={{
            textAlign: 'center', marginTop: 20,
            fontSize: 13.5, color: '#64748b'
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{
              color: '#ff6b35', fontWeight: 700,
              textDecoration: 'none'
            }}>
              Register here
            </Link>
          </p>

          {/* Footer */}
          <div style={{
            marginTop: 24, paddingTop: 20,
            borderTop: '1px solid #f1f5f9',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
              © 2024 Malla Reddy University. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}