import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  LogOut,
  Hexagon,
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  Megaphone,
  ShieldCheck,
} from "lucide-react";

export default function DashboardLayout({
  portalLabel,
  navigation = [],
  userName,
  userRole,
  children,
}) {
  const navigate = useNavigate();

  // Automatically add Notifications to Admin sidebar
  const finalNavigation =
    portalLabel === "ADMIN PORTAL"
      ? [
          ...navigation.filter(
            (item) => item.path !== "/admin/notifications"
          ),
          {
            name: "Notifications",
            icon: Bell,
            path: "/admin/notifications",
          },
        ]
      : navigation;

  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <Hexagon className="sidebar-logo" size={28} />
          <span>JIT Super App</span>
        </div>

        <div className="sidebar-label">
          {portalLabel}
        </div>

        <nav className="sidebar-nav">

          {finalNavigation.map((item, index) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path || index}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
                end={
                  item.path === "/admin" ||
                  item.path === "/hod"
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

        </nav>

        <div className="sidebar-footer">

          <button
            className="nav-item text-danger"
            onClick={() => navigate("/login")}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "var(--danger)",
              fontWeight: "500",
            }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="app-main">

        {/* TOPBAR */}
        <header
          className="topbar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 32px",
            background: "var(--surface)",
            borderBottom: "1px solid var(--border)",
          }}
        >

          <div
            className="topbar-search"
            style={{
              position: "relative",
              width: "300px",
            }}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-light)",
              }}
            />

            <input
              type="text"
              placeholder="Search..."
              style={{
                width: "100%",
                padding: "10px 10px 10px 40px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                outline: "none",
                fontSize: "14px",
                background: "var(--background)",
              }}
            />
          </div>

          <div
            className="topbar-actions"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
            }}
          >

            <button
              className="notification-btn"
              onClick={() =>
                portalLabel === "ADMIN PORTAL"
                  ? navigate("/admin/notifications")
                  : null
              }
              style={{
                position: "relative",
                background: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-light)",
              }}
            >
              <Bell size={20} />

              <span
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  background: "var(--danger)",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  border: "2px solid var(--surface)",
                }}
              />
            </button>

            <div
              className="user-profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                paddingLeft: "24px",
                borderLeft: "1px solid var(--border)",
              }}
            >

              <div
                className="user-info"
                style={{
                  textAlign: "right",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    color: "var(--text)",
                  }}
                >
                  {userName}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-light)",
                    marginTop: "2px",
                  }}
                >
                  {userRole}
                </div>
              </div>

              <div
                className="user-avatar"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "var(--primary)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                {userName?.charAt(0) || "A"}
              </div>

            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <div
          className="page-content"
          style={{
            padding: "32px",
            background: "var(--background)",
            minHeight: "calc(100vh - 73px)",
            overflowY: "auto",
          }}
        >
          {children}
        </div>

      </main>

    </div>
  );
}