import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function AdminDepartments() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [form, setForm] = useState({ department_name: '', category_key: '', description: '', email: '', head_name: '' });

  useEffect(() => { axios.get('/api/departments').then(r => setDepartments(r.data)); }, []);

  const save = async () => {
    if (editDept) await axios.put(`/api/departments/${editDept.id}`, form);
    else await axios.post('/api/departments', form);
    const { data } = await axios.get('/api/departments');
    setDepartments(data);
    setShowModal(false);
    setEditDept(null);
    setForm({ department_name: '', category_key: '', description: '', email: '', head_name: '' });
  };

  const deleteDept = async (id) => {
    if (!confirm('Delete this department?')) return;
    await axios.delete(`/api/departments/${id}`);
    setDepartments(depts => depts.filter(d => d.id !== id));
  };

  const openEdit = (d) => { setEditDept(d); setForm({ department_name: d.department_name, category_key: d.category_key, description: d.description || '', email: d.email || '', head_name: d.head_name || '' }); setShowModal(true); };

  return (
    <div className="app-layout">
      <Sidebar role="admin" />
      <div className="main-content">
        <div className="page-header"><h1>Departments</h1></div>
        <div className="page-content">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
            <div><h2 style={{fontSize:22,fontWeight:800}}>Departments</h2><p style={{color:'var(--text-muted)'}}>Manage service departments</p></div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}><i className="fa-solid fa-plus"></i> Add Department</button>
          </div>
          <div className="dept-grid">
            {departments.map(d => (
              <div key={d.id} className="dept-card">
                <div className="dept-card-header">
                  <div style={{display:'flex',gap:12,alignItems:'center'}}>
                    <div className="dept-icon"><i className="fa-solid fa-building"></i></div>
                    <div>
                      <strong style={{fontSize:15}}>{d.department_name}</strong>
                      <div style={{fontSize:11.5,color:'var(--text-muted)'}}>{d.category_key}</div>
                    </div>
                  </div>
                  <span className="dept-active-badge">Active</span>
                </div>
                <p style={{fontSize:12.5,color:'var(--text-muted)',marginBottom:10}}>{d.description}</p>
                {d.email && <div className="dept-meta"><i className="fa-regular fa-envelope"></i>{d.email}</div>}
                {d.head_name && <div className="dept-meta"><i className="fa-regular fa-user"></i>{d.head_name}</div>}
                <div className="dept-stats">
                  <div className="dept-stat-item">Total: <span>{d.total_complaints || 0}</span></div>
                  <div className="dept-stat-item" style={{color:'var(--warning)'}}>Pending: <span>{d.pending || 0}</span></div>
                  <div className="dept-stat-item" style={{color:'var(--success)'}}>Resolved: <span>{d.resolved || 0}</span></div>
                </div>
                <div className="dept-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(d)}><i className="fa-solid fa-pen"></i> Edit</button>
                  <button className="btn btn-outline btn-sm" style={{color:'var(--danger)',borderColor:'var(--danger)'}} onClick={() => deleteDept(d.id)}><i className="fa-solid fa-trash"></i></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setEditDept(null); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">{editDept ? 'Edit' : 'Add'} Department</div><button className="modal-close" onClick={() => { setShowModal(false); setEditDept(null); }}>×</button></div>
            {[['department_name','Department Name'],['category_key','Category Key (e.g. library)'],['email','Email'],['head_name','Head Name']].map(([k, label]) => (
              <div className="form-group" key={k}>
                <label className="form-label">{label}</label>
                <input className="form-control" value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows={2} value={form.description} onChange={e => setForm({...form,description:e.target.value})} />
            </div>
            <div style={{display:'flex',gap:10}}>
              <button className="btn btn-outline" onClick={() => { setShowModal(false); setEditDept(null); }}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}