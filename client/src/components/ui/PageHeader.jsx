import React from 'react';
import '../../styles/components.css';

export default function PageHeader({ eyebrow, title, subtitle, actions, className = '' }) {
  return (
    <header className={`page-header ${className}`}>
      <div className="page-header__content">
        {eyebrow && <span className="page-header__eyebrow">{eyebrow}</span>}
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}
