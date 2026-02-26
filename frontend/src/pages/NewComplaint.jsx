import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { key: 'library', label: 'Library', icon: '📚', desc: 'Books, resources, facilities' },
  { key: 'transport', label: 'Transport', icon: '🚌', desc: 'Bus routes, schedules, issues' },
  { key: 'hostel', label: 'Hostel', icon: '🏠', desc: 'Accommodation, rooms, facilities' },
  { key: 'auditorium', label: 'Auditorium', icon: '🎭', desc: 'Events, bookings, equipment' },
  { key: 'canteen', label: 'Canteen', icon: '🍽️', desc: 'Food quality, hygiene, service' },
  { key: 'it_support', label: 'IT Support', icon: '💻', desc: 'Network, computers, software' },
  { key: 'examination', label: 'Examination Cell', icon: '📝', desc: 'Exams, results, scheduling' },
  { key: 'maintenance', label: 'Maintenance', icon: '🔧', desc: 'Plumbing, electrical, civil' },
  { key: 'others', label: 'Others', icon: '📋', desc: 'General administration' },
];

export default function NewComplaint() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(params.get('cat') || '');
  const [form, setForm] = useState({ subject: '', description: '', location: '', block: '', room_no: '', priority: 'medium' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { if (params.get('cat')) { setCategory(params.get('cat')); setStep(2); } }, []);

  const handleSubmit = async () => {
    if (!form.subject || !form.description) { setError('Subject and description are required'); return; }
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      Object.entries({ ...form, category }).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('attachment', file);
      const { data } = await axios.post('/api/complaints', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(`Complaint submitted! Ticket ID: ${data.ticketId}`);
      setTimeout(() => navigate('/complaints'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="app-layout">
      <Sidebar role={user?.role} />
      <div className="main-content">
        <div className="page-header">
          <h1>New Complaint</h1>
        </div>
        <div className="page-content" style={{maxWidth:800,margin:'0 auto'}}>
          <div style={{marginBottom:24}}>
            <h2 style={{fontSize:22,fontWeight:800,marginBottom:4}}>Raise New Complaint</h2>
            <p style={{color:'var(--text-muted)'}}>Submit your complaint and we'll route it to the right department</p>
          </div>

          <div className="steps" style={{marginBottom:28}}>
            <div className={`step ${step >= 1 ? (step > 1 ? 'done' : 'active') : ''}`}>
              <div className="step-num">{step > 1 ? '✓' : '1'}</div>
              <span className="step-label">Category</span>
            </div>
            <div className={`step-line ${step > 1 ? 'done' : ''}`}></div>
            <div className={`step ${step >= 2 ? (step > 2 ? 'done' : 'active') : ''}`}>
              <div className="step-num">{step > 2 ? '✓' : '2'}</div>
              <span className="step-label">Details</span>
            </div>
            <div className={`step-line ${step > 2 ? 'done' : ''}`}></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-num">3</div>
              <span className="step-label">Review</span>
            </div>
          </div>

          {success && <div className="alert alert-success"><i className="fa-solid fa-check-circle"></i> {success}</div>}
          {error && <div className="alert alert-error"><i className="fa-solid fa-circle-xmark"></i> {error}</div>}

          <div className="card">
            {step === 1 && (
              <>
                <h3 style={{fontWeight:700,marginBottom:16}}>Select a Category</h3>
                <div className="category-grid">
                  {CATEGORIES.map(cat => (
                    <div key={cat.key} className={`category-card ${category === cat.key ? 'selected' : ''}`} onClick={() => setCategory(cat.key)}>
                      <span className="category-card-icon">{cat.icon}</span>
                      <h3>{cat.label}</h3>
                      <p>{cat.desc}</p>
                    </div>
                  ))}
                </div>
                <div style={{textAlign:'right',marginTop:20}}>
                  <button className="btn btn-primary" disabled={!category} onClick={() => setStep(2)}>
                    Next: Add Details <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div style={{display:'flex',gap:12,marginBottom:16,alignItems:'center'}}>
                  <span style={{fontSize:28}}>{CATEGORIES.find(c=>c.key===category)?.icon}</span>
                  <div>
                    <h3 style={{fontWeight:700}}>{CATEGORIES.find(c=>c.key===category)?.label} Complaint</h3>
                    <p style={{fontSize:12.5,color:'var(--text-muted)'}}>Fill in the details below</p>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject <span>*</span></label>
                  <input className="form-control" placeholder="Brief title for your complaint" value={form.subject} onChange={e => setForm({...form,subject:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Description <span>*</span></label>
                  <textarea className="form-control" rows={4} placeholder="Provide detailed description of your complaint..." value={form.description} onChange={e => setForm({...form,description:e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input className="form-control" placeholder="e.g., Main Campus" value={form.location} onChange={e => setForm({...form,location:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Block</label>
                    <input className="form-control" placeholder="e.g., Block A" value={form.block} onChange={e => setForm({...form,block:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Room No.</label>
                    <input className="form-control" placeholder="e.g., 101" value={form.room_no} onChange={e => setForm({...form,room_no:e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-control" value={form.priority} onChange={e => setForm({...form,priority:e.target.value})}>
                    <option value="low">Low - Can wait</option>
                    <option value="medium">Medium - Normal urgency</option>
                    <option value="high">High - Urgent</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Attachments (Optional)</label>
                  <div className="file-upload-area" onClick={() => document.getElementById('fileInput').click()}>
                    {file ? (
                      <><i className="fa-solid fa-file-check" style={{color:'var(--success)',fontSize:24,marginBottom:8}}></i><br/><strong>{file.name}</strong></>
                    ) : (
                      <><i className="fa-solid fa-cloud-arrow-up" style={{fontSize:24,color:'var(--text-muted)',marginBottom:8}}></i><br/><p style={{color:'var(--text-muted)'}}>Click to upload images or documents</p></>
                    )}
                    <input id="fileInput" type="file" hidden accept="image/*,.pdf,.doc,.docx" onChange={e => setFile(e.target.files[0])} />
                  </div>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',marginTop:20}}>
                  <button className="btn btn-outline" onClick={() => setStep(1)}><i className="fa-solid fa-arrow-left"></i> Back</button>
                  <button className="btn btn-primary" disabled={!form.subject || !form.description} onClick={() => setStep(3)}>Review <i className="fa-solid fa-arrow-right"></i></button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h3 style={{fontWeight:700,marginBottom:16}}>Review & Submit</h3>
                <div style={{background:'var(--bg)',borderRadius:10,padding:20,marginBottom:20}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                    {[['Category', CATEGORIES.find(c=>c.key===category)?.label], ['Priority', form.priority.toUpperCase()], ['Subject', form.subject], ['Location', form.location || '-'], ['Block', form.block || '-'], ['Room No.', form.room_no || '-']].map(([k, v]) => (
                      <div key={k}>
                        <div style={{fontSize:11.5,color:'var(--text-muted)',fontWeight:600,marginBottom:2}}>{k}</div>
                        <div style={{fontWeight:600,fontSize:13.5}}>{v}</div>
                      </div>
                    ))}
                    <div style={{gridColumn:'span 2'}}>
                      <div style={{fontSize:11.5,color:'var(--text-muted)',fontWeight:600,marginBottom:2}}>Description</div>
                      <div style={{fontSize:13.5}}>{form.description}</div>
                    </div>
                    {file && <div><div style={{fontSize:11.5,color:'var(--text-muted)',fontWeight:600,marginBottom:2}}>Attachment</div><div style={{fontSize:13.5}}>{file.name}</div></div>}
                  </div>
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <button className="btn btn-outline" onClick={() => setStep(2)}><i className="fa-solid fa-arrow-left"></i> Back</button>
                  <button className="btn btn-primary" disabled={loading} onClick={handleSubmit}>
                    {loading ? 'Submitting...' : <><i className="fa-solid fa-paper-plane"></i> Submit Complaint</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}