import React, { useMemo, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  Megaphone,
  ShieldCheck,
  Bell,
  BarChart3,
  GraduationCap,
  UserRound,
  CalendarDays,
  Download,
  TrendingUp,
  Activity,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import "./ReportsAnalytics.css";

const navigation = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    name: "User Management",
    icon: Users,
    path: "/admin/users",
  },
  {
    name: "Departments",
    icon: Building2,
    path: "/admin/departments",
  },
  {
    name: "System Settings",
    icon: Settings,
    path: "/admin/settings",
  },
  {
    name: "Announcements",
    icon: Megaphone,
    path: "/admin/announcements",
  },
  {
    name: "Security Logs",
    icon: ShieldCheck,
    path: "/admin/security",
  },
  {
    name: "Notifications",
    icon: Bell,
    path: "/admin/notifications",
  },
  {
    name: "Reports & Analytics",
    icon: BarChart3,
    path: "/admin/reports",
  },
];

const departmentData = [
  {
    name: "Computer Science & Engineering",
    students: 642,
    faculty: 32,
    percentage: 78,
  },
  {
    name: "Information Science",
    students: 418,
    faculty: 24,
    percentage: 63,
  },
  {
    name: "Electronics & Communication",
    students: 386,
    faculty: 21,
    percentage: 58,
  },
  {
    name: "Mechanical Engineering",
    students: 294,
    faculty: 18,
    percentage: 45,
  },
  {
    name: "Civil Engineering",
    students: 218,
    faculty: 15,
    percentage: 34,
  },
];

const activityData = [
  { day: "Mon", value: 72 },
  { day: "Tue", value: 84 },
  { day: "Wed", value: 67 },
  { day: "Thu", value: 91 },
  { day: "Fri", value: 78 },
  { day: "Sat", value: 52 },
  { day: "Sun", value: 36 },
];

