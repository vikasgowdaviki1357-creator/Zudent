import React, { useState, useMemo } from 'react';
import { Save, CheckSquare, Square } from 'lucide-react';
import './FacultyAttendance.css';

const MOCK_CLASSES = [
  { id: 'c1', name: 'Data Structures', code: 'BCS304', section: 'CSE-A', students: 62 },
  { id: 'c2', name: 'Python Programming', code: 'BCSL205', section: 'CSE-B', students: 58 },
  { id: 'c3', name: 'Data Structures Lab', code: 'BCSL305', section: 'CSE-A', students: 31 }
];

const MOCK_STUDENTS = [
  { usn: '1JT22CS001', name: 'Aarav Sharma', attendance: 85 },
  { usn: '1JT22CS002', name: 'Aditi Gowda', attendance: 92 },
  { usn: '1JT22CS003', name: 'Arjun Reddy', attendance: 78 },
  { usn: '1JT22CS004', name: 'Bhavya N', attendance: 95 },
  { usn: '1JT22CS005', name: 'Chandan Kumar', attendance: 64 },
  { usn: '1JT22CS006', name: 'Darshan S', attendance: 88 },
  { usn: '1JT22CS007', name: 'Deepa M', attendance: 76 },
  { usn: '1JT22CS008', name: 'Gagan V', attendance: 91 },
  { usn: '1JT22CS009', name: 'Harshitha R', attendance: 82 },
  { usn: '1JT22CS010', name: 'Karthik P', attendance: 89 },
  { usn: '1JT22CS011', name: 'Kavya T', attendance: 94 },
  { usn: '1JT22CS012', name: 'Likhith B', attendance: 71 },
  { usn: '1JT22CS013', name: 'Manoj D', attendance: 86 },
  { usn: '1JT22CS014', name: 'Neha K', attendance: 97 },
  { usn: '1JT22CS015', name: 'Pooja V', attendance: 81 },
];

const MOCK_HISTORY = [
  { date: '2026-08-25', present: 58, absent: 4 },
  { date: '2026-08-23', present: 60, absent: 2 },
  { date: '2026-08-20', present: 55, absent: 7 },
  { date: '2026-08-18', present: 61, absent: 1 },
  { date: '2026-08-16', present: 59, absent: 3 },
];

export default function FacultyAttendance() {
  const [selectedClass, setSelectedClass] = useState(MOCK_CLASSES[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Set all present by default
  const [attendance, setAttendance] = useState(
    MOCK_STUDENTS.reduce((acc, s) => ({ ...acc, [s.usn]: true }), {})
  );

  const handleToggle = (usn) => {
    setAttendance(prev => ({ ...prev, [usn]: !prev[usn] }));
  };

  const handleSelectAll = (val) => {
    setAttendance(
      MOCK_STUDENTS.reduce((acc, s) => ({ ...acc, [s.usn]: val }), {})
    );
  };

  const handleSave = () => {
    alert(`Attendance saved for ${date}!`);
  };

  const stats = useMemo(() => {
    const present = Object.values(attendance).filter(Boolean).length;
    const total = MOCK_STUDENTS.length;
    return {
      present,
      absent: total - present,
      percentage: Math.round((present / total) * 100)
    };
  }, [attendance]);

  const getAttendanceBadgeClass = (val) => {
    if (val >= 85) return 'good';
    if (val >= 75) return 'warning';
    return 'danger';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <span className="eyebrow">Faculty Portal</span>
        <h1 className="page-title">Attendance Management</h1>
        <p className="page-desc">Mark and track daily student attendance for your classes.</p>
      </div>

      <div className="attendance-controls">
        <div className="control-card">
          <label className="control-label">Select Class</label>
          <select 
            className="custom-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {MOCK_CLASSES.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code}) - {c.section}
              </option>
            ))}
          </select>
        </div>
        <div className="control-card">
          <label className="control-label">Date</label>
          <input 
            type="date" 
            className="custom-date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="action-bar">
        <div className="action-bar-stats">
          <span className="stat-present">Present: {stats.present}</span>
          <span className="stat-absent">Absent: {stats.absent}</span>
          <span className="stat-total">Total: {stats.percentage}%</span>
        </div>
        <div className="action-bar-btns">
          <button className="btn btn-outline" onClick={() => handleSelectAll(true)}>
            <CheckSquare size={16} /> Mark All
          </button>
          <button className="btn btn-outline" onClick={() => handleSelectAll(false)}>
            <Square size={16} /> Clear All
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} /> Submit
          </button>
        </div>
      </div>

      <div className="student-list-container">
        <table className="student-table">
          <thead>
            <tr>
              <th width="60">Status</th>
              <th width="150">USN</th>
              <th>Student Name</th>
              <th width="120">Overall %</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_STUDENTS.map(student => (
              <tr key={student.usn}>
                <td>
                  <input 
                    type="checkbox" 
                    className="custom-checkbox"
                    checked={attendance[student.usn] || false}
                    onChange={() => handleToggle(student.usn)}
                  />
                </td>
                <td style={{ fontWeight: 600, color: 'var(--text-light)' }}>{student.usn}</td>
                <td>
                  <div className="student-name-cell">
                    <div className="student-avatar">{student.name.charAt(0)}</div>
                    <span style={{ fontWeight: 500 }}>{student.name}</span>
                  </div>
                </td>
                <td>
                  <span className={`attendance-badge ${getAttendanceBadgeClass(student.attendance)}`}>
                    {student.attendance}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="history-section">
        <h3 className="history-title">Recent Attendance History</h3>
        <div className="history-list">
          {MOCK_HISTORY.map((record, i) => (
            <div key={i} className="history-item">
              <span className="history-date">
                {new Date(record.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
              </span>
              <span className="history-stats">
                <span style={{color: 'var(--success)'}}>{record.present} Present</span> •{' '}
                <span style={{color: 'var(--danger)'}}>{record.absent} Absent</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
