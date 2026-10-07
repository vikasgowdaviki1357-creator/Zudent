import { useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Download,
  Filter,
  GraduationCap,
  BookOpen,
  CalendarDays,
} from "lucide-react";
import "./Reports.css";

const semesterData = [
  { semester: "Sem 1", students: 82, pass: 94, attendance: 88, cgpa: 8.2 },
  { semester: "Sem 2", students: 79, pass: 92, attendance: 86, cgpa: 8.4 },
  { semester: "Sem 3", students: 76, pass: 89, attendance: 81, cgpa: 8.1 },
  { semester: "Sem 4", students: 74, pass: 93, attendance: 84, cgpa: 8.6 },
  { semester: "Sem 5", students: 91, pass: 96, attendance: 89, cgpa: 8.9 },
  { semester: "Sem 6", students: 84, pass: 91, attendance: 82, cgpa: 8.5 },
];

const subjectData = [
  { subject: "Data Structures", code: "CS501", pass: 94, average: 78 },
  { subject: "Database Management", code: "CS502", pass: 91, average: 75 },
  { subject: "Computer Networks", code: "CS503", pass: 87, average: 71 },
  { subject: "Operating Systems", code: "CS504", pass: 89, average: 73 },
  { subject: "Software Engineering", code: "CS505", pass: 96, average: 81 },
];

const topStudents = [
  { name: "Rahul Sharma", usn: "1JT23CS045", cgpa: 9.8 },
  { name: "Sneha Patel", usn: "1JT23CS089", cgpa: 9.7 },
  { name: "Karthik N", usn: "1JT23CS032", cgpa: 9.6 },
  { name: "Priya Reddy", usn: "1JT23CS067", cgpa: 9.5 },
];

function Reports() {
  const [semester, setSemester] = useState("All");
  const [year, setYear] = useState("2026-27");

  const selectedSemester = useMemo(() => {
    if (semester === "All") return semesterData;
    return semesterData.filter((item) => item.semester === semester);
  }, [semester]);

  const averagePass =
    selectedSemester.reduce((sum, item) => sum + item.pass, 0) /
    selectedSemester.length;

  const averageAttendance =
    selectedSemester.reduce((sum, item) => sum + item.attendance, 0) /
    selectedSemester.length;

  const averageCgpa =
    selectedSemester.reduce((sum, item) => sum + item.cgpa, 0) /
    selectedSemester.length;

  const totalStudents = selectedSemester.reduce(
    (sum, item) => sum + item.students,
    0
  );

  return (
    <div className="hod-reports">
      <div className="reports-header">
        <div>
          <p className="reports-eyebrow">HOD PORTAL</p>
          <h1>Reports & Analytics</h1>
          <p>
            Monitor academic performance and department-level statistics.
          </p>
        </div>

        <button className="reports-download">
          <Download size={18} />
          Generate Report
        </button>
      </div>

      <div className="reports-filters">
        <div className="reports-filter">
          <CalendarDays size={17} />
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="2026-27">Academic Year 2026-27</option>
            <option value="2025-26">Academic Year 2025-26</option>
            <option value="2024-25">Academic Year 2024-25</option>
          </select>
        </div>

        <div className="reports-filter">
          <Filter size={17} />
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="All">All Semesters</option>
            {semesterData.map((item) => (
              <option key={item.semester} value={item.semester}>
                {item.semester}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="reports-stats">
        <div className="report-stat">
          <div className="report-stat-icon blue">
            <Users size={22} />
          </div>
          <div>
            <span>Total Students</span>
            <strong>{totalStudents}</strong>
          </div>
        </div>

        <div className="report-stat">
          <div className="report-stat-icon green">
            <TrendingUp size={22} />
          </div>
          <div>
            <span>Average Pass Rate</span>
            <strong>{averagePass.toFixed(1)}%</strong>
          </div>
        </div>

        <div className="report-stat">
          <div className="report-stat-icon orange">
            <BarChart3 size={22} />
          </div>
          <div>
            <span>Average Attendance</span>
            <strong>{averageAttendance.toFixed(1)}%</strong>
          </div>
        </div>

        <div className="report-stat">
          <div className="report-stat-icon purple">
            <GraduationCap size={22} />
          </div>
          <div>
            <span>Average CGPA</span>
            <strong>{averageCgpa.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <div className="reports-grid">
        <section className="report-panel performance-panel">
          <div className="report-panel-header">
            <div>
              <h2>Semester Performance</h2>
              <p>Pass rate and attendance comparison</p>
            </div>
            <BarChart3 size={22} />
          </div>

          <div className="semester-chart">
            {selectedSemester.map((item) => (
              <div className="semester-row" key={item.semester}>
                <span className="semester-name">{item.semester}</span>

                <div className="semester-bars">
                  <div className="chart-line">
                    <span>Pass</span>
                    <div className="chart-track">
                      <div
                        className="chart-fill pass"
                        style={{ width: `${item.pass}%` }}
                      />
                    </div>
                    <strong>{item.pass}%</strong>
                  </div>

                  <div className="chart-line">
                    <span>Attendance</span>
                    <div className="chart-track">
                      <div
                        className="chart-fill attendance"
                        style={{ width: `${item.attendance}%` }}
                      />
                    </div>
                    <strong>{item.attendance}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="report-panel">
          <div className="report-panel-header">
            <div>
              <h2>Top Performers</h2>
              <p>Highest CGPA in the department</p>
            </div>
            <Award size={22} />
          </div>

          <div className="top-performers">
            {topStudents.map((student, index) => (
              <div className="performer" key={student.usn}>
                <div className="performer-rank">#{index + 1}</div>

                <div className="performer-avatar">
                  {student.name.charAt(0)}
                </div>

                <div className="performer-info">
                  <strong>{student.name}</strong>
                  <span>{student.usn}</span>
                </div>

                <strong className="performer-cgpa">
                  {student.cgpa}
                </strong>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="report-panel subject-panel">
        <div className="report-panel-header">
          <div>
            <h2>Subject Performance</h2>
            <p>Department subject-wise academic performance</p>
          </div>
          <BookOpen size={22} />
        </div>

        <div className="subject-table-wrapper">
          <table className="subject-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Code</th>
                <th>Pass Rate</th>
                <th>Average Score</th>
                <th>Performance</th>
              </tr>
            </thead>

            <tbody>
              {subjectData.map((subject) => (
                <tr key={subject.code}>
                  <td>
                    <strong>{subject.subject}</strong>
                  </td>
                  <td>{subject.code}</td>
                  <td>{subject.pass}%</td>
                  <td>{subject.average}%</td>
                  <td>
                    <span
                      className={`performance-badge ${
                        subject.pass >= 90 ? "excellent" : "good"
                      }`}
                    >
                      {subject.pass >= 90 ? "Excellent" : "Good"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Reports;