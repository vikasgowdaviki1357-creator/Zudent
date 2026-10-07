import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  Megaphone,
  TrendingUp,
} from "lucide-react";

import "./StudentDashboard.css";

function StudentDashboard() {
  return (
    <div className="student-dashboard">

      {/* =====================================================
          WELCOME SECTION
      ===================================================== */}

      <div className="welcome-section">
        <div>
          <p className="page-eyebrow">
            STUDENT DASHBOARD
          </p>

          <h1>
            Good evening, Vikas
          </h1>

          <p>
            Here is what's happening with your academics
            and campus today.
          </p>
        </div>

        <div className="semester-badge">
          <GraduationCap size={20} />
          <span>Semester 2</span>
        </div>
      </div>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="stats-grid">

        <StatCard
          icon={<CheckCircle2 />}
          title="Attendance"
          value="87%"
          detail="Overall attendance"
          status="Above requirement"
        />

        <StatCard
          icon={<TrendingUp />}
          title="Current CGPA"
          value="9.48"
          detail="Latest result"
          status="Excellent"
        />

        <StatCard
          icon={<FileText />}
          title="Assignments"
          value="03"
          detail="Pending submissions"
          status="2 due this week"
        />

        <StatCard
          icon={<CalendarDays />}
          title="Upcoming Exams"
          value="04"
          detail="This semester"
          status="Next in 12 days"
        />

      </section>


      {/* =====================================================
          MAIN DASHBOARD
      ===================================================== */}

      <div className="dashboard-grid">

        {/* TODAY'S CLASSES */}

        <section className="dashboard-card schedule-card">

          <CardHeader
            title="Today's Classes"
            action="View timetable"
          />

          <div className="class-list">

            <ClassItem
              time="09:00"
              subject="Mathematics"
              room="Room 204"
              faculty="Dr. Sharma"
            />

            <ClassItem
              time="10:00"
              subject="Python Programming"
              room="Lab 3"
              faculty="Prof. Kumar"
            />

            <ClassItem
              time="11:30"
              subject="Engineering Chemistry"
              room="Room 301"
              faculty="Dr. Rao"
            />

            <ClassItem
              time="02:00"
              subject="Innovation & Design Thinking"
              room="Seminar Hall"
              faculty="Prof. Mehta"
            />

          </div>

        </section>


        {/* UPCOMING ASSIGNMENTS */}

        <section className="dashboard-card">

          <CardHeader
            title="Upcoming Assignments"
            action="View all"
          />

          <Assignment
            subject="Python Programming"
            title="File Handling Assignment"
            due="Tomorrow"
          />

          <Assignment
            subject="Mathematics"
            title="Module 3 Problems"
            due="26 Jul"
          />

          <Assignment
            subject="Chemistry"
            title="Lab Record Submission"
            due="29 Jul"
          />

        </section>

      </div>


      {/* =====================================================
          LOWER DASHBOARD
      ===================================================== */}

      <div className="dashboard-grid lower-grid">

        {/* LATEST NOTICES */}

        <section className="dashboard-card">

          <CardHeader
            title="Latest Notices"
            action="All notices"
          />

          <Notice
            title="Internal Assessment Examination"
            date="24 Jul"
          />

          <Notice
            title="Kargil Vijay Diwas Programme"
            date="23 Jul"
          />

          <Notice
            title="Placement Training Registration"
            date="22 Jul"
          />

        </section>


        {/* QUICK ACCESS */}

        <section className="dashboard-card">

          <CardHeader
            title="Quick Access"
          />

          <div className="quick-grid">

            <QuickAction
              icon={<BookOpen />}
              text="Resources"
            />

            <QuickAction
              icon={<CalendarDays />}
              text="Events"
            />

            <QuickAction
              icon={<GraduationCap />}
              text="Results"
            />

            <QuickAction
              icon={<Megaphone />}
              text="Notices"
            />

          </div>

        </section>

      </div>

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
        <button
          type="button"
          className="card-action"
        >
          {action}

          <ArrowRight size={15} />
        </button>
      )}

    </div>
  );
}


/* =========================================================
   CLASS ITEM
========================================================= */

function ClassItem({
  time,
  subject,
  room,
  faculty,
}) {
  return (
    <div className="class-item">

      <div className="class-time">

        <Clock3 size={16} />

        <span>
          {time}
        </span>

      </div>

      <div className="class-info">

        <strong>
          {subject}
        </strong>

        <span>
          {faculty} • {room}
        </span>

      </div>

    </div>
  );
}


/* =========================================================
   ASSIGNMENT
========================================================= */

function Assignment({
  subject,
  title,
  due,
}) {
  return (
    <div className="assignment-item">

      <div className="assignment-info">

        <span className="subject-label">
          {subject}
        </span>

        <strong>
          {title}
        </strong>

      </div>

      <span className="due-date">
        {due}
      </span>

    </div>
  );
}


/* =========================================================
   NOTICE
========================================================= */

function Notice({
  title,
  date,
}) {
  return (
    <div className="notice-item">

      <div className="notice-icon">
        <Megaphone size={17} />
      </div>

      <div className="notice-content">

        <strong>
          {title}
        </strong>

        <span>
          {date}
        </span>

      </div>

    </div>
  );
}


/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon,
  text,
}) {
  return (
    <button
      type="button"
      className="quick-action"
    >

      <div className="quick-action-icon">
        {icon}
      </div>

      <span>
        {text}
      </span>

    </button>
  );
}


export default StudentDashboard;