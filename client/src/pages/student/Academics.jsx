import { useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  Loader2,
  TrendingUp,
  UserRound,
} from "lucide-react";

import api from "../../services/api";

function Academics() {
  const [academicData, setAcademicData] = useState(null);
  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [assignmentLoading, setAssignmentLoading] = useState(true);

  const [error, setError] = useState("");
  const [assignmentError, setAssignmentError] = useState("");

  useEffect(() => {
    loadAcademics();
    loadAssignments();
  }, []);

  /* =========================================================
     LOAD ACADEMICS
  ========================================================= */

  const loadAcademics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/student/courses");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to load academic information."
        );
      }

      setAcademicData(response.data.data || null);
    } catch (err) {
      console.error("Academics loading error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load academic information."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     LOAD ASSIGNMENTS
  ========================================================= */

  const loadAssignments = async () => {
    try {
      setAssignmentLoading(true);
      setAssignmentError("");

      const response = await api.get("/student/assignments");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to load assignments."
        );
      }

      setAssignments(
        Array.isArray(response.data.data)
          ? response.data.data
          : []
      );
    } catch (err) {
      console.error("Assignments loading error:", err);

      setAssignmentError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load assignments."
      );
    } finally {
      setAssignmentLoading(false);
    }
  };

  /* =========================================================
     DATA
  ========================================================= */

  const student = academicData?.student;
  const courses = academicData?.courses || [];

  /* =========================================================
     TOTAL CREDITS
  ========================================================= */

  const totalCredits = useMemo(() => {
    return courses.reduce(
      (total, course) =>
        total + Number(course.credits || 0),
      0
    );
  }, [courses]);

  /* =========================================================
     ATTENDANCE
  ========================================================= */

  const attendanceCourses = courses.filter(
    (course) =>
      course.attendance &&
      course.attendance.total > 0 &&
      course.attendance.percentage !== null &&
      course.attendance.percentage !== undefined
  );

  const overallAttendance = useMemo(() => {
    if (!attendanceCourses.length) {
      return null;
    }

    const totalClasses = attendanceCourses.reduce(
      (total, course) =>
        total +
        Number(course.attendance.total || 0),
      0
    );

    const attendedClasses = attendanceCourses.reduce(
      (total, course) =>
        total +
        Number(course.attendance.attended || 0),
      0
    );

    if (!totalClasses) {
      return null;
    }

    return Number(
      ((attendedClasses / totalClasses) * 100).toFixed(1)
    );
  }, [attendanceCourses]);

  /* =========================================================
     ASSIGNMENT STATUS
  ========================================================= */

  const pendingAssignments = assignments.filter(
    (assignment) => !assignment.submitted
  );

  const submittedAssignments = assignments.filter(
    (assignment) => assignment.submitted
  );

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="student-dashboard">
        <div className="academic-loading">
          <Loader2
            size={30}
            className="academic-spinner"
          />

          <p>
            Loading your academic information...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <div className="student-dashboard">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="welcome-section">
        <div>
          <p className="page-eyebrow">
            ACADEMICS
          </p>

          <h1>
            {student?.name
              ? `${student.name}'s Academics`
              : "Academic Overview"}
          </h1>

          <p>
            Your courses, attendance and assignments
            in one place.
          </p>
        </div>

        <div className="semester-badge">
          <GraduationCap size={20} />

          <span>
            Semester {student?.semester ?? "—"}
          </span>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="academic-error">
          <AlertCircle size={20} />

          <div>
            <strong>
              Unable to load academics
            </strong>

            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={loadAcademics}
          >
            Retry
          </button>
        </div>
      )}

      {/* =====================================================
          STUDENT INFORMATION
      ===================================================== */}

      <section className="dashboard-card academic-profile-card">

        <div className="card-header">
          <h3>Student Information</h3>
        </div>

        <div className="academic-profile-grid">

          <InfoItem
            icon={<UserRound size={18} />}
            label="Name"
            value={student?.name}
          />

          <InfoItem
            icon={<GraduationCap size={18} />}
            label="USN"
            value={student?.usn}
          />

          <InfoItem
            icon={<BookOpen size={18} />}
            label="Branch"
            value={student?.branch}
          />

          <InfoItem
            icon={<CalendarDays size={18} />}
            label="Semester"
            value={student?.semester}
          />

        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="stats-grid">

        <StatCard
          icon={<BookOpen />}
          title="Courses"
          value={courses.length}
          detail="Current semester"
          status={
            courses.length
              ? "Database connected"
              : "No courses found"
          }
        />

        <StatCard
          icon={<TrendingUp />}
          title="Credits"
          value={totalCredits || "—"}
          detail="Total course credits"
          status={
            totalCredits
              ? "Current semester"
              : "Not available"
          }
        />

        <StatCard
          icon={<CheckCircle2 />}
          title="Attendance"
          value={
            overallAttendance !== null
              ? `${overallAttendance}%`
              : "—"
          }
          detail="Overall attendance"
          status={
            overallAttendance !== null
              ? getAttendanceStatus(
                  overallAttendance
                )
              : "No attendance data"
          }
        />

        <StatCard
          icon={<FileText />}
          title="Assignments"
          value={pendingAssignments.length}
          detail="Pending submissions"
          status={
            submittedAssignments.length
              ? `${submittedAssignments.length} submitted`
              : "No submissions yet"
          }
        />

      </section>

      {/* =====================================================
          CURRENT COURSES
      ===================================================== */}

      <section className="dashboard-card">

        <CardHeader
          title="Current Courses"
          action={`${courses.length} courses`}
        />

        {courses.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={24} />}
            title="No courses available"
            message="No courses have been assigned to your current branch and semester yet."
          />
        ) : (
          <div className="academic-course-list">

            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
              />
            ))}

          </div>
        )}

      </section>

      {/* =====================================================
          ASSIGNMENTS
      ===================================================== */}

      <section className="dashboard-card">

        <CardHeader
          title="Assignments"
          action={
            assignmentLoading
              ? "Loading..."
              : `${assignments.length} total`
          }
        />

        {assignmentError && (
          <div className="academic-inline-error">
            <AlertCircle size={17} />

            <span>
              {assignmentError}
            </span>

            <button
              type="button"
              onClick={loadAssignments}
            >
              Retry
            </button>
          </div>
        )}

        {assignmentLoading ? (
          <div className="academic-small-loading">

            <Loader2
              size={22}
              className="academic-spinner"
            />

            Loading assignments...

          </div>
        ) : assignments.length === 0 ? (
          <EmptyState
            icon={<FileText size={24} />}
            title="No assignments"
            message="There are currently no assignments available for your courses."
          />
        ) : (
          <div className="assignment-list">

            {assignments.map((assignment) => (
              <AcademicAssignment
                key={assignment._id}
                assignment={assignment}
              />
            ))}

          </div>
        )}

      </section>

      {/* =====================================================
          ACADEMIC NOTE
      ===================================================== */}

      <section className="dashboard-card academic-note-card">

        <div className="academic-note-icon">
          <AlertCircle size={20} />
        </div>

        <div>
          <strong>
            Academic data accuracy
          </strong>

          <p>
            Attendance, marks and CGPA shown here
            are displayed only when corresponding
            records are available in the college
            database. No academic values are
            estimated or invented.
          </p>
        </div>

      </section>

    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  title,
  value,
  detail,
  status,
}) {
  return (
    <article className="stat-card">

      <div className="stat-top">

        <div className="stat-icon">
          {icon}
        </div>

        <span>
          {title}
        </span>

      </div>

      <strong className="stat-value">
        {value}
      </strong>

      <p>
        {detail}
      </p>

      <small>
        {status}
      </small>

    </article>
  );
}

