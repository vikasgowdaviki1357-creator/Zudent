import "./MyClasses.css";
import { StatCard } from "../../components/ui";
import {
  GraduationCap,
  Search,
  Filter,
  Plus,
  BookOpen,
  Users,
  CalendarDays,
  FileText,
} from "lucide-react";

function MyClasses() {
  const stats = [
    {
      title: "Classes",
      value: 6,
      icon: <BookOpen size={24} />,
      color: "#4F46E5",
    },
    {
      title: "Students",
      value: 312,
      icon: <Users size={24} />,
      color: "#10B981",
    },
    {
      title: "Attendance",
      value: "88%",
      icon: <CalendarDays size={24} />,
      color: "#F59E0B",
    },
    {
      title: "Resources",
      value: 41,
      icon: <FileText size={24} />,
      color: "#2563EB",
    },
  ];

  const classes = [
    {
      id: 1,
      subject: "Data Structures",
      code: "BCS304",
      semester: "3rd Semester",
      section: "CSE - A",
      students: 62,
      room: "CSE-201",
      time: "09:00 AM",
      attendance: 87,
      status: "Live",
    },
    {
      id: 2,
      subject: "Python Programming",
      code: "BCSL205",
      semester: "2nd Semester",
      section: "CSE - B",
      students: 58,
      room: "Lab-02",
      time: "11:00 AM",
      attendance: 91,
      status: "Upcoming",
    },
    {
      id: 3,
      subject: "Operating Systems",
      code: "BCS502",
      semester: "5th Semester",
      section: "CSE - A",
      students: 64,
      room: "CSE-305",
      time: "02:00 PM",
      attendance: 84,
      status: "Completed",
    },
  ];

  return (
    <div className="my-classes-page">

      {/* Header */}

      <div className="page-header">
        <div>
          <p className="page-subtitle">FACULTY PORTAL</p>

          <h1>My Classes</h1>

          <p className="page-description">
            Manage your classes, students and academic activities.
          </p>
        </div>

        <button className="new-class-btn">
          <Plus size={18} />
          New Class
        </button>
      </div>

      {/* Search */}

      <div className="toolbar">

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search classes..."
          />
        </div>

        <button className="filter-btn">
          <Filter size={18} />
          Filter
        </button>

      </div>

      {/* Stats */}

      <div className="stats-grid">

    {stats.map((item)=>(

        <StatCard

            key={item.title}

            title={item.title}

            value={item.value}

            icon={item.icon}

            color={item.color}

            trend="+12%"

            description="Compared to last week"

        />

    ))}

</div>

      {/* Today's Classes */}

      <div className="section-header">
        <GraduationCap size={22} />
        <h2>Today's Classes</h2>
      </div>

      <div className="classes-grid">

        {classes.map((cls) => (

          <div className="class-card" key={cls.id}>

            <div className="class-top">

              <div>

                <span className="subject-code">
                  {cls.code}
                </span>

                <h3>{cls.subject}</h3>

              </div>

              <span className={`status ${cls.status.toLowerCase()}`}>
                {cls.status}
              </span>

            </div>

            <div className="class-info">

              <p>🎓 {cls.semester}</p>

              <p>🏫 {cls.section}</p>

              <p>👨‍🎓 {cls.students} Students</p>

              <p>📍 {cls.room}</p>

              <p>🕘 {cls.time}</p>

            </div>

            <div className="attendance-box">

              <div className="attendance-header">

                <span>Attendance</span>

                <strong>{cls.attendance}%</strong>

              </div>

              <div className="progress">

                <div
                  className="progress-fill"
                  style={{
                    width: `${cls.attendance}%`,
                  }}
                ></div>

              </div>

            </div>

            <div className="class-actions">

              <button>Attendance</button>

              <button>Assignments</button>

              <button>Marks</button>

              <button>Resources</button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default MyClasses;