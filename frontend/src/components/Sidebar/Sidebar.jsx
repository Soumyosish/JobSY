import React, { useState, useEffect } from 'react';
import './Sidebar.css';

const menuItems = [
  { section: 'Menu', items: [
    { icon: '📊', label: 'Dashboard' },
    { icon: '👤', label: 'Opportunity Board' },
  ]},
  { section: 'Productivity', items: [
    { icon: '🎯', label: 'Goal Setting' },
    { icon: '📄', label: 'Resume' },
  ]},
  
  { section: 'Profile', items: [
    { icon: '👤', label: 'Profile' },
  ]},
  // Remove Settings section and add Logout as a menu item
  { section: '', items: [
    { icon: '🚪', label: 'Logout', isLogout: true },
  ]},
];

function Sidebar({ onSelect, selected, onLogout }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1100);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1100);
      if (window.innerWidth > 1100) setDrawer(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Remove filtering logic so Goal Setting is always shown
  const filteredMenuItems = menuItems;

  const handleItemClick = (label, isLogout) => {
    if (isLogout) {
      onLogout && onLogout();
      return;
    }
    if (onSelect) onSelect(label);
    if (isMobile) setDrawer(false);
  };

  const sidebarContent = (
    <nav className="sidebar-content">
      {filteredMenuItems.map(section => (
        <div key={section.section} className="sidebar-section">
          {section.section && <div className="sidebar-section-title">{section.section}</div>}
          {section.items.map(item => (
            <div
              key={item.label}
              className={`sidebar-item${selected === item.label ? ' active' : ''}${item.isLogout ? ' logout' : ''}`}
              onClick={() => handleItemClick(item.label, item.isLogout)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </div>
          ))}
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {isMobile ? (
        <>
          <button className="sidebar-hamburger" onClick={() => setDrawer(true)}>
            <span />
            <span />
            <span />
          </button>
          {drawer && (
            <div className="sidebar-drawer-overlay" onClick={() => setDrawer(false)}>
              <div className="sidebar-drawer" onClick={e => e.stopPropagation()}>
                <button className="sidebar-drawer-close" onClick={() => setDrawer(false)}>&times;</button>
                {sidebarContent}
              </div>
            </div>
          )}
        </>
      ) : (
        <aside className="sidebar">
          {sidebarContent}
        </aside>
      )}
      <div className="sidebar-logout-container">
        <button className="sidebar-logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </>
  );
}

export default Sidebar; 