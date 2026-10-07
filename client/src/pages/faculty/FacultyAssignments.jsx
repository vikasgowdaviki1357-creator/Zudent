import React, { useState } from 'react';
import { Plus, Eye, Edit2, Trash2, X, FileUp } from 'lucide-react';
import './FacultyAssignments.css';

const MOCK_ASSIGNMENTS = [
  { id: 1, title: 'Stack & Queue Implementation', subject: 'Data Structures', class: 'CSE-A', due: '2026-09-01', status: 'Active', submitted: 45, total: 62 },
  { id: 2, title: 'Python Web Scraper', subject: 'Python Programming', class: 'CSE-B', due: '2026-08-30', status: 'Active', submitted: 50, total: 58 },
  { id: 3, title: 'Array Operations Lab', subject: 'DS Lab', class: 'CSE-A', due: '2026-08-20', status: 'Closed', submitted: 31, total: 31 },
  { id: 4, title: 'Binary Tree Traversal', subject: 'Data Structures', class: 'CSE-A', due: '2026-09-10', status: 'Draft', submitted: 0, total: 62 },
  { id: 5, title: 'Data Analysis with Pandas', subject: 'Python Programming', class: 'CSE-B', due: '2026-09-15', status: 'Active', submitted: 12, total: 58 },
];

const MOCK_SUBMISSIONS = [
  { usn: '1JT22CS001', name: 'Aarav Sharma', date: '2026-08-28', status: 'Submitted', grade: '9/10' },
  { usn: '1JT22CS002', name: 'Aditi Gowda', date: '2026-08-29', status: 'Submitted', grade: '10/10' },
  { usn: '1JT22CS003', name: 'Arjun Reddy', date: '2026-09-02', status: 'Late', grade: '7/10' },
  { usn: '1JT22CS004', name: 'Bhavya N', date: '-', status: 'Not Submitted', grade: '-' },
  { usn: '1JT22CS005', name: 'Chandan Kumar', date: '2026-08-30', status: 'Submitted', grade: '' },
];

export default function FacultyAssignments() {
  const [activeTab, setActiveTab] = useState('all');
  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleCreate = (e) => {
    e.preventDefault();
    const newAssignment = {
      id: Date.now(),
      title: e.target.title.value,
      subject: e.target.subject.value,
      class: e.target.class.value,
      due: e.target.due.value,
      status: 'Active',
      submitted: 0,
      total: 60
    };
    setAssignments([newAssignment, ...assignments]);
    setActiveTab('all');
    alert('Assignment created successfully!');
  };

  const deleteAssignment = (id) => {
    if(window.confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(assignments.filter(a => a.id !== id));
    }
  };

  return (
    <div className="assignments-page">
      <div className="page-header">
        <span className="eyebrow">Faculty Portal</span>
        <h1 className="page-title">Assignments</h1>
        <p className="page-desc">Create, manage, and grade student assignments.</p>
      </div>

      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Assignments
        </button>
        <button 
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create New
        </button>
      </div>

      {activeTab === 'all' && (
        <>
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-box-value">{assignments.length}</div>
              <div className="stat-box-label">Total Assignments</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-value" style={{color: '#10B981'}}>
                {assignments.filter(a => a.status === 'Active').length}
              </div>
              <div className="stat-box-label">Active</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-value" style={{color: '#F59E0B'}}>
                {assignments.reduce((acc, curr) => acc + curr.submitted, 0)}
              </div>
              <div className="stat-box-label">Total Submissions</div>
            </div>
          </div>

          <div className="assignments-grid">
            {assignments.map(assignment => (
              <div key={assignment.id} className="assignment-card">
                <div className="assignment-header">
                  <div>
                    <h3 className="assignment-title">{assignment.title}</h3>
                    <div className="assignment-meta">
                      {assignment.subject} • {assignment.class}
                    </div>
                  </div>
                  <span className={`assignment-status ${assignment.status.toLowerCase()}`}>
                    {assignment.status}
                  </span>
                </div>

                <div className="assignment-progress">
                  <div className="progress-text">
                    <span>Submissions</span>
                    <span>{assignment.submitted} / {assignment.total}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${(assignment.submitted / assignment.total) * 100}%`}}
                    />
                  </div>
                  <div className="assignment-meta" style={{marginTop: '8px'}}>
                    Due: {new Date(assignment.due).toLocaleDateString()}
                  </div>
                </div>

                <div className="assignment-actions">
                  <button className="btn btn-outline" onClick={() => setSelectedAssignment(assignment)}>
                    <Eye size={16} /> View
                  </button>
                  <button className="btn btn-outline">
                    <Edit2 size={16} /> Edit
                  </button>
                  <button className="btn btn-outline" style={{flex: 0.3, color: '#EF4444', borderColor: '#FCA5A5'}} onClick={() => deleteAssignment(assignment.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'create' && (
        <div className="form-container">
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label">Assignment Title</label>
              <input type="text" name="title" className="form-input" required placeholder="e.g. Binary Search Tree Implementation" />
            </div>
            
            <div style={{display: 'flex', gap: '16px'}}>
              <div className="form-group" style={{flex: 1}}>
                <label className="form-label">Subject</label>
                <select name="subject" className="form-select" required>
                  <option value="Data Structures">Data Structures</option>
                  <option value="Python Programming">Python Programming</option>
                  <option value="DS Lab">DS Lab</option>
                </select>
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label className="form-label">Class / Section</label>
                <select name="class" className="form-select" required>
                  <option value="CSE-A">CSE-A</option>
                  <option value="CSE-B">CSE-B</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-textarea" placeholder="Detailed instructions for the assignment..."></textarea>
            </div>

            <div style={{display: 'flex', gap: '16px'}}>
              <div className="form-group" style={{flex: 1}}>
                <label className="form-label">Due Date</label>
                <input type="date" name="due" className="form-input" required />
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label className="form-label">Max Marks</label>
                <input type="number" name="marks" className="form-input" defaultValue="10" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Attachment (Optional)</label>
              <div className="form-input" style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', cursor: 'pointer', justifyContent: 'center', padding: '24px', borderStyle: 'dashed'}}>
                <FileUp size={20} /> Click to upload reference file
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{width: '100%', padding: '14px', fontSize: '16px'}}>
              <Plus size={20} /> Create Assignment
            </button>
          </form>
        </div>
      )}

      {selectedAssignment && (
        <div className="modal-overlay" onClick={() => setSelectedAssignment(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedAssignment.title} - Submissions</h2>
              <button className="modal-close" onClick={() => setSelectedAssignment(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <table className="student-table" style={{width: '100%'}}>
                <thead>
                  <tr>
                    <th>USN</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_SUBMISSIONS.map(sub => (
                    <tr key={sub.usn}>
                      <td style={{fontWeight: 600}}>{sub.usn}</td>
                      <td>{sub.name}</td>
                      <td>{sub.date}</td>
                      <td>
                        <span className={`attendance-badge ${sub.status === 'Submitted' ? 'good' : sub.status === 'Late' ? 'warning' : 'danger'}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="grade-input" 
                          defaultValue={sub.grade} 
                          placeholder="/10"
                          disabled={sub.status === 'Not Submitted'}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
