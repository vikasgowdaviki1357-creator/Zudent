import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  GraduationCap,
  UserCheck,
  Building2,
  Eye,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

import "./StudentsManagement.css";
import StudentProfileModal from "./StudentProfileModal.jsx";

const API_URL = "http://localhost:5000/api";

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function getYearFromSemester(semester) {
  if (!semester) return "—";

  const sem = Number(semester);

  if (sem <= 2) return "1st Year";
  if (sem <= 4) return "2nd Year";
  if (sem <= 6) return "3rd Year";
  if (sem <= 8) return "4th Year";

  return "—";
}

function getSemesterLabel(semester) {
  if (!semester) return "—";

  const sem = Number(semester);

  if (Number.isNaN(sem)) return semester;

  const suffix =
    sem % 100 >= 11 && sem % 100 <= 13
      ? "th"
      : sem % 10 === 1
        ? "st"
        : sem % 10 === 2
          ? "nd"
          : sem % 10 === 3
            ? "rd"
            : "th";

  return `${sem}${suffix} Semester`;
}

function normalizeStudent(student) {
  return {
    ...student,

    id: student._id,

    name: student.name || "Unknown Student",

    usn: student.usn || "—",

    department:
      student.department ||
      student.branch ||
      "—",

    year:
      student.year ||
      getYearFromSemester(student.semester),

    semester:
      student.semester
        ? getSemesterLabel(student.semester)
        : "—",

    section:
      student.section ||
      "—",

    cgpa:
      student.cgpa !== undefined &&
      student.cgpa !== null
        ? student.cgpa
        : "—",

    attendance:
      student.attendance !== undefined &&
      student.attendance !== null
        ? student.attendance
        : "—",

    email:
      student.email ||
      "—",

    phone:
      student.phone ||
      "—",

    status:
      student.isActive === false
        ? "Inactive"
        : "Active",

    initials:
      student.initials ||
      getInitials(student.name),
  };
}