/* =========================================================
   CARD HEADER
========================================================= */

function CardHeader({
  title,
  action,
}) {
  return (
    <div className="card-header">

      <h3>
        {title}
      </h3>

      {action && (
        <span
          className="academic-card-action"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            whiteSpace: "nowrap",
          }}
        >
          {action}

          <ArrowRight size={15} />
        </span>
      )}

    </div>
  );
}

/* =========================================================
   STUDENT INFORMATION
========================================================= */

function InfoItem({
  icon,
  label,
  value,
}) {
  return (
    <div
      className="academic-info-item"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        minWidth: 0,
      }}
    >

      <div
        className="academic-info-icon"
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          minWidth: 0,
        }}
      >

        <span
          style={{
            display: "block",
            fontSize: "12px",
            color: "#6b7280",
            lineHeight: "1.2",
          }}
        >
          {label}
        </span>

        <strong
          style={{
            display: "block",
            fontSize: "15px",
            color: "#111827",
            lineHeight: "1.3",
            wordBreak: "break-word",
          }}
        >
          {value !== undefined &&
          value !== null &&
          String(value).trim()
            ? value
            : "Not available"}
        </strong>

      </div>

    </div>
  );
}

/* =========================================================
   COURSE CARD
========================================================= */

function CourseCard({ course }) {
  const attendance = course.attendance;

  const attendanceAvailable =
    attendance &&
    attendance.total > 0 &&
    attendance.percentage !== null &&
    attendance.percentage !== undefined;

  return (
    <article
      className="academic-course-card"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "24px",
        padding: "20px",
      }}
    >

      {/* COURSE INFORMATION */}

      <div
        className="course-main"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "16px",
          minWidth: 0,
          flex: 1,
        }}
      >

        <div
          className="course-code"
          style={{
            flexShrink: 0,
            minWidth: "65px",
            fontWeight: "700",
            color: "#2563eb",
          }}
        >
          {course.code || "—"}
        </div>

        <div
          className="course-details"
          style={{
            minWidth: 0,
            flex: 1,
          }}
        >

          <h4
            style={{
              margin: "0 0 8px",
              fontSize: "16px",
              fontWeight: "700",
              color: "#111827",
              lineHeight: "1.35",
            }}
          >
            {course.name || "Unnamed Course"}
          </h4>

          <div
            className="course-meta"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "8px 18px",
              color: "#6b7280",
              fontSize: "13px",
              lineHeight: "1.4",
            }}
          >

            <span>
              {course.type || "Course"}
            </span>

            <span>
              {course.credits || 0} Credits
            </span>

            {course.faculty?.name && (
              <span>
                {course.faculty.name}
              </span>
            )}

          </div>

        </div>

      </div>

      {/* ATTENDANCE */}

      <div
        className="course-attendance"
        style={{
          flexShrink: 0,
          minWidth: "120px",
          textAlign: "right",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >

        <span
          style={{
            fontSize: "12px",
            color: "#6b7280",
          }}
        >
          Attendance
        </span>

        {attendanceAvailable ? (
          <>
            <strong
              style={{
                fontSize: "18px",
                color: "#111827",
              }}
            >
              {attendance.percentage}%
            </strong>

            <small
              style={{
                color: "#6b7280",
              }}
            >
              {attendance.attended}/
              {attendance.total} classes
            </small>
          </>
        ) : (
          <>
            <strong
              style={{
                fontSize: "18px",
                color: "#6b7280",
              }}
            >
              —
            </strong>

            <small
              style={{
                color: "#9ca3af",
              }}
            >
              No records yet
            </small>
          </>
        )}

      </div>

    </article>
  );
}

