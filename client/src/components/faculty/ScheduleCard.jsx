import React from 'react';
import { Users, MapPin } from 'lucide-react';
import './faculty-components.css';

export default function ScheduleCard({ 
  time, 
  subject, 
  code, 
  section, 
  room, 
  status, 
  students 
}) {
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'live': return 'live';
      case 'upcoming': return 'upcoming';
      case 'completed': return 'completed';
      default: return '';
    }
  };

  return (
    <div className="schedule-card">
      <div className={`schedule-card-border ${getStatusClass(status)}`}></div>
      <div className="schedule-card-content">
        <div className="schedule-time">{time}</div>
        <div className="schedule-details">
          <h4 className="schedule-subject">{subject} ({code})</h4>
          <div className="schedule-meta">
            <span><Users size={14} /> {section} ({students})</span>
            <span><MapPin size={14} /> {room}</span>
          </div>
        </div>
        {status && (
          <div className={`class-status ${getStatusClass(status)}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
