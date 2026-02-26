import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [departments, setDepartments] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ role: '', department_id: '' });

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/users${search ? `?search=${search}` : ''}`
      );
      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/departments');
      setDepartments(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchUsers, 400);
    return () => clearTimeout(t);
  }, [search]);

  const openEdit = (user) => {
    setEditUser(user);
    setForm({
      role: user.role,
      department_id: user.department_id || ''
    });
  };

  const save = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${editUser.id}`, form);
      alert('User updated successfully!');
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      alert('Failed to update user');
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const roleColors = {
    admin: { bg: '#fee2e2', color: '#991b1b' },
    staff: { bg: '#dbeafe', color: '#1e40af' },
    student: { bg: '#f0fdf4', color: '#166534' },
    faculty: { bg: '#fef9c3', color: '#854d0e' }
  };

  return (
    <div className="app-layout">
      <Sidebar role="admin" />
      <div className="main-content">
        <div className="page-header">
          <h1>Users</h1>
        </div>
        <div className="page-content">
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>
            Manage Users
          </h2>

          {/* Search */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>User</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Role</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Department</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Joined</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const rs = roleColors[u.role] || { bg: '#f1f5f9', color: '#475569' };
                  return (
                    <tr key={u.id}>
                      <td style={{ padding: '13px 16px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: '#ff6b35', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 700, fontSize: 14
                          }}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '13px 16px', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{
                          fontSize: 12, padding: '4px 12px', borderRadius: 20,
                          background: rs.bg, color: rs.color, fontWeight: 600
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                        {u.department_name || '-'}
                      </td>
                      <td style={{ padding: '13px 16px', borderBottom: '1px solid #f1f5f9', fontSize: 12, color: '#94a3b8' }}>
                        {new Date(u.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td style={{ padding: '13px 16px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {/* EDIT BUTTON */}
                          <button
                            onClick={() => openEdit(u)}
                            style={{
                              background: '#1a2942', color: 'white',
                              border: 'none', padding: '7px 14px',
                              borderRadius: 7, fontSize: 12.5,
                              cursor: 'pointer', fontWeight: 600,
                              display: 'flex', alignItems: 'center', gap: 5
                            }}
                          >
                            ✏️ Edit Role
                          </button>
                          {/* DELETE BUTTON */}
                          <button
                            onClick={() => deleteUser(u.id)}
                            style={{
                              background: '#fee2e2', color: '#dc2626',
                              border: '1px solid #fecaca', padding: '7px 12px',
                              borderRadius: 7, fontSize: 12.5,
                              cursor: 'pointer', fontWeight: 600
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editUser && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: 20
        }}>
          <div style={{
            background: 'white', borderRadius: 16, padding: 32,
            width: '100%', maxWidth: 460,
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                  Edit User Role
                </h3>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
                  {editUser.name} — {editUser.email}
                </p>
              </div>
              <button
                onClick={() => setEditUser(null)}
                style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#94a3b8' }}
              >
                ×
              </button>
            </div>

            {/* Role Select */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Assign Role
              </label>
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  border: '1.5px solid #e2e8f0', fontSize: 14,
                  fontFamily: 'inherit', outline: 'none', background: 'white'
                }}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="staff">Staff (Department)</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Department Select - only show if staff */}
            {form.role === 'staff' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  Assign Department
                </label>
                <select
                  value={form.department_id}
                  onChange={e => setForm({ ...form, department_id: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    border: '1.5px solid #e2e8f0', fontSize: 14,
                    fontFamily: 'inherit', outline: 'none', background: 'white'
                  }}
                >
                  <option value="">-- Select Department --</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.department_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Info Box */}
            <div style={{
              background: '#f0f9ff', border: '1px solid #bae6fd',
              borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 12.5, color: '#0369a1'
            }}>
              {form.role === 'staff'
                ? '⚠️ Staff can only see complaints from their assigned department'
                : form.role === 'admin'
                ? '⚠️ Admin can see and manage ALL complaints'
                : 'ℹ️ Student/Faculty can raise complaints and track them'}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setEditUser(null)}
                style={{
                  flex: 1, padding: '11px', borderRadius: 8,
                  border: '1.5px solid #e2e8f0', background: 'white',
                  fontSize: 14, cursor: 'pointer', fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button
                onClick={save}
                style={{
                  flex: 1, padding: '11px', borderRadius: 8,
                  border: 'none', background: '#ff6b35', color: 'white',
                  fontSize: 14, cursor: 'pointer', fontWeight: 600
                }}
              >
                Save Changes ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}