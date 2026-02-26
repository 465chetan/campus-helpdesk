import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    confirmPassword: '', role: 'student',
    uid: '', phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        uid: form.uid,
        phone: form.phone
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #1a2942 0%, #0f172a 100%)',
    }}>
      {/* Left Branding */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 60, color: 'white'
      }}>
        <img
          src="/logo.png"
          alt="MRU"
          style={{ width: 110, height: 110, objectFit: 'contain', marginBottom: 20 }}
        />
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#ff6b35', margin: '0 0 6px', textAlign: 'center' }}>
          MALLA REDDY
        </h1>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: 'white', margin: '0 0 16px', textAlign: 'center' }}>
          UNIVERSITY
        </h2>
        <div style={{ width: 50, height: 3, background: '#ff6b35', borderRadius: 2, marginBottom: 20 }} />
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center', maxWidth: 300, lineHeight: 1.7 }}>
          Smart Campus Helpdesk & Service Department System
        </p>
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { icon: 'fa-id-card', text: 'Register with your University ID' },
            { icon: 'fa-ticket', text: 'Raise and Track Complaints' },
            { icon: 'fa-bell', text: 'Get Email Notifications' },
            { icon: 'fa-shield-halved', text: 'Secure & Private' },
          ].map(item => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.7)', fontSize: 13.5 }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(255,107,53,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`fa-solid ${item.icon}`} style={{ color: '#ff6b35', fontSize: 12 }}></i>
              </div>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* Right Form */}
      <div style={{
        width: 500, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 40,
        background: 'rgba(255,255,255,0.03)',
        borderLeft: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{
          background: 'white', borderRadius: 20, padding: 36,
          width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
          maxHeight: '90vh', overflowY: 'auto'
        }}>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1a2942', margin: '0 0 6px' }}>
              Create Account
            </h3>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              Join MRU Campus Helpdesk System
            </p>
          </div>

          {success && (
            <div style={{ background: '#d1fae5', color: '#065f46', padding: '12px 16px', borderRadius: 8, fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fa-solid fa-circle-check"></i>
              Registration successful! Redirecting to login...
            </div>
          )}

          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 8, fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fa-solid fa-circle-xmark"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Role Selection */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                I am a
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { value: 'student', label: 'Student', icon: 'fa-user-graduate' },
                  { value: 'faculty', label: 'Faculty', icon: 'fa-chalkboard-teacher' },
                ].map(r => (
                  <div
                    key={r.value}
                    onClick={() => setForm({ ...form, role: r.value })}
                    style={{
                      border: `2px solid ${form.role === r.value ? '#ff6b35' : '#e2e8f0'}`,
                      borderRadius: 10, padding: '12px',
                      cursor: 'pointer', textAlign: 'center',
                      background: form.role === r.value ? '#fff4f0' : 'white',
                      transition: 'all 0.15s'
                    }}
                  >
                    <i className={`fa-solid ${r.icon}`} style={{ fontSize: 20, color: form.role === r.value ? '#ff6b35' : '#94a3b8', marginBottom: 4, display: 'block' }}></i>
                    <div style={{ fontSize: 13, fontWeight: 600, color: form.role === r.value ? '#ff6b35' : '#64748b' }}>
                      {r.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* University ID */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                University ID <span style={{ color: '#ff6b35' }}>*</span>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400, marginLeft: 6 }}>
                  (e.g. MRU2024001)
                </span>
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fa-solid fa-id-card" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                <input
                  placeholder="Enter your University ID"
                  value={form.uid}
                  onChange={e => setForm({ ...form, uid: e.target.value.toUpperCase() })}
                  required
                  style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', textTransform: 'uppercase', letterSpacing: 1 }}
                  onFocus={e => e.target.style.borderColor = '#ff6b35'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Full Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Full Name <span style={{ color: '#ff6b35' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fa-solid fa-user" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                <input
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#ff6b35'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Email Address <span style={{ color: '#ff6b35' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fa-regular fa-envelope" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#ff6b35'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Phone */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fa-solid fa-phone" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#ff6b35'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Password <span style={{ color: '#ff6b35' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fa-solid fa-lock" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#ff6b35'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Confirm Password <span style={{ color: '#ff6b35' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fa-solid fa-lock" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 8, border: `1.5px solid ${form.confirmPassword && form.password !== form.confirmPassword ? '#ef4444' : '#e2e8f0'}`, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#ff6b35'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <div style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>
                  <i className="fa-solid fa-circle-xmark" style={{ marginRight: 4 }}></i>
                  Passwords do not match
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              style={{
                width: '100%', padding: '13px', borderRadius: 8,
                border: 'none', background: loading ? '#fb9d75' : '#ff6b35',
                color: 'white', fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8
              }}
            >
              {loading ? (
                <><i className="fa-solid fa-spinner fa-spin"></i> Creating Account...</>
              ) : (
                <><i className="fa-solid fa-user-plus"></i> Create Account</>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13.5, color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#ff6b35', fontWeight: 700, textDecoration: 'none' }}>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}