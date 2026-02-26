import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function DeptComplaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: '', message: '' });
  const [updating, setUpdating] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/complaints${status ? `?status=${status}` : ''}`);
      setComplaints(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [status]);

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

  return (
    <div className="app-layout">
      <Sidebar role="staff" />
      <div className="main-content">
        <div className="page-header"><h1>Department Complaints</h1></div>
        <div className="page-content">
          <div style={{marginBottom:20}}>
            <h2 style={{fontSize:22,fontWeight:800}}>Assigned Complaints</h2>
            <p style={{color:'var(--text-muted)'}}>Complaints assigned to your department</p>
          </div>
          <div className="search-filters">
            <select className="filter-select" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          {loading ? <div className="loading-center"><div className="spinner"></div></div> : (
            complaints.length === 0 ? <div className="empty-state card"><i className="fa-regular fa-inbox"></i><h3>No complaints found</h3></div> : (
              <div className="table-container">
                <table>
                  <thead><tr><th>Ticket ID</th><th>Subject</th><th>User</th><th>Priority</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
                  <tbody>
                    {complaints.map(c => (
                      <tr key={c.id}>
                        <td><span className="ticket-id">{c.ticket_id}</span></td>
                        <td><span className="complaint-subject">{c.subject}</span></td>
                        <td><div className="user-cell"><strong>{c.user_name}</strong><span>{c.user_email}</span></div></td>
                        <td><span className={`badge badge-${c.priority}`}>{c.priority}</span></td>
                        <td><span className={`badge badge-${c.status}`}>{c.status.replace('_',' ')}</span></td>
                        <td style={{fontSize:12,color:'var(--text-muted)'}}>{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                        <td><button className="btn btn-outline btn-sm" onClick={() => openDetail(c.id)}><i className="fa-solid fa-eye"></i> View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth:560}}>
            <div className="modal-header">
              <div>
                <div className="ticket-id" style={{fontSize:13,marginBottom:4}}>{selected.ticket_id}</div>
                <div className="modal-title">{selected.subject}</div>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            </div>
            <div style={{display:'flex',gap:8,marginBottom:12}}>
              <span className={`badge badge-${selected.status}`}>{selected.status.replace('_',' ')}</span>
              <span className={`badge badge-${selected.priority}`}>{selected.priority}</span>
            </div>
            <p style={{marginBottom:12,fontSize:13.5}}>{selected.description}</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,background:'var(--bg)',padding:12,borderRadius:8,marginBottom:16,fontSize:12.5}}>
              <div><span style={{color:'var(--text-muted)'}}>User: </span><strong>{selected.user_name}</strong></div>
              {selected.location && <div><span style={{color:'var(--text-muted)'}}>Location: </span><strong>{selected.location}</strong></div>}
              {selected.block && <div><span style={{color:'var(--text-muted)'}}>Block/Room: </span><strong>{selected.block} {selected.room_no}</strong></div>}
            </div>
            <h4 style={{fontWeight:700,marginBottom:10}}>Update Status</h4>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={updateForm.status} onChange={e => setUpdateForm({...updateForm,status:e.target.value})}>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved / Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Action Taken / Remarks</label>
              <textarea className="form-control" rows={3} placeholder="Describe the action taken..." value={updateForm.message} onChange={e => setUpdateForm({...updateForm,message:e.target.value})} />
            </div>
            <div style={{display:'flex',gap:10}}>
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Close</button>
              <button className="btn btn-primary" disabled={updating} onClick={handleUpdate}>{updating ? 'Saving...' : 'Save Update'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}