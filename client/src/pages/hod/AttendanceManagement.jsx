import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Users,
  TrendingUp,
  AlertTriangle,
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import "./AttendanceManagement.css";

const attendanceData = [
  {
    id: 1,
    name: "Rahul Sharma",
    usn: "1JT23CS045",
    semester: "5",
    branch: "CSE",
    attendance: 92,
    classes: 78,
    present: 72,
  },
  {
    id: 2,
    name: "Sneha Patel",
    usn: "1JT23CS089",
    semester: "5",
    branch: "CSE",
    attendance: 88,
    classes: 80,
    present: 70,
  },
  {
    id: 3,
    name: "Karthik N",
    usn: "1JT23CS032",
    semester: "5",
    branch: "CSE",
    attendance: 76,
    classes: 75,
    present: 57,
  },
  {
    id: 4,
    name: "Priya Reddy",
    usn: "1JT23CS067",
    semester: "5",
    branch: "CSE",
    attendance: 68,
    classes: 79,
    present: 54,
  },
  {
    id: 5,
    name: "Amit Kumar",
    usn: "1JT23CS012",
    semester: "5",
    branch: "CSE",
    attendance: 95,
    classes: 82,
    present: 78,
  },
  {
    id: 6,
    name: "Ananya Rao",
    usn: "1JT23CS104",
    semester: "5",
    branch: "CSE",
    attendance: 73,
    classes: 76,
    present: 55,
  },
];

function AttendanceManagement() {
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredStudents = useMemo(() => {
    return attendanceData.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.usn.toLowerCase().includes(search.toLowerCase());

      const matchesSemester =
        semester === "All" || student.semester === semester;

      const matchesStatus =
        status === "All" ||
        (status === "Good" && student.attendance >= 85) ||
        (status === "Warning" &&
          student.attendance >= 75 &&
          student.attendance < 85) ||
        (status === "Critical" && student.attendance < 75);

      return matchesSearch && matchesSemester && matchesStatus;
    });
  }, [search, semester, status]);

  const averageAttendance =
    attendanceData.reduce((sum, student) => sum + student.attendance, 0) /
    attendanceData.length;

  const goodStudents = attendanceData.filter(
    (student) => student.attendance >= 85
  ).length;

  const criticalStudents = attendanceData.filter(
    (student) => student.attendance < 75
  ).length;

  const getStatus = (attendance) => {
    if (attendance >= 85) return "Good";
    if (attendance >= 75) return "Warning";
    return "Critical";
  };

  return (
    <div className="attendance-management">
      <div className="attendance-header">
        <div>
          <p className="attendance-eyebrow">HOD PORTAL</p>
          <h1>Attendance Management</h1>
          <p>
            Monitor department attendance and identify students who need
            attention.
          </p>
        </div>

        <button className="attendance-date-btn">
          <CalendarDays size={18} />
          Academic Year 2026-27
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="attendance-stats">
        <div className="attendance-stat-card">
          <div className="attendance-stat-icon">
            <Users size={22} />
          </div>
          <div>
            <span>Total Students</span>
            <strong>{attendanceData.length}</strong>
          </div>
        </div>

        <div className="attendance-stat-card">
          <div className="attendance-stat-icon">
            <TrendingUp size={22} />
          </div>
          <div>
            <span>Average Attendance</span>
            <strong>{averageAttendance.toFixed(1)}%</strong>
          </div>
        </div>

        <div className="attendance-stat-card">
          <div className="attendance-stat-icon">
            <Users size={22} />
          </div>
          <div>
            <span>Good Attendance</span>
            <strong>{goodStudents}</strong>
          </div>
        </div>

        <div className="attendance-stat-card critical">
          <div className="attendance-stat-icon">
            <AlertTriangle size={22} />
          </div>
          <div>
            <span>Critical</span>
            <strong>{criticalStudents}</strong>
          </div>
        </div>
      </div>

      <div className="attendance-panel">
        <div className="attendance-toolbar">
          <div className="attendance-search">
            <Search size={19} />
            <input
              type="text"
              placeholder="Search student or USN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="attendance-filter">
            <Filter size={17} />

            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="All">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>
          </div>

          <div className="attendance-filter">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Good">Good ≥ 85%</option>
              <option value="Warning">Warning 75–84%</option>
              <option value="Critical">Critical &lt; 75%</option>
            </select>
          </div>
        </div>

        <div className="attendance-table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>USN</th>
                <th>Semester</th>
                <th>Classes</th>
                <th>Present</th>
                <th>Attendance</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => {
                const studentStatus = getStatus(student.attendance);

                return (
                  <tr key={student.id}>
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar">
                          {student.name.charAt(0)}
                        </div>

                        <div>
                          <strong>{student.name}</strong>
                          <span>{student.branch}</span>
                        </div>
                      </div>
                    </td>

                    <td>{student.usn}</td>

                    <td>Sem {student.semester}</td>

                    <td>{student.classes}</td>

                    <td>{student.present}</td>

                    <td>
                      <div className="attendance-progress">
                        <div className="progress-track">
                          <div
                            className={`progress-fill ${studentStatus.toLowerCase()}`}
                            style={{
                              width: `${student.attendance}%`,
                            }}
                          />
                        </div>

                        <strong>{student.attendance}%</strong>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`attendance-status ${studentStatus.toLowerCase()}`}
                      >
                        {studentStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="attendance-empty">
              No students found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceManagement;