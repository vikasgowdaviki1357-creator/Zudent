import React from 'react';
import '../../styles/components.css';

export default function Loader({ mode = 'inline', text, size = 'md', className = '' }) {
  const content = (
    <div className={`loader-content loader-content--${size} ${className}`}>
      <div className="loader-spinner"></div>
      {text && <span className="loader-text">{text}</span>}
    </div>
  );

  if (mode === 'fullscreen') {
    return <div className="loader-fullscreen">{content}</div>;
  }
  if (mode === 'overlay') {
    return <div className="loader-overlay">{content}</div>;
  }
  
  return content;
}
