import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FileText,
  BarChart3,
  BookOpen,
  Megaphone,
  GraduationCap,
  Bell,
  Search,
  LogOut,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/faculty",
  },
  {
    name: "My Classes",
    icon: Users,
    path: "/faculty/classes",
  },
  {
    name: "Attendance",
    icon: ClipboardCheck,
    path: "/faculty/attendance",
  },
  {
    name: "Assignments",
    icon: FileText,
    path: "/faculty/assignments",
  },
  {
    name: "Marks",
    icon: BarChart3,
    path: "/faculty/marks",
  },
  {
    name: "Resources",
    icon: BookOpen,
    path: "/faculty/resources",
  },
  {
    name: "Announcements",
    icon: Megaphone,
    path: "/faculty/announcements",
  },
];

function FacultyLayout() {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <aside className="sidebar faculty-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <GraduationCap size={26} />
          </div>

          <div>
            <h2>JIT</h2>
            <span>Super App</span>
          </div>
        </div>

        <p className="sidebar-label">FACULTY PORTAL</p>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/faculty"}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => navigate("/login")}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <section className="app-main">
        <header className="topbar">
          <div className="global-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search students, classes, assignments..."
            />
          </div>

          <div className="topbar-actions">
            <button className="icon-button">
              <Bell size={20} />
              <span className="notification-dot" />
            </button>

            <div className="user-menu">
              <div className="avatar">FA</div>

              <div>
                <strong>Faculty</strong>
                <span>CSE Department</span>
              </div>
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </section>
    </div>
  );
}

export default FacultyLayout;