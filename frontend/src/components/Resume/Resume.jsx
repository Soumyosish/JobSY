import React, { useRef, useState, useEffect } from 'react';

const Resume = () => {
  const [resumeUrl, setResumeUrl] = useState(null);
  const fileInputRef = useRef();
  const token = localStorage.getItem('token');
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchResume = async () => {
      const res = await fetch(`${API_BASE_URL}/api/resume/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.resume) setResumeUrl(data.resume); // Use the full URL from the backend
        else setResumeUrl(null);
      } else {
        setResumeUrl(null);
      }
    };
    fetchResume();
  }, [token]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await fetch(`${API_BASE_URL}/api/resume/upload-resume`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setResumeUrl(data.resume); // Use the full URL from the backend
      } else {
        alert('Failed to upload resume.');
      }
    } else {
      alert('Please upload a PDF file.');
    }
  };

  const handleReplace = () => {
    fileInputRef.current.value = '';
    fileInputRef.current.click();
  };

  const handleRemove = async () => {
    const res = await fetch(`${API_BASE_URL}/api/resume/delete`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setResumeUrl(null);
    } else {
      alert('Failed to delete resume.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#23272f', borderRadius: 16, padding: 32, color: '#fff', boxShadow: '0 4px 32px #000a' }}>
      <h2 style={{ marginBottom: 24 }}>Resume</h2>
      {!resumeUrl ? (
        <>
          <input type="file" accept="application/pdf" style={{ display: 'none' }} ref={fileInputRef} onChange={handleUpload} />
          <button onClick={() => fileInputRef.current.click()} style={{ padding: '12px 28px', fontSize: 16, borderRadius: 8, background: '#ffe082', color: '#23272f', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Upload Resume (PDF)</button>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ marginBottom: 18 }}>
            <embed src={resumeUrl} type="application/pdf" width="100%" height="400px" style={{ borderRadius: 8, background: '#fff' }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href={resumeUrl} download="Resume.pdf" style={{ padding: '10px 22px', background: '#22c55e', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>Download</a>
            <button onClick={handleReplace} style={{ padding: '10px 22px', background: '#2563eb', color: '#fff', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Replace</button>
            <button onClick={handleRemove} style={{ padding: '10px 22px', background: '#ef4444', color: '#fff', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Delete</button>
            <input type="file" accept="application/pdf" style={{ display: 'none' }} ref={fileInputRef} onChange={handleUpload} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Resume;