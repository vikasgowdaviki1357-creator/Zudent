import React from 'react';
import './faculty-components.css';

export default function ActivityCard({ title, description, time, icon: Icon, color = '#4F46E5' }) {
  return (
    <div className="activity-card">
      <div 
        className="activity-icon-wrapper" 
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        {Icon && <Icon size={24} />}
      </div>
      <div className="activity-content">
        <h4 className="activity-title">{title}</h4>
        <p className="activity-desc">{description}</p>
        <span className="activity-time">{time}</span>
      </div>
    </div>
  );
}
