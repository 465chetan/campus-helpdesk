import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { to: '/dashboard', icon: 'fa-house', label: 'Dashboard' },
    { to: '/complaints/new', icon: 'fa-circle-plus', label: 'New Complaint' },
    { to: '/complaints', icon: 'fa-list-check', label: 'My Complaints' },
  ];

  const adminLinks = [
    { to: '/admin', icon: 'fa-house', label: 'Dashboard' },
    { to: '/admin/complaints', icon: 'fa-ticket', label: 'All Complaints' },
    { to: '/admin/departments', icon: 'fa-building', label: 'Departments' },
    { to: '/admin/users', icon: 'fa-users', label: 'Users' },
    { to: '/admin/reports', icon: 'fa-chart-bar', label: 'Reports' },
  ];

  const staffLinks = [
    { to: '/dept', icon: 'fa-house', label: 'Dashboard' },
    { to: '/dept/complaints', icon: 'fa-inbox', label: 'My Complaints' },
  ];

  const links = role === 'admin' ? adminLinks
    : role === 'staff' ? staffLinks
    : studentLinks;

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0,
      width: 260, background: '#1a2942',
      display: 'flex', flexDirection: 'column', zIndex: 100
    }}>

      {/* ── LOGO SECTION ── */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: 10
      }}>
        <img
          src="/logo.png"
          alt="MRU Logo"
          style={{
            width: 50, height: 50, borderRadius: 8,
            objectFit: 'contain', background: 'white',
            padding: 3, flexShrink: 0
          }}
        />
        <div>
          <div style={{
            fontSize: 13, fontWeight: 800,
            color: '#ff6b35', lineHeight: 1.2
          }}>
            MALLA REDDY
          </div>
          <div style={{
            fontSize: 10.5,
            color: 'rgba(255,255,255,0.5)'
          }}>
            University Helpdesk
          </div>
        </div>
      </div>

      {/* ── NAVIGATION LINKS ── */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={
              link.to === '/admin' ||
              link.to === '/dashboard' ||
              link.to === '/dept'
            }
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 20px',
              color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
              background: isActive ? 'rgba(255,107,53,0.18)' : 'transparent',
              borderLeft: isActive ? '3px solid #ff6b35' : '3px solid transparent',
              fontSize: 13.5, fontWeight: 500,
              textDecoration: 'none', transition: 'all 0.15s'
            })}
          >
            <i
              className={`fa-solid ${link.icon}`}
              style={{ width: 18, textAlign: 'center', fontSize: 15 }}
            ></i>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* ── USER FOOTER ── */}
      <div style={{
        padding: 14,
        borderTop: '1px solid rgba(255,255,255,0.08)'
      }}>

        {/* Click to go to Profile */}
        <div
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px',
            background: 'rgba(255,255,255,0.07)',
            borderRadius: 10, marginBottom: 10,
            cursor: 'pointer', transition: 'background 0.15s'
          }}
          onMouseEnter={e =>
            e.currentTarget.style.background = 'rgba(255,255,255,0.13)'
          }
          onMouseLeave={e =>
            e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
          }
        >
          {/* Avatar */}
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#ff6b35', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700,
            fontSize: 14, flexShrink: 0
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {/* Name + Email + Role */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 12.5, fontWeight: 700, color: 'white',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}>
              {user?.name}
            </div>
            <div style={{
              fontSize: 11, color: 'rgba(255,255,255,0.45)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}>
              {user?.email}
            </div>
            <span style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 20,
              background: 'rgba(255,107,53,0.2)', color: '#ff6b35',
              fontWeight: 700, textTransform: 'uppercase',
              display: 'inline-block', marginTop: 2
            }}>
              {user?.role}
            </span>
          </div>

          {/* Arrow icon */}
          <i
            className="fa-solid fa-chevron-right"
            style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}
          ></i>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: 9, borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.65)',
            fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8,
            fontFamily: 'inherit'
          }}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          Logout
        </button>

      </div>
    </aside>
  );
}