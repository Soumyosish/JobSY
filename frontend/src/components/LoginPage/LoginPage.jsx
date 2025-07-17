import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { useLocation, useNavigate } from 'react-router-dom';

function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}
function setUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const token = location.pathname.split('/').pop();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!password || !confirm) {
      setError('Please fill all fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const res = await fetch(`${API_BASE_URL}/api/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess('Password updated! You can now log in.');
      setTimeout(() => navigate('/'), 2000);
    } else {
      setError(data.message || 'Reset failed');
    }
  };

  return (
    <div className="login-page-container">
      <h2>Reset Password</h2>
      <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
        <label>
          New Password
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <label>
          Confirm Password
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
        </label>
        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-success">{success}</div>}
        <button type="submit" className="login-btn">Reset Password</button>
      </form>
    </div>
  );
}

function LoginPage({ onLogin, logoutMessage, clearLogoutMessage, loginMessage, clearLoginMessage }) {
  const [tab, setTab] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (logoutMessage) {
      setTimeout(() => {
        clearLogoutMessage && clearLogoutMessage();
      }, 3500);
    }
  }, [logoutMessage, clearLogoutMessage]);

  // LOGIN
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          setError('');
          setSuccess('');
          onLogin(email); // Optionally pass user info
        } else {
          setError(data.message || 'Login failed');
        }
      })
      .catch(() => setError('Network error'));
  };

  // SIGN UP
  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!signupEmail || !signupPassword || !signupConfirm) {
      setError('Please fill all fields.');
      return;
    }
    if (signupPassword !== signupConfirm) {
      setError('Passwords do not match.');
      return;
    }
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: signupEmail, password: signupPassword, name: signupEmail.split('@')[0] }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          setSuccess('Account created! You can now log in.');
          setTab('login');
          setSignupEmail('');
          setSignupPassword('');
          setSignupConfirm('');
        } else {
          setError(data.message || 'Signup failed');
        }
      })
      .catch(() => setError('Network error'));
  };

  // FORGOT PASSWORD
  const handleForgot = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!forgotEmail) {
      setError('Please enter your email.');
      return;
    }
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail })
    });
    const data = await res.json();
    setSuccess(data.message || 'If the email exists, a reset link will be sent.');
    setError('');
  };

  return (
    <div className="login-page-container">
      {/* Beautiful logo/icon at the top */}
      <div className="login-logo" aria-label="App Logo">🚀</div>
      {logoutMessage && <div className="logout-message">{logoutMessage}</div>}
      {loginMessage && <div className="login-success" onClick={clearLoginMessage}>{loginMessage}</div>}
      <div className="login-tabs">
        <button className={tab === 'login' ? 'active' : ''} onClick={() => { setTab('login'); setError(''); setSuccess(''); clearLoginMessage && clearLoginMessage(); }}>Login</button>
        <button className={tab === 'signup' ? 'active' : ''} onClick={() => { setTab('signup'); setError(''); setSuccess(''); clearLoginMessage && clearLoginMessage(); }}>Sign Up</button>
      </div>
      {tab === 'login' && (
        <form className="login-form" onSubmit={handleLogin} autoComplete="off">
          <h2 className="login-title">Login</h2>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <div className="login-links">
            <button type="button" className="forgot-link" onClick={() => { setTab('forgot'); setError(''); setSuccess(''); }}>Forgot Password?</button>
          </div>
          {error && <div className="login-error">{error}</div>}
          {success && <div className="login-success">{success}</div>}
          <button type="submit" className="login-btn">Login</button>
        </form>
      )}
      {tab === 'signup' && (
        <form className="login-form" onSubmit={handleSignup} autoComplete="off">
          <h2 className="login-title">Sign Up</h2>
          <label>
            Email
            <input
              type="email"
              value={signupEmail}
              onChange={e => setSignupEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={signupPassword}
              onChange={e => setSignupPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
          <label>
            Confirm Password
            <input
              type="password"
              value={signupConfirm}
              onChange={e => setSignupConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
          {error && <div className="login-error">{error}</div>}
          {success && <div className="login-success">{success}</div>}
          <button type="submit" className="login-btn">Create Account</button>
        </form>
      )}
      {tab === 'forgot' && (
        <form className="login-form" onSubmit={handleForgot} autoComplete="off">
          <h2 className="login-title">Forgot Password</h2>
          <label>
            Email
            <input
              type="email"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          {error && <div className="login-error">{error}</div>}
          {success && <div className="login-success">{success}</div>}
          <button type="submit" className="login-btn" style={{ pointerEvents: 'auto', opacity: 1 }}>Send Reset Link</button>
          <button type="button" className="back-link" onClick={() => { setTab('login'); setError(''); setSuccess(''); }}>Back to Login</button>
        </form>
      )}
    </div>
  );
}

export default LoginPage;
export { ResetPassword }; 