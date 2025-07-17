import React, { useState, useEffect } from 'react';

const workTypeColors = {
  'full-time': 'badge-blue',
  'part-time': 'badge-green',
  internship: 'badge-purple',
  contract: 'badge-orange',
};
const statusColors = {
  applied: 'badge-gray',
  interview: 'badge-green',
  offer: 'badge-blue',
  reject: 'badge-red',
};

function timeAgo(date) {
  if (!date || isNaN(Number(date))) return '';
  const now = Date.now();
  const diff = now - Number(date);
  if (isNaN(diff)) return '';
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))} min ago`;
  if (diff < 24 * 60 * 60 * 1000) return `about ${Math.floor(diff / (60 * 60 * 1000))} hours ago`;
  if (diff < 30 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / (24 * 60 * 60 * 1000))} days ago`;
  return `${Math.floor(diff / (30 * 24 * 60 * 60 * 1000))} months ago`;
}

function DashboardJobsTable() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company: '', position: '', workType: 'full-time', location: '', status: 'applied' });
  const [editIdx, setEditIdx] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [workTypeFilter, setWorkTypeFilter] = useState('all');
  const [sort, setSort] = useState('latest');
  const [timelineOpen, setTimelineOpen] = useState(null);

  const dummyJobs = [
    {
      _id: 'dummy1',
      company: 'Google',
      position: 'Software Engineer',
      workType: 'full-time',
      location: 'Bangalore',
      status: 'offer',
      created: Date.now() - 2 * 24 * 60 * 60 * 1000,
      statusHistory: [
        { status: 'applied', date: Date.now() - 5 * 24 * 60 * 60 * 1000 },
        { status: 'interview', date: Date.now() - 3 * 24 * 60 * 60 * 1000 },
        { status: 'offer', date: Date.now() - 2 * 24 * 60 * 60 * 1000 },
      ],
    },
    {
      _id: 'dummy2',
      company: 'Amazon',
      position: 'SDE Intern',
      workType: 'internship',
      location: 'Hyderabad',
      status: 'reject',
      created: Date.now() - 7 * 24 * 60 * 60 * 1000,
      statusHistory: [
        { status: 'applied', date: Date.now() - 10 * 24 * 60 * 60 * 1000 },
        { status: 'interview', date: Date.now() - 8 * 24 * 60 * 60 * 1000 },
        { status: 'reject', date: Date.now() - 7 * 24 * 60 * 60 * 1000 },
      ],
    },
  ];

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      // Ensure all jobs have a valid created field
      const jobsWithCreated = data.map(job => ({ ...job, created: Number(job.created) || Date.now() }));
      if (jobsWithCreated.length === 0) setJobs(dummyJobs);
      else setJobs(jobsWithCreated);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs
    .filter(j => {
      if (statusFilter === 'all') return true;
      return j.status === statusFilter;
    })
    .filter(j => workTypeFilter === 'all' || j.workType === workTypeFilter)
    .sort((a, b) => {
      if (sort === 'latest') return b.created - a.created;
      if (sort === 'oldest') return a.created - b.created;
      if (sort === 'az') return a.company.localeCompare(b.company);
      if (sort === 'za') return b.company.localeCompare(a.company);
      return 0;
    });

  const getTimelinePath = (status) => {
    if (status === 'offer') return ['applied', 'interview', 'offer'];
    if (status === 'reject') return ['applied', 'interview', 'reject'];
    if (status === 'interview') return ['applied', 'interview'];
    return ['applied'];
  };

  const handleAddOrEdit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (editIdx !== null) {
      // Edit job
      const jobId = jobs[editIdx]._id;
      const res = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const updatedJob = await res.json();
      setJobs(jobs => jobs.map((j, i) => (i === editIdx ? updatedJob : j)));
      setEditIdx(null);
    } else {
      // Add job
      const jobData = { ...form, created: Date.now() };
      const res = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });
      const newJob = await res.json();
      setJobs(jobs => [newJob, ...jobs]);
    }
    setForm({ company: '', position: '', workType: 'full-time', location: '', status: 'applied' });
    setShowForm(false);
  };
  const handleEdit = idx => {
    setForm(jobs[idx]);
    setEditIdx(idx);
    setShowForm(true);
  };
  const handleDelete = async idx => {
    const token = localStorage.getItem('token');
    const jobId = jobs[idx]._id;
    await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setJobs(jobs => jobs.filter((_, i) => i !== idx));
  };
  const handleClear = () => {
    setStatusFilter('all');
    setWorkTypeFilter('all');
    setSort('latest');
  };

  // Timeline delete handler
  const handleTimelineDelete = async (jobIdx, statusIdx) => {
    const job = jobs[jobIdx];
    if (!job.statusHistory || job.statusHistory.length <= 1) return;
    // Remove the status at statusIdx
    const newHistory = job.statusHistory.filter((_, i) => i !== statusIdx);
    const newStatus = newHistory[newHistory.length - 1].status;
    // If dummy job, update locally
    if (job._id && job._id.startsWith('dummy')) {
      setJobs(jobs => jobs.map((j, idx) =>
        idx === jobIdx ? { ...j, status: newStatus, statusHistory: newHistory } : j
      ));
      return;
    }
    // For real jobs, update backend
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/api/jobs/${job._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...job, status: newStatus, statusHistory: newHistory })
    });
    const updatedJob = await res.json();
    setJobs(jobs => jobs.map((j, idx) => idx === jobIdx ? updatedJob : j));
  };

  if (loading) return <div>Loading jobs...</div>;

  return (
    <div className="dashboard-jobs-table-root">
      {/* Filter Bar */}
      <div className="dashboard-jobs-filter-bar">
        <div>
          <span>Status</span>
          {['applied', 'interview', 'reject', 'offer', 'all'].map(s => (
            <label key={s}><input type="radio" name="status" checked={statusFilter === s} onChange={() => setStatusFilter(s)} /> {s.charAt(0).toUpperCase() + s.slice(1)}</label>
          ))}
        </div>
        <div>
          <span>Work Type</span>
          {['full-time', 'part-time', 'internship', 'contract', 'all'].map(w => (
            <label key={w}><input type="radio" name="workType" checked={workTypeFilter === w} onChange={() => setWorkTypeFilter(w)} /> {w.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
          ))}
        </div>
        <div>
          <span>Sort</span>
          {['latest', 'oldest', 'az', 'za'].map(s => (
            <label key={s}><input type="radio" name="sort" checked={sort === s} onChange={() => setSort(s)} /> {s === 'az' ? 'A-Z' : s === 'za' ? 'Z-A' : s.charAt(0).toUpperCase() + s.slice(1)}</label>
          ))}
        </div>
      </div>
      {/* Table */}
      <div className="dashboard-jobs-table-wrapper">
        <table className="dashboard-jobs-table">
          <thead>
            <tr>
              <th>COMPANY NAME</th>
              <th>POSITION</th>
              <th>WORK TYPE</th>
              <th>LOCATION</th>
              <th>STATUS</th>
              <th>CREATED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job, idx) => (
              <React.Fragment key={job._id || idx}>
                <tr>
                  <td>{job.company}</td>
                  <td>{job.position}</td>
                  <td><span className={`dashboard-badge ${workTypeColors[job.workType]}`}>{job.workType.replace('-', ' ')}</span></td>
                  <td>{job.location}</td>
                  <td><span className={`dashboard-badge ${statusColors[job.status]}`}>{job.status}</span></td>
                  <td>
                    <span style={{ fontSize: '1.15em', color: '#aaa', fontWeight: 600 }}>{(() => { const d = new Date(job.created); return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear().toString().slice(-2)}`; })()}</span>
                  </td>
                  <td>
                    <button className="dashboard-jobs-icon-btn" onClick={() => handleEdit(jobs.indexOf(job))}>✏️</button>
                    <button className="dashboard-jobs-icon-btn" onClick={() => handleDelete(jobs.indexOf(job))}>🗑️</button>
                    <button className="dashboard-jobs-icon-btn" onClick={() => setTimelineOpen(timelineOpen === idx ? null : idx)}>
                      {timelineOpen === idx ? 'Hide Timeline' : 'View Timeline'}
                    </button>
                  </td>
                </tr>
                {timelineOpen === idx && (
                  <tr>
                    <td colSpan={7}>
                      <div style={{ padding: '1em 0' }}>
                        <strong>Status Timeline:</strong>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px', marginTop: '1em', overflowX: 'auto' }}>
                          {(job.statusHistory || []).map((h, i, arr) => {
                            let icon = '✔️';
                            if (h.status.toLowerCase().includes('document')) icon = '📄';
                            else if (h.status.toLowerCase().includes('contract')) icon = '✏️';
                            const isActive = i === arr.length - 1;
                            return (
                              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 120, position: 'relative' }}>
                                <div style={{
                                  width: 32, height: 32, borderRadius: '50%', background: isActive ? '#22c55e' : '#e5e7eb', color: isActive ? '#fff' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 6
                                }}>{icon}</div>
                                <div style={{ fontSize: 13, color: '#fff', marginBottom: 2 }}>
                                  {new Date(h.date).toLocaleString(undefined, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div style={{ fontWeight: 600, fontSize: 15, color: '#fff', marginBottom: 2 }}>
                                  {h.status.charAt(0).toUpperCase() + h.status.slice(1)}
                                </div>
                                {i < arr.length - 1 && (
                                  <div style={{ height: 2, width: 60, background: '#e5e7eb', margin: '16px 0' }} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <button className="dashboard-jobs-btn dashboard-jobs-add-btn" onClick={() => { setShowForm(true); setEditIdx(null); }}>+ New Job</button>
      </div>
      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="dashboard-jobs-modal">
          <form className="dashboard-jobs-form" onSubmit={handleAddOrEdit}>
            <input required placeholder="Company Name" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
            <input required placeholder="Position" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} />
            <select value={form.workType} onChange={e => setForm(f => ({ ...f, workType: e.target.value }))}>
              {['full-time', 'part-time', 'internship', 'contract'].map(w => <option key={w}>{w}</option>)}
            </select>
            <input required placeholder="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {['applied', 'interview', 'offer', 'reject'].map(s => <option key={s}>{s}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button type="submit" className="dashboard-jobs-btn">{editIdx !== null ? 'Update' : 'Add'}</button>
              <button type="button" className="dashboard-jobs-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function DashboardMain() {
  return (
    <div className="dashboard-main-layout">
      {/* Center: Jobs Table in a card */}
      <div className="dashboard-main-card dashboard-main-card-center">
        <DashboardJobsTable />
      </div>
    </div>
  );
}

export default DashboardMain; 