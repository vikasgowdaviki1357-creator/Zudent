import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Users,
  UserCheck,
  UserRoundX,
  BookOpen,
  Eye,
  GraduationCap,
} from "lucide-react";
import "./FacultyManagement.css";
import FacultyProfileModal from "./FacultyProfileModal.jsx";
import "./FacultyProfileModal.css";

function FacultyManagement() {
    const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState("All Status");

  // Temporary frontend data.
  // We will replace this with backend data later.
  const faculty = [
    {
      id: 1,
      name: "Dr. Anil Kumar",
      initials: "AK",
      role: "Professor",
      department: "CSE",
      status: "Active",
      subjects: ["Data Structures", "Algorithms"],
      classes: 4,
      students: 186,
    },
    {
      id: 2,
      name: "Prof. Priya Sharma",
      initials: "PS",
      role: "Assistant Professor",
      department: "CSE",
      status: "Active",
      subjects: ["Python", "Machine Learning"],
      classes: 3,
      students: 142,
    },
    {
      id: 3,
      name: "Dr. Rajesh Kumar",
      initials: "RK",
      role: "Associate Professor",
      department: "ISE",
      status: "Active",
      subjects: ["DBMS", "Web Technology"],
      classes: 4,
      students: 178,
    },
    {
      id: 4,
      name: "Prof. Sneha Rao",
      initials: "SR",
      role: "Assistant Professor",
      department: "ECE",
      status: "On Leave",
      subjects: ["Digital Electronics", "Microprocessors"],
      classes: 2,
      students: 96,
    },
    {
      id: 5,
      name: "Dr. Manjunath H",
      initials: "MH",
      role: "Professor",
      department: "CSE",
      status: "Active",
      subjects: ["Operating Systems", "Computer Networks"],
      classes: 5,
      students: 214,
    },
    {
      id: 6,
      name: "Prof. Kavya N",
      initials: "KN",
      role: "Assistant Professor",
      department: "CSE",
      status: "Active",
      subjects: ["Java", "Software Engineering"],
      classes: 3,
      students: 138,
    },
  ];

  // Search + filters
  const filteredFaculty = useMemo(() => {
    return faculty.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.department.toLowerCase().includes(search.toLowerCase()) ||
        member.subjects.some((subject) =>
          subject.toLowerCase().includes(search.toLowerCase())
        );

      const matchesDepartment =
        department === "All Departments" ||
        member.department === department;

      const matchesStatus =
        status === "All Status" ||
        member.status === status;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [search, department, status]);

  const totalFaculty = faculty.length;

  const activeFaculty = faculty.filter(
    (member) => member.status === "Active"
  ).length;

  const leaveFaculty = faculty.filter(
    (member) => member.status === "On Leave"
  ).length;

  const totalSubjects = faculty.reduce(
    (total, member) => total + member.subjects.length,
    0
  );

  return (
    <div className="faculty-management-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="faculty-page-header">
        <div>
          <p className="faculty-page-eyebrow">
            HOD PORTAL
          </p>

          <h1>Faculty Management</h1>

          <p className="faculty-page-description">
            Manage and monitor faculty members in your department.
          </p>
        </div>

        <button
          className="add-faculty-btn"
          type="button"
          onClick={() =>
            alert("Add Faculty module will be connected later.")
          }
        >
          <Plus size={18} />
          Add Faculty
        </button>
      </div>

      {/* =========================
          SEARCH + FILTERS
      ========================= */}

      <div className="faculty-toolbar">

        <div className="faculty-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search faculty, department or subject..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          className="faculty-filter"
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
        >
          <option>All Departments</option>
          <option>CSE</option>
          <option>ISE</option>
          <option>ECE</option>
          <option>EEE</option>
          <option>MECH</option>
          <option>CIVIL</option>
        </select>

        <select
          className="faculty-filter"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option>All Status</option>
          <option>Active</option>
          <option>On Leave</option>
        </select>

      </div>

      {/* =========================
          STATISTICS
      ========================= */}

      <div className="faculty-stats-grid">

        <div className="faculty-stat">
          <div className="faculty-stat-icon blue">
            <Users size={22} />
          </div>

          <div>
            <span className="faculty-stat-value">
              {totalFaculty}
            </span>

            <span className="faculty-stat-label">
              Total Faculty
            </span>
          </div>
        </div>

        <div className="faculty-stat">
          <div className="faculty-stat-icon green">
            <UserCheck size={22} />
          </div>

          <div>
            <span className="faculty-stat-value">
              {activeFaculty}
            </span>

            <span className="faculty-stat-label">
              Active Faculty
            </span>
          </div>
        </div>

        <div className="faculty-stat">
          <div className="faculty-stat-icon orange">
            <UserRoundX size={22} />
          </div>

          <div>
            <span className="faculty-stat-value">
              {leaveFaculty}
            </span>

            <span className="faculty-stat-label">
              On Leave
            </span>
          </div>
        </div>

        <div className="faculty-stat">
          <div className="faculty-stat-icon purple">
            <BookOpen size={22} />
          </div>

          <div>
            <span className="faculty-stat-value">
              {totalSubjects}
            </span>

            <span className="faculty-stat-label">
              Subjects
            </span>
          </div>
        </div>

      </div>

      {/* =========================
          SECTION HEADER
      ========================= */}

      <div className="faculty-section-header">

        <div className="faculty-section-title">
          <GraduationCap size={21} />

          <h2>Faculty Members</h2>

          <span className="faculty-count">
            {filteredFaculty.length}
          </span>
        </div>

      </div>

      {/* =========================
          FACULTY CARDS
      ========================= */}

      {filteredFaculty.length > 0 ? (

        <div className="faculty-grid">

          {filteredFaculty.map((member) => (

            <div
              className="faculty-card"
              key={member.id}
            >

              {/* CARD HEADER */}

              <div className="faculty-card-top">

                <div className="faculty-person">

                  <div className="faculty-avatar">
                    {member.initials}
                  </div>

                  <div>
                    <div className="faculty-name">
                      {member.name}
                    </div>

                    <div className="faculty-role">
                      {member.role} • {member.department}
                    </div>
                  </div>

                </div>

                <div
                  className={`faculty-status ${
                    member.status === "Active"
                      ? "active"
                      : "leave"
                  }`}
                >
                  <span className="status-dot"></span>

                  {member.status}
                </div>

              </div>

              {/* SUBJECTS */}

              <div className="faculty-subjects">

                <span className="faculty-subjects-label">
                  Subjects
                </span>

                <div className="subject-list">

                  {member.subjects.map((subject) => (
                    <span
                      className="subject-chip"
                      key={subject}
                    >
                      {subject}
                    </span>
                  ))}

                </div>

              </div>

              {/* METRICS */}

              <div className="faculty-metrics">

                <div className="faculty-metric">

                  <span className="faculty-metric-label">
                    Classes
                  </span>

                  <span className="faculty-metric-value">
                    {member.classes}
                  </span>

                </div>

                <div className="faculty-metric">

                  <span className="faculty-metric-label">
                    Students
                  </span>

                  <span className="faculty-metric-value">
                    {member.students}
                  </span>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="faculty-card-actions">

                <button
                 className="faculty-action-primary"
                type="button"
                 onClick={() => setSelectedFaculty(member)}
                >
                <Eye size={14} />
                 View Profile
                </button>

                <button
                  className="faculty-action-secondary"
                  type="button"
                  onClick={() =>
                    alert(
                      `Viewing ${member.name}'s classes`
                    )
                  }
                >
                  View Classes
                </button>

              </div>

            </div>

          ))}

        </div>

      ) : (

        /* =========================
           EMPTY STATE
        ========================= */

        <div className="faculty-empty">

          <div className="faculty-empty-icon">
            <Search size={24} />
          </div>

          <h3>No faculty found</h3>

          <p>
            Try changing your search or filter options.
          </p>
          {selectedFaculty && (
         <FacultyProfileModal
         faculty={selectedFaculty}
         onClose={() => setSelectedFaculty(null)}
         />
        )}

        </div>

      )}

    </div>
  );
}

export default FacultyManagement;