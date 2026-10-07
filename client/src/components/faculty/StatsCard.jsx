import React from 'react';
import './faculty-components.css';

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color = '#4F46E5', 
  trend, 
  detail 
}) {
  const isPositive = trend && trend.startsWith('+');
  
  return (
    <div className="stats-card">
      <div 
        className="stats-icon-wrapper" 
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        {Icon && <Icon size={24} />}
      </div>
      <div className="stats-content">
        <h4 className="stats-title">{title}</h4>
        <div className="stats-value">
          {value}
          {trend && (
            <span className={`stats-trend ${isPositive ? 'positive' : 'negative'}`}>
              {trend}
            </span>
          )}
        </div>
        {detail && <p className="stats-detail">{detail}</p>}
      </div>
    </div>
  );
}
