import React from 'react';
import '../../styles/components.css';

export default function Badge({ variant = 'neutral', size = 'md', children, dot = false, className = '' }) {
  return (
    <span className={`badge badge--${variant} badge--${size} ${className}`}>
      {dot && <span className="badge__dot"></span>}
      {children}
    </span>
  );
}