/* =========================================================
   ASSIGNMENT
========================================================= */

function AcademicAssignment({
  assignment,
}) {
  const dueDate = assignment.dueDate
    ? formatDate(assignment.dueDate)
    : "No due date";

  const submitted =
    Boolean(assignment.submitted);

  return (
    <div
      className="academic-assignment-item"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "16px 0",
      }}
    >

      {/* ICON */}

      <div
        className="assignment-icon"
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {submitted ? (
          <CheckCircle2 size={18} />
        ) : (
          <FileText size={18} />
        )}
      </div>

      {/* CONTENT */}

      <div
        className="assignment-content"
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >

        <span className="subject-label">
          {assignment.course?.code ||
            assignment.course?.name ||
            "Assignment"}
        </span>

        <strong
          style={{
            display: "block",
            lineHeight: "1.4",
            wordBreak: "break-word",
          }}
        >
          {assignment.title ||
            "Untitled Assignment"}
        </strong>

        {assignment.description && (
          <p>
            {assignment.description}
          </p>
        )}

        <div
          className="assignment-meta"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Clock3 size={14} />

          <span>
            Due {dueDate}
          </span>
        </div>

      </div>

      {/* STATUS */}

      <span
        className={
          submitted
            ? "assignment-status submitted"
            : "assignment-status pending"
        }
        style={{
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        {submitted
          ? "Submitted"
          : "Pending"}
      </span>

    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon,
  title,
  message,
}) {
  return (
    <div className="academic-empty-state">

      <div>
        {icon}
      </div>

      <strong>
        {title}
      </strong>

      <p>
        {message}
      </p>

    </div>
  );
}

/* =========================================================
   DATE HELPER
========================================================= */

function formatDate(date) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

/* =========================================================
   ATTENDANCE STATUS
========================================================= */

function getAttendanceStatus(
  percentage
) {
  if (percentage >= 85) {
    return "Excellent";
  }

  if (percentage >= 75) {
    return "Above requirement";
  }

  return "Below requirement";
}

export default Academics;