function ReportsAnalytics() {
  const [period, setPeriod] = useState("This Week");
  const [department, setDepartment] = useState("All Departments");

  const filteredDepartments = useMemo(() => {
    if (department === "All Departments") {
      return departmentData;
    }

    return departmentData.filter(
      (item) => item.name === department
    );
  }, [department]);

  const handleExport = () => {
    const report = {
      generatedAt: new Date().toLocaleString(),
      period,
      department,
      totalStudents: 1958,
      totalFaculty: 110,
      activeUsers: 1642,
      departments: filteredDepartments,
    };

    const blob = new Blob(
      [JSON.stringify(report, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "jit-super-app-report.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout
      portalLabel="ADMIN PORTAL"
      navigation={navigation}
      userName="System Admin"
      userRole="Super Administrator"
    >
      <div className="reports-page">

        {/* Header */}
        <div className="reports-header">

          <div>
            <p className="reports-eyebrow">
              ADMIN PORTAL
            </p>

            <h1>Reports & Analytics</h1>

            <p>
              Monitor platform usage, students, faculty and
              department performance.
            </p>
          </div>

          <button
            className="reports-export-btn"
            onClick={handleExport}
          >
            <Download size={17} />
            Export Report
          </button>

        </div>

        {/* Filters */}
        <div className="reports-filters">

          <div className="reports-filter-group">
            <label>Time Period</label>

            <select
              value={period}
              onChange={(event) =>
                setPeriod(event.target.value)
              }
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>This Semester</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="reports-filter-group">
            <label>Department</label>

            <select
              value={department}
              onChange={(event) =>
                setDepartment(event.target.value)
              }
            >
              <option>All Departments</option>

              {departmentData.map((item) => (
                <option
                  key={item.name}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Overview Cards */}
        <div className="reports-stat-grid">

          <div className="reports-stat-card">

            <div className="reports-stat-icon blue">
              <GraduationCap size={22} />
            </div>

            <div className="reports-stat-content">
              <span>Total Students</span>

              <strong>1,958</strong>

              <small className="positive">
                <TrendingUp size={13} />
                8.4% from last period
              </small>
            </div>

          </div>

          <div className="reports-stat-card">

            <div className="reports-stat-icon purple">
              <UserRound size={22} />
            </div>

            <div className="reports-stat-content">
              <span>Total Faculty</span>

              <strong>110</strong>

              <small className="positive">
                <TrendingUp size={13} />
                4.2% from last period
              </small>
            </div>

          </div>

          <div className="reports-stat-card">

            <div className="reports-stat-icon green">
              <Activity size={22} />
            </div>

            <div className="reports-stat-content">
              <span>Active Users</span>

              <strong>1,642</strong>

              <small className="positive">
                <TrendingUp size={13} />
                12.6% from last period
              </small>
            </div>

          </div>

          <div className="reports-stat-card">

            <div className="reports-stat-icon orange">
              <CalendarDays size={22} />
            </div>

            <div className="reports-stat-content">
              <span>Events This Month</span>

              <strong>24</strong>

              <small className="positive">
                <TrendingUp size={13} />
                16.7% from last month
              </small>
            </div>

          </div>

        </div>

        {/* Main Analytics */}
        <div className="reports-main-grid">

          {/* Activity Chart */}
          <section className="reports-card activity-card">

            <div className="reports-card-header">

              <div>
                <h2>Platform Activity</h2>
                <p>
                  User activity during the selected period
                </p>
              </div>

              <BarChart3 size={20} />

            </div>

            <div className="activity-chart">

              <div className="chart-y-axis">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>

              <div className="chart-area">

                <div className="chart-grid-line line-1" />
                <div className="chart-grid-line line-2" />
                <div className="chart-grid-line line-3" />
                <div className="chart-grid-line line-4" />

                <div className="chart-bars">

                  {activityData.map((item) => (
                    <div
                      className="chart-column"
                      key={item.day}
                    >
                      <div
                        className="chart-bar"
                        style={{
                          height: `${item.value}%`,
                        }}
                        title={`${item.value}% activity`}
                      />

                      <span>{item.day}</span>
                    </div>
                  ))}

                </div>

              </div>

            </div>

          </section>

          {/* User Distribution */}
          <section className="reports-card">

            <div className="reports-card-header">

              <div>
                <h2>User Distribution</h2>
                <p>
                  Platform users by account type
                </p>
              </div>

              <Users size={20} />

            </div>

            <div className="user-distribution">

              <div className="distribution-circle">
                <div>
                  <strong>2,076</strong>
                  <span>Total</span>
                </div>
              </div>

              <div className="distribution-list">

                <div>
                  <span>
                    <i className="dot student" />
                    Students
                  </span>

                  <strong>1,958</strong>
                </div>

                <div>
                  <span>
                    <i className="dot faculty" />
                    Faculty
                  </span>

                  <strong>110</strong>
                </div>

                <div>
                  <span>
                    <i className="dot admin" />
                    Administrators
                  </span>

                  <strong>8</strong>
                </div>

              </div>

            </div>

          </section>

        </div>

        {/* Department Analytics */}
        <section className="reports-card department-card">

          <div className="reports-card-header">

            <div>
              <h2>Department Overview</h2>
              <p>
                Student and faculty distribution across
                departments
              </p>
            </div>

            <Building2 size={20} />

          </div>

          <div className="department-table">

            <div className="department-table-head">
              <span>Department</span>
              <span>Students</span>
              <span>Faculty</span>
              <span>Student Share</span>
            </div>

            {filteredDepartments.map((item) => (
              <div
                className="department-table-row"
                key={item.name}
              >
                <div className="department-name">
                  <div className="department-icon">
                    <Building2 size={16} />
                  </div>

                  <span>{item.name}</span>
                </div>

                <strong>{item.students}</strong>

                <span>{item.faculty}</span>

                <div className="share-wrapper">

                  <div className="share-bar">
                    <span
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  </div>

                  <small>
                    {item.percentage}%
                  </small>

                </div>

              </div>
            ))}

          </div>

        </section>

        {/* Bottom Cards */}
        <div className="reports-bottom-grid">

          <section className="reports-card performance-card">

            <div className="reports-card-header">

              <div>
                <h2>Academic Performance</h2>
                <p>
                  Overall student performance overview
                </p>
              </div>

              <GraduationCap size={20} />

            </div>

            <div className="performance-content">

              <div className="performance-score">
                <strong>8.42</strong>
                <span>Average CGPA</span>
              </div>

              <div className="performance-details">

                <div>
                  <span>Pass Rate</span>
                  <strong>94.6%</strong>
                </div>

                <div>
                  <span>Attendance</span>
                  <strong>87.3%</strong>
                </div>

                <div>
                  <span>Active Students</span>
                  <strong>91.8%</strong>
                </div>

              </div>

            </div>

          </section>

          <section className="reports-card events-card">

            <div className="reports-card-header">

              <div>
                <h2>Event Participation</h2>
                <p>
                  Student participation statistics
                </p>
              </div>

              <CalendarDays size={20} />

            </div>

            <div className="event-stat">

              <strong>1,284</strong>

              <span>
                Total event registrations
              </span>

            </div>

            <div className="event-progress">

              <div>
                <span>Participation Rate</span>
                <strong>65.6%</strong>
              </div>

              <div className="event-progress-bar">
                <span />
              </div>

            </div>

          </section>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default ReportsAnalytics;