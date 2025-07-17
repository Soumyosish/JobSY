import React from 'react';
import './FullPageRounded.css';

function FullPageRounded({ children }) {
  return (
    <div className="fullpage-rounded">
      {children}
    </div>
  );
}

export default FullPageRounded; 