import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import './HODDashboard.css';
import { 
  LayoutDashboard, Users, BookOpen, Clock, BarChart3, 
  Settings, CheckCircle, XCircle, TrendingUp, ChevronRight, 
  FileText, Award, Calendar
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/hod' },
  { name: 'Faculty', icon: Users, path: '/hod/faculty' },
  { name: 'Students', icon: BookOpen, path: '/hod/students' },
  { name: 'Attendance', icon: Clock, path: '/hod/attendance' },
  { name: 'Reports', icon: BarChart3, path: '/hod/reports' },
  { name: 'Settings', icon: Settings, path: '/hod/settings' }
];

const facultyList = [
  { id: 1, name: 'Dr. Ramesh R', designation: 'Professor', subjects: 2, classes: 4, rating: 4.8 },
  { id: 2, name: 'Prof. Anita K', designation: 'Assoc. Professor', subjects: 3, classes: 5, rating: 4.6 },
  { id: 3, name: 'Dr. Vikram S', designation: 'Professor', subjects: 2, classes: 3, rating: 4.9 },
  { id: 4, name: 'Prof. Meera T', designation: 'Asst. Professor', subjects: 4, classes: 6, rating: 4.5 },
  { id: 5, name: 'Dr. Suresh M', designation: 'Assoc. Professor', subjects: 3, classes: 4, rating: 4.7 },
  { id: 6, name: 'Prof. Divya P', designation: 'Asst. Professor', subjects: 3, classes: 5, rating: 4.4 }
];

const topStudents = [
  { rank: 1, name: 'Rahul Sharma', usn: '1JT23CS045', cgpa: '9.8', branch: 'CSE' },
  { rank: 2, name: 'Sneha Patel', usn: '1JT23CS089', cgpa: '9.7', branch: 'CSE' },
  { rank: 3, name: 'Karthik N', usn: '1JT23CS032', cgpa: '9.6', branch: 'CSE' },
  { rank: 4, name: 'Priya Reddy', usn: '1JT23CS067', cgpa: '9.5', branch: 'CSE' },
  { rank: 5, name: 'Amit Kumar', usn: '1JT23CS012', cgpa: '9.4', branch: 'CSE' }
];

const leaveRequests = [
  { id: 1, name: 'Prof. Anita K', dates: '12 Aug - 14 Aug', type: 'Casual Leave' },
  { id: 2, name: 'Dr. Suresh M', dates: '18 Aug', type: 'Sick Leave' },
  { id: 3, name: 'Prof. Divya P', dates: '22 Aug - 23 Aug', type: 'OD Leave' }
];

export default function HODDashboard() {
  const greetingTime = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening';

  return (
    <DashboardLayout 
      portalLabel="HOD PORTAL" 
      navigation={navigation}
      userName="Dr. Kumar"
      userRole="HOD - CSE"
    >
      <div className="hod-dashboard">
        
        {/* Welcome Section */}
        <section className="hod-welcome">
          <div className="hod-welcome-content">
            <h1 className="hod-welcome-title">Good {greetingTime}, Dr. Kumar</h1>
            <p className="hod-welcome-subtitle">Here is what's happening in the CSE Department today.</p>
          </div>
          <div className="hod-welcome-badges">
            <span className="badge-primary">HOD - CSE</span>
            <span className="badge-secondary">Academic Year 2026-27</span>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="hod-stats-grid">
          <div className="hod-stat-card">
            <div className="hod-stat-header">
              <div className="hod-stat-icon bg-primary-light">
                <Users className="text-primary" size={24} />
              </div>
              <span className="hod-stat-trend positive">+12%</span>
            </div>
            <div className="hod-stat-value">486</div>
            <div className="hod-stat-label">Total Students (CSE)</div>
          </div>
          
          <div className="hod-stat-card">
            <div className="hod-stat-header">
              <div className="hod-stat-icon bg-secondary-light">
                <BookOpen className="text-secondary" size={24} />
              </div>
            </div>
            <div className="hod-stat-value">24</div>
            <div className="hod-stat-label">Faculty Members</div>
          </div>

          <div className="hod-stat-card">
            <div className="hod-stat-header">
              <div className="hod-stat-icon bg-warning-light">
                <Clock className="text-warning" size={24} />
              </div>
              <span className="hod-stat-trend negative">-2%</span>
            </div>
            <div className="hod-stat-value">84%</div>
            <div className="hod-stat-label">Avg Student Attendance</div>
          </div>

          <div className="hod-stat-card">
            <div className="hod-stat-header">
              <div className="hod-stat-icon bg-success-light">
                <TrendingUp className="text-success" size={24} />
              </div>
              <span className="hod-stat-trend positive">+4%</span>
            </div>
            <div className="hod-stat-value">92%</div>
            <div className="hod-stat-label">Department Pass Rate</div>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="hod-grid-container">
          {/* Left Column */}
          <div className="hod-col-left">
            
            {/* Faculty Overview */}
            <div className="hod-panel">
              <div className="hod-panel-header">
                <div>
                  <h2 className="hod-panel-title">Faculty Overview</h2>
                  <p className="hod-panel-desc">Performance and workload of department faculty</p>
                </div>
                <button className="hod-btn-outline">View All</button>
              </div>
              <div className="hod-faculty-list">
                {facultyList.map(faculty => (
                  <div key={faculty.id} className="hod-faculty-item">
                    <div className="hod-faculty-avatar">{faculty.name.charAt(faculty.name.indexOf('.') + 2)}</div>
                    <div className="hod-faculty-info">
                      <div className="hod-faculty-name">{faculty.name}</div>
                      <div className="hod-faculty-desig">{faculty.designation}</div>
                    </div>
                    <div className="hod-faculty-workload">
                      <div className="hod-workload-label">Subjects</div>
                      <div className="hod-workload-val">{faculty.subjects}</div>
                    </div>
                    <div className="hod-faculty-rating">
                      <div className="hod-rating-bar">
                        <div className="hod-rating-fill" style={{ width: `${(faculty.rating / 5) * 100}%` }}></div>
                      </div>
                      <div className="hod-rating-val">{faculty.rating}/5</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance Analytics */}
            <div className="hod-panel">
              <div className="hod-panel-header">
                <div>
                  <h2 className="hod-panel-title">Attendance Analytics</h2>
                  <p className="hod-panel-desc">Semester-wise attendance breakdown</p>
                </div>
              </div>
              <div className="hod-attendance-chart">
                {[
                  { sem: 'Sem 1', val: 88 },
                  { sem: 'Sem 2', val: 86 },
                  { sem: 'Sem 3', val: 74 },
                  { sem: 'Sem 4', val: 81 },
                  { sem: 'Sem 5', val: 89 },
                  { sem: 'Sem 6', val: 78 }
                ].map(item => (
                  <div key={item.sem} className="hod-att-row">
                    <div className="hod-att-sem">{item.sem}</div>
                    <div className="hod-att-bar-bg">
                      <div 
                        className={`hod-att-bar-fill ${item.val < 75 ? 'danger-fill' : 'primary-fill'}`} 
                        style={{ width: `${item.val}%` }}
                      ></div>
                    </div>
                    <div className={`hod-att-val ${item.val < 75 ? 'text-danger' : ''}`}>{item.val}%</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="hod-col-right">
            
            {/* Pending Approvals */}
            <div className="hod-panel">
              <div className="hod-panel-header">
                <h2 className="hod-panel-title">Pending Approvals</h2>
                <span className="badge-warning">5 Pending</span>
              </div>
              <div className="hod-approvals-list">
                <div className="hod-approval-group-title">Leave Requests</div>
                {leaveRequests.map(req => (
                  <div key={req.id} className="hod-approval-card">
                    <div className="hod-approval-info">
                      <div className="hod-approval-name">{req.name}</div>
                      <div className="hod-approval-meta">{req.type} • {req.dates}</div>
                    </div>
                    <div className="hod-approval-actions">
                      <button className="hod-btn-icon text-success"><CheckCircle size={20}/></button>
                      <button className="hod-btn-icon text-danger"><XCircle size={20}/></button>
                    </div>
                  </div>
                ))}
                
                <div className="hod-approval-group-title" style={{ marginTop: '16px' }}>Resource Approvals</div>
                <div className="hod-approval-card">
                  <div className="hod-approval-info">
                    <div className="hod-approval-name">Server Room Access</div>
                    <div className="hod-approval-meta">Requested by Prof. Ramesh • 24 Aug</div>
                  </div>
                  <div className="hod-approval-actions">
                    <button className="hod-btn-icon text-success"><CheckCircle size={20}/></button>
                    <button className="hod-btn-icon text-danger"><XCircle size={20}/></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Students */}
            <div className="hod-panel">
              <div className="hod-panel-header">
                <h2 className="hod-panel-title">Top Performers</h2>
                <Award className="text-warning" size={24} />
              </div>
              <div className="hod-students-list">
                {topStudents.map(student => (
                  <div key={student.rank} className="hod-student-item">
                    <div className="hod-student-rank">#{student.rank}</div>
                    <div className="hod-student-info">
                      <div className="hod-student-name">{student.name}</div>
                      <div className="hod-student-usn">{student.usn}</div>
                    </div>
                    <div className="hod-student-cgpa">{student.cgpa}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="hod-panel">
              <h2 className="hod-panel-title" style={{ marginBottom: '16px' }}>Quick Actions</h2>
              <div className="hod-quick-actions">
                <button className="hod-action-btn">
                  <FileText size={18} />
                  <span>Department Report</span>
                  <ChevronRight size={16} className="ml-auto" />
                </button>
                <button className="hod-action-btn">
                  <BarChart3 size={18} />
                  <span>Student Analytics</span>
                  <ChevronRight size={16} className="ml-auto" />
                </button>
                <button className="hod-action-btn">
                  <Calendar size={18} />
                  <span>Curriculum Review</span>
                  <ChevronRight size={16} className="ml-auto" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}