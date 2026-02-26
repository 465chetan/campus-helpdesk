import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function AdminComplaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('');
  const [catF, setCatF] = useState('');
  const [selected, setSelected] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: '', message: '' });
  const [updating, setUpdating] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusF) params.append('status', statusF);
      if (catF) params.append('category', catF);
      const { data } = await axios.get(`/api/complaints?${params}`);
      setComplaints(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); axios.get('/api/departments').then(r => setDepartments(r.data)); }, []);
  useEffect(() => { const t = setTimeout(fetch, 400); return () => clearTimeout(t); }, [search, statusF, catF]);

  const openDetail = async (id) => {
    const { data } = await axios.get(`/api/complaints/${id}`);
    setSelected(data);
    setUpdateForm({ status: data.status, message: '' });
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await axios.put(`/api/complaints/${selected.id}`, updateForm);
      await openDetail(selected.id);
      fetch();
    } finally { setUpdating(false); }
  };

  const exportCSV = () => {
    const headers = ['Ticket ID', 'Subject', 'User', 'Email', 'Category', 'Department', 'Priority', 'Status', 'Date'];
    const rows = complaints.map(c => [c.ticket_id, c.subject, c.user_name, c.user_email, c.category, c.department_name || '-', c.priority, c.status, new Date(c.created_at).toLocaleDateString()]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `complaints-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="app-layout">
      <Sidebar role="admin" />
      <div className="main-content">
        <div className="page-header">
          <h1>All Complaints</h1>
          <div style={{display:'flex',gap:10}}>
            <button className="btn btn-outline btn-sm" onClick={fetch}><i className="fa-solid fa-rotate"></i> Refresh</button>
            <button className="btn btn-dark btn-sm" onClick={exportCSV}><i className="fa-solid fa-download"></i> Export</button>
          </div>
        </div>
        <div className="page-content">
          <div style={{marginBottom:4}}>
            <h2 style={{fontSize:22,fontWeight:800}}>All Complaints</h2>
            <p style={{color:'var(--text-muted)'}}>Manage and track all complaints across departments</p>
          </div>
          <div className="search-filters" style={{marginTop:20}}>
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input placeholder="Search by ticket, subject or user..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={statusF} onChange={e => setStatusF(e.target.value)}>
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <select className="filter-select" value={catF} onChange={e => setCatF(e.target.value)}>
              <option value="">All Categories</option>
              {['library','transport','hostel','auditorium','canteen','it_support','examination','maintenance','others'].map(c => (
                <option key={c} value={c}>{c.replace('_',' ').replace(/\b\w/g, l=>l.toUpperCase())}</option>
              ))}
            </select>
          </div>
          {loading ? <div className="loading-center"><div className="spinner"></div></div> : (
            <div className="table-container">
              <table>
                <thead><tr><th>Ticket ID</th><th>Subject</th><th>User</th><th>Category</th><th>Department</th><th>Priority</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {complaints.map(c => (
                    <tr key={c.id}>
                      <td><span className="ticket-id">{c.ticket_id}</span></td>
                      <td><span className="complaint-subject" style={{maxWidth:160}}>{c.subject}</span></td>
                      <td><div className="user-cell"><strong>{c.user_name}</strong><span>{c.user_email}</span></div></td>
                      <td style={{textTransform:'capitalize'}}>{c.category.replace('_',' ')}</td>
                      <td>{c.department_name || '-'}</td>
                      <td><span className={`badge badge-${c.priority}`}>{c.priority}</span></td>
                      <td><span className={`badge badge-${c.status}`}>{c.status.replace('_',' ')}</span></td>
                      <td style={{fontSize:12,color:'var(--text-muted)'}}>{new Date(c.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td>
                      <td>
                        <div className="dropdown">
                          <button className="actions-btn" onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}>⋮</button>
                          {openMenu === c.id && (
                            <div className="dropdown-menu" onClick={() => setOpenMenu(null)}>
                              <div className="dropdown-item" onClick={() => openDetail(c.id)}><i className="fa-solid fa-eye"></i> View Details</div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth:580}}>
            <div className="modal-header">
              <div>
                <div className="ticket-id" style={{fontSize:13,marginBottom:4}}>{selected.ticket_id}</div>
                <div className="modal-title">{selected.subject}</div>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            </div>
            <div style={{display:'flex',gap:8,marginBottom:16}}>
              <span className={`badge badge-${selected.status}`}>{selected.status.replace('_',' ')}</span>
              <span className={`badge badge-${selected.priority}`}>{selected.priority}</span>
              {selected.department_name && <span className="badge" style={{background:'var(--bg)',color:'var(--text)'}}>{selected.department_name}</span>}
            </div>
            <p style={{marginBottom:12,fontSize:13.5}}>{selected.description}</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,background:'var(--bg)',padding:14,borderRadius:8,marginBottom:16,fontSize:13}}>
              <div><span style={{color:'var(--text-muted)'}}>User: </span><strong>{selected.user_name}</strong></div>
              <div><span style={{color:'var(--text-muted)'}}>Email: </span><strong>{selected.user_email}</strong></div>
              {selected.location && <div><span style={{color:'var(--text-muted)'}}>Location: </span><strong>{selected.location}</strong></div>}
              {selected.block && <div><span style={{color:'var(--text-muted)'}}>Block: </span><strong>{selected.block} {selected.room_no}</strong></div>}
            </div>
            <h4 style={{fontWeight:700,marginBottom:10}}>Update Complaint</h4>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={updateForm.status} onChange={e => setUpdateForm({...updateForm, status: e.target.value})}>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Remarks</label>
              <textarea className="form-control" rows={3} placeholder="Add remarks or action taken..." value={updateForm.message} onChange={e => setUpdateForm({...updateForm, message: e.target.value})} />
            </div>
            <div style={{display:'flex',gap:10}}>
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn btn-primary" disabled={updating} onClick={handleUpdate}>{updating ? 'Updating...' : 'Update Complaint'}</button>
            </div>
            {selected.updates?.length > 0 && (
              <div style={{marginTop:20}}>
                <h4 style={{fontWeight:700,marginBottom:12}}>History</h4>
                <div className="timeline">
                  {selected.updates.map(u => (
                    <div key={u.id} className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        {u.status && <span className={`badge badge-${u.status}`} style={{display:'inline-block',marginBottom:4}}>{u.status.replace('_',' ')}</span>}
                        {u.message && <p style={{fontSize:13}}>{u.message}</p>}
                        <div className="timeline-meta">{u.updater_name} · {new Date(u.created_at).toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}