function StudentsManagement() {
  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState("");
  const [department, setDepartment] =
    useState("All Departments");
  const [year, setYear] =
    useState("All Years");

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [refreshing, setRefreshing] =
    useState(false);

  /*
   * Load students from MongoDB
   */
  const fetchStudents = async () => {
    try {
      setError("");

      if (!refreshing) {
        setLoading(true);
      }

      const token =
        localStorage.getItem("jit_token") ||
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/admin/users?role=student`,
        {
          method: "GET",

          headers: {
            "Content-Type":
              "application/json",

            ...(token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          "Failed to load students"
        );
      }

      const studentList =
        Array.isArray(result.data)
          ? result.data
          : [];

      setStudents(
        studentList.map(normalizeStudent)
      );
    } catch (err) {
      console.error(
        "Students loading error:",
        err
      );

      setError(
        err.message ||
        "Unable to load students."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  /*
   * Refresh
   */
  const handleRefresh = () => {
    setRefreshing(true);
    fetchStudents();
  };

  /*
   * Local filtering
   *
   * Search is kept here so the page responds
   * instantly while using the already loaded
   * MongoDB records.
   */
  const filteredStudents = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    return students.filter((student) => {
      const matchesSearch =
        !searchValue ||
        student.name
          .toLowerCase()
          .includes(searchValue) ||
        student.usn
          .toLowerCase()
          .includes(searchValue) ||
        student.department
          .toLowerCase()
          .includes(searchValue) ||
        student.email
          .toLowerCase()
          .includes(searchValue);

      const matchesDepartment =
        department === "All Departments" ||
        student.department === department;

      const matchesYear =
        year === "All Years" ||
        student.year === year;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesYear
      );
    });
  }, [
    students,
    search,
    department,
    year,
  ]);

  /*
   * Dynamic statistics
   */
  const totalStudents =
    students.length;

  const activeStudents =
    students.filter(
      (student) =>
        student.status === "Active"
    ).length;

  const departmentsCount =
    new Set(
      students
        .map(
          (student) =>
            student.department
        )
        .filter(
          (department) =>
            department &&
            department !== "—"
        )
    ).size;

  const cgpaValues =
    students
      .map((student) =>
        Number(student.cgpa)
      )
      .filter(
        (value) =>
          !Number.isNaN(value)
      );

  const averageCgpa =
    cgpaValues.length
      ? (
          cgpaValues.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
          cgpaValues.length
        ).toFixed(2)
      : "—";

  /*
   * Department options
   */
  const departmentOptions = useMemo(() => {
    const departments =
      students
        .map(
          (student) =>
            student.department
        )
        .filter(
          (department) =>
            department &&
            department !== "—"
        );

    return [
      "All Departments",
      ...Array.from(
        new Set(departments)
      ).sort(),
    ];
  }, [students]);

  /*
   * Clear filters
   */
  const clearFilters = () => {
    setSearch("");
    setDepartment(
      "All Departments"
    );
    setYear("All Years");
  };

  return (
    <div className="students-page">

      {/* HEADER */}

      <div className="students-page-header">

        <div>

          <p className="students-breadcrumb">
            HOD / Students
          </p>

          <h1>
            Students Management
          </h1>

          <p className="students-subtitle">
            Manage and monitor students
            across the department.
          </p>

        </div>

        <button
          className="students-add-button"
          onClick={handleRefresh}
          disabled={loading || refreshing}
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh Students"}
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            padding: "14px 18px",
            marginBottom: "20px",
            borderRadius: "10px",
            background: "#fef2f2",
            color: "#dc2626",
            border:
              "1px solid #fecaca",
          }}
        >
          <strong>
            Failed to load students:
          </strong>{" "}
          {error}
        </div>
      )}

      {/* STATISTICS */}

      <div className="students-stats">

        <div className="student-stat-card">

          <div className="student-stat-icon blue">
            <Users size={21} />
          </div>

          <div>

            <span>
              Total Students
            </span>

            <strong>
              {loading
                ? "..."
                : totalStudents}
            </strong>

            <small>
              From MongoDB
            </small>

          </div>

        </div>

        <div className="student-stat-card">

          <div className="student-stat-icon green">
            <UserCheck size={21} />
          </div>

          <div>

            <span>
              Active Students
            </span>

            <strong>
              {loading
                ? "..."
                : activeStudents}
            </strong>

            <small>
              Currently active
            </small>

          </div>

        </div>

        <div className="student-stat-card">

          <div className="student-stat-icon purple">
            <GraduationCap size={21} />
          </div>

          <div>

            <span>
              Average CGPA
            </span>

            <strong>
              {loading
                ? "..."
                : averageCgpa}
            </strong>

            <small>
              Available student records
            </small>

          </div>

        </div>

        <div className="student-stat-card">

          <div className="student-stat-icon orange">
            <Building2 size={21} />
          </div>

          <div>

            <span>
              Departments
            </span>

            <strong>
              {loading
                ? "..."
                : departmentsCount}
            </strong>

            <small>
              In student records
            </small>

          </div>

        </div>

      </div>

      {/* MAIN CARD */}

      <div className="students-main-card">

        {/* TOOLBAR */}

        <div className="students-toolbar">

          <div className="students-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search by name, USN or department..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          <div className="students-filter">

            <div className="students-select">

              <select
                value={department}
                onChange={(e) =>
                  setDepartment(
                    e.target.value
                  )
                }
              >

                {departmentOptions.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}

              </select>

              <ChevronDown size={16} />

            </div>

            <div className="students-select">

              <select
                value={year}
                onChange={(e) =>
                  setYear(
                    e.target.value
                  )
                }
              >

                <option>
                  All Years
                </option>

                <option>
                  1st Year
                </option>

                <option>
                  2nd Year
                </option>

                <option>
                  3rd Year
                </option>

                <option>
                  4th Year
                </option>

              </select>

              <ChevronDown size={16} />

            </div>

          </div>

        </div>

        {/* RESULT INFO */}

        <div className="students-result-info">

          <div>
            <strong>
              {filteredStudents.length}
            </strong>{" "}
            students shown
          </div>

          {(search ||
            department !==
              "All Departments" ||
            year !== "All Years") && (

            <button
              onClick={
                clearFilters
              }
            >
              Clear filters
            </button>

          )}

        </div>

        {/* TABLE */}

        <div className="students-table-wrapper">

          <table className="students-table">

            <thead>

              <tr>

                <th>
                  Student
                </th>

                <th>
                  USN
                </th>

                <th>
                  Department
                </th>

                <th>
                  Year
                </th>

                <th>
                  Section
                </th>

                <th>
                  CGPA
                </th>

                <th>
                  Attendance
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="9"
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "50px",
                    }}
                  >
                    Loading students...
                  </td>

                </tr>

              ) : (

                filteredStudents.map(
                  (student) => (

                    <tr
                      key={student.id}
                    >

                      <td>

                        <div className="student-name-cell">

                          <div className="student-avatar">

                            {student.initials}

                          </div>

                          <div>

                            <strong>
                              {student.name}
                            </strong>

                            <span>
                              {student.email}
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>

                        <span className="student-usn">
                          {student.usn}
                        </span>

                      </td>

                      <td>

                        <span className="department-badge">
                          {student.department}
                        </span>

                      </td>

                      <td>
                        {student.year}
                      </td>

                      <td>
                        {student.section}
                      </td>

                      <td>

                        <strong className="cgpa-value">
                          {student.cgpa}
                        </strong>

                      </td>

                      <td>

                        <span className="attendance-value">
                          {student.attendance}
                        </span>

                      </td>

                      <td>

                        <span
                          className="student-status"
                          style={{
                            color:
                              student.status ===
                              "Active"
                                ? "#16a34a"
                                : "#dc2626",
                          }}
                        >

                          <span
                            style={{
                              background:
                                student.status ===
                                "Active"
                                  ? "#16a34a"
                                  : "#dc2626",
                            }}
                          />

                          {student.status}

                        </span>

                      </td>

                      <td>

                        <button
                          className="student-view-button"
                          onClick={() =>
                            setSelectedStudent(
                              student
                            )
                          }
                        >

                          <Eye size={15} />

                          View

                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

          {!loading &&
            filteredStudents.length ===
              0 && (

              <div className="students-empty">

                <Users size={40} />

                <h3>
                  No students found
                </h3>

                <p>
                  Try changing your
                  search or filters.
                </p>

              </div>

            )}

        </div>

      </div>

      {/* PROFILE MODAL */}

      {selectedStudent && (

        <StudentProfileModal
          student={
            selectedStudent
          }
          onClose={() =>
            setSelectedStudent(null)
          }
        />

      )}

    </div>
  );
}

export default StudentsManagement;