import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import FullPageRounded from './components/FullPageRounded/FullPageRounded';
import React, { useState, useEffect } from 'react';
import OpportunityBoard from './components/OpportunityBoard/OpportunityBoard';
import GoalSetting from './components/GoalSetting/GoalSetting';
import ProfilePage from './components/ProfilePage/ProfilePage';
import LoginPage from './components/LoginPage/LoginPage';
import DashboardMain from './DashboardMain';
import Resume from './components/Resume/Resume';

function App() {
  const [selected, setSelected] = useState('Dashboard');
  const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [logoutMessage, setLogoutMessage] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [theme] = useState('dark');

  const handleSidebarSelect = (label) => {
    setSelected(label);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setLogoutMessage('You have been logged out.');
    setLoginMessage('');
    localStorage.removeItem('token');
  };

  const handleLogin = (email) => {
    setLoggedIn(true);
    setSelected('Dashboard');
    setLogoutMessage('');
    setLoginMessage('Login successful!');
  };

  useEffect(() => {
    if (theme === 'device') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      document.body.className = mq.matches ? 'dark-theme' : 'light-theme';
    } else {
      document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    }
  }, [theme]);

  useEffect(() => {
    function handleResize() {}
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (loggedIn && !localStorage.getItem('token')) {
      setLoggedIn(false);
    }
  }, [loggedIn]);

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} logoutMessage={logoutMessage} clearLogoutMessage={() => setLogoutMessage('')} loginMessage={loginMessage} clearLoginMessage={() => setLoginMessage('')} />;
  }

  return (
    <div className="app-flex-layout">
      <Sidebar onSelect={handleSidebarSelect} selected={selected} onLogout={handleLogout} />
      <div className="main-content-area">
        <FullPageRounded>
          {selected === 'Dashboard' && <DashboardMain />}
          {selected === 'Opportunity Board' && <OpportunityBoard />}
          {selected === 'Goal Setting' && <GoalSetting />}
          {selected === 'Profile' && <ProfilePage />}
          {selected === 'Resume' && <Resume />}
        </FullPageRounded>
      </div>
    </div>
  );
}

export default App;
