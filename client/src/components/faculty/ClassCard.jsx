import React from 'react';
import { Users, MapPin, Clock, FileText, CheckSquare, Award, BookOpen } from 'lucide-react';
import './faculty-components.css';

export default function ClassCard({ 
  subject, 
  code, 
  section, 
  semester, 
  students, 
  room, 
  time, 
  attendance, 
  status, 
  onAttendance, 
  onAssignments,
  onMarks,
  onResources
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
    <div className="class-card">
      <div className="class-card-header">
        <div>
          <span className="class-code-badge">{code}</span>
          <h3 className="class-card-title">{subject}</h3>
        </div>
        {status && (
          <span className={`class-status ${getStatusClass(status)}`}>
            {status}
          </span>
        )}
      </div>

      <div className="class-info-grid">
        <div className="class-info-item">
          <Users size={16} className="class-info-icon" />
          <span>{section} • Sem {semester} ({students} Students)</span>
        </div>
        <div className="class-info-item">
          <MapPin size={16} className="class-info-icon" />
          <span>Room {room}</span>
        </div>
        <div className="class-info-item">
          <Clock size={16} className="class-info-icon" />
          <span>{time}</span>
        </div>
      </div>

      <div className="class-attendance-bar">
        <div className="class-attendance-bar-header">
          <span>Avg. Attendance</span>
          <span style={{ color: attendance >= 75 ? '#10B981' : '#F59E0B' }}>
            {attendance}%
          </span>
        </div>
        <div className="class-attendance-bar-track">
          <div 
            className="class-attendance-bar-fill" 
            style={{ 
              width: `${attendance}%`,
              backgroundColor: attendance >= 75 ? 'var(--success)' : 'var(--warning)'
            }} 
          />
        </div>
      </div>

      <div className="class-card-actions">
        <button className="btn-class-action primary" onClick={onAttendance}>
          <CheckSquare size={16} /> Attendance
        </button>
        <button className="btn-class-action" onClick={onAssignments}>
          <FileText size={16} /> Assignments
        </button>
        <button className="btn-class-action" onClick={onMarks}>
          <Award size={16} /> Marks
        </button>
        <button className="btn-class-action" onClick={onResources}>
          <BookOpen size={16} /> Resources
        </button>
      </div>
    </div>
  );
}
