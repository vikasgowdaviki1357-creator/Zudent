import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  ClipboardCheck,
  FileText,
  Clock3,
  MapPin,
  ArrowRight,
  Megaphone,
  CalendarDays,
  BarChart3,
  Plus,
} from "lucide-react";

const todaysClasses = [
  {
    id: 1,
    subject: "Data Structures",
    code: "BCS304",
    section: "CSE - A",
    semester: "3rd Sem",
    time: "09:00 AM",
    room: "CSE-201",
    students: 62,
  },
  {
    id: 2,
    subject: "Python Programming",
    code: "BPLCK205B",
    section: "CSE - B",
    semester: "2nd Sem",
    time: "11:00 AM",
    room: "Lab-02",
    students: 58,
  },
  {
    id: 3,
    subject: "Data Structures Lab",
    code: "BCSL305",
    section: "CSE - A",
    semester: "3rd Sem",
    time: "02:00 PM",
    room: "CSE Lab-01",
    students: 31,
  },
];

const recentActivity = [
  {
    id: 1,
    title: "Attendance submitted",
    description: "Data Structures • CSE-A",
    time: "20 minutes ago",
    icon: ClipboardCheck,
  },
  {
    id: 2,
    title: "Assignment published",
    description: "Python Programming • Assignment 03",
    time: "Yesterday",
    icon: FileText,
  },
  {
    id: 3,
    title: "Resource uploaded",
    description: "Data Structures • Unit 2 Notes",
    time: "2 days ago",
    icon: BookOpen,
  },
];

function FacultyDashboard() {
  const navigate = useNavigate();

  return (
    <div className="faculty-dashboard">
      <div className="faculty-welcome">
        <div>
          <p className="page-eyebrow">FACULTY DASHBOARD</p>
          <h1>Good morning, Professor</h1>
          <p>
            Here's an overview of your classes and academic
            activities today.
          </p>
        </div>

        <div className="faculty-date">
          <CalendarDays size={18} />

          <div>
            <span>Academic Year</span>
            <strong>2026-27</strong>
          </div>
        </div>
      </div>

      <div className="faculty-stat-grid">
        <FacultyStat
          icon={<Users />}
          value="151"
          label="Total Students"
          detail="Across 3 classes"
        />

        <FacultyStat
          icon={<BookOpen />}
          value="3"
          label="My Classes"
          detail="2 subjects + 1 lab"
        />

        <FacultyStat
          icon={<ClipboardCheck />}
          value="87%"
          label="Avg. Attendance"
          detail="Current semester"
        />

        <FacultyStat
          icon={<FileText />}
          value="5"
          label="Active Assignments"
          detail="3 need review"
        />
      </div>

      <div className="faculty-dashboard-grid">
        <section className="faculty-panel faculty-classes-panel">
          <div className="faculty-panel-header">
            <div>
              <h3>Today's Classes</h3>
              <p>Your teaching schedule for today</p>
            </div>

            <button onClick={() => navigate("/faculty/classes")}>
              Full Schedule
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="faculty-class-list">
            {todaysClasses.map((classItem) => (
              <article
                className="faculty-class-item"
                key={classItem.id}
              >
                <div className="faculty-class-time">
                  <Clock3 size={16} />
                  <strong>{classItem.time}</strong>
                </div>

                <div className="faculty-class-info">
                  <span>{classItem.code}</span>
                  <h4>{classItem.subject}</h4>

                  <div>
                    <span>
                      <Users size={12} />
                      {classItem.section}
                    </span>

                    <span>
                      <MapPin size={12} />
                      {classItem.room}
                    </span>

                    <span>
                      {classItem.students} students
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate("/faculty/attendance")
                  }
                >
                  Take Attendance
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="faculty-panel">
          <div className="faculty-panel-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Common faculty tasks</p>
            </div>
          </div>

          <div className="faculty-quick-actions">
            <QuickAction
              icon={ClipboardCheck}
              title="Take Attendance"
              description="Mark today's class"
              onClick={() =>
                navigate("/faculty/attendance")
              }
            />

            <QuickAction
              icon={FileText}
              title="New Assignment"
              description="Create assignment"
              onClick={() =>
                navigate("/faculty/assignments")
              }
            />

            <QuickAction
              icon={BarChart3}
              title="Enter Marks"
              description="Update student marks"
              onClick={() =>
                navigate("/faculty/marks")
              }
            />

            <QuickAction
              icon={Megaphone}
              title="Announcement"
              description="Notify students"
              onClick={() =>
                navigate("/faculty/announcements")
              }
            />
          </div>
        </section>
      </div>

      <div className="faculty-bottom-grid">
        <section className="faculty-panel">
          <div className="faculty-panel-header">
            <div>
              <h3>Pending Tasks</h3>
              <p>Items requiring your attention</p>
            </div>
          </div>

          <PendingTask
            title="Review Assignment 02"
            subject="Data Structures"
            count="46 submissions"
            type="Review"
          />

          <PendingTask
            title="Enter IA-1 Marks"
            subject="Python Programming"
            count="58 students"
            type="Marks"
          />

          <PendingTask
            title="Upload Unit 3 Notes"
            subject="Data Structures"
            count="Resource"
            type="Upload"
          />
        </section>

        <section className="faculty-panel">
          <div className="faculty-panel-header">
            <div>
              <h3>Recent Activity</h3>
              <p>Your latest academic updates</p>
            </div>
          </div>

          <div className="faculty-activity-list">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;

              return (
                <div
                  className="faculty-activity"
                  key={activity.id}
                >
                  <div>
                    <Icon size={16} />
                  </div>

                  <section>
                    <strong>{activity.title}</strong>
                    <span>{activity.description}</span>
                  </section>

                  <small>{activity.time}</small>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function FacultyStat({ icon, value, label, detail }) {
  return (
    <article className="faculty-stat-card">
      <div className="faculty-stat-icon">
        {icon}
      </div>

      <div>
        <strong>{value}</strong>
        <span>{label}</span>
        <small>{detail}</small>
      </div>
    </article>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      className="faculty-quick-action"
      onClick={onClick}
    >
      <div>
        <Icon size={18} />
      </div>

      <section>
        <strong>{title}</strong>
        <span>{description}</span>
      </section>

      <ArrowRight size={14} />
    </button>
  );
}

function PendingTask({
  title,
  subject,
  count,
  type,
}) {
  return (
    <div className="faculty-task">
      <div className="faculty-task-check">
        <Plus size={15} />
      </div>

      <section>
        <strong>{title}</strong>
        <span>
          {subject} • {count}
        </span>
      </section>

      <span className="faculty-task-type">
        {type}
      </span>
    </div>
  );
}

export default FacultyDashboard;