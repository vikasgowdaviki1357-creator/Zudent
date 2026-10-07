import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  ShoppingBag,
  BriefcaseBusiness,
  CalendarDays,
  Building2,
  Bot,
  UserRound,
  Bell,
  Search,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Home", icon: LayoutDashboard, path: "/student" },
  { name: "Academics", icon: GraduationCap, path: "/student/academics" },
  { name: "Resources", icon: BookOpen, path: "/student/resources" },
  { name: "Marketplace", icon: ShoppingBag, path: "/student/marketplace" },
  { name: "Placements", icon: BriefcaseBusiness, path: "/student/placements" },
  { name: "Events", icon: CalendarDays, path: "/student/events" },
  { name: "Campus", icon: Building2, path: "/student/campus" },
  { name: "AI Assistant", icon: Bot, path: "/student/ai-assistant" },
  { name: "Profile", icon: UserRound, path: "/student/profile" },
];

function StudentLayout() {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <GraduationCap size={26} />
          </div>

          <div>
            <h2>JIT</h2>
            <span>Super App</span>
          </div>
        </div>

        <p className="sidebar-label">STUDENT PORTAL</p>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/student"}
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
              placeholder="Search resources, events, notices..."
            />
          </div>

          <div className="topbar-actions">
            <button className="icon-button">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>

            <div className="user-menu">
              <div className="avatar">VG</div>

              <div>
                <strong>Vikas Gowda</strong>
                <span>Student</span>
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

export default StudentLayout;