import React from 'react';
import '../../styles/components.css';

export default function FloatingButton({ icon, onClick, tooltip, variant = 'primary', className = '' }) {
  return (
    <div className={`floating-button-container ${className}`}>
      <button 
        className={`floating-button floating-button--${variant}`} 
        onClick={onClick}
        aria-label={tooltip}
      >
        {icon}
      </button>
      {tooltip && <span className="floating-button__tooltip">{tooltip}</span>}
    </div>
  );
}
