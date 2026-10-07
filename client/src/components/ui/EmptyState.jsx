import React from 'react';
import '../../styles/components.css';

export default function EmptyState({ icon, title, description, actionLabel, onAction, className = '' }) {
  return (
    <div className={`empty-state ${className}`}>
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__description">{description}</p>}
      {actionLabel && onAction && (
        <button className="empty-state__action btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
