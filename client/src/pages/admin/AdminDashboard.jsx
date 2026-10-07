  import React, { useEffect, useMemo, useState } from "react";
  import DashboardLayout from "../../layouts/DashboardLayout";
  import "./AdminDashboard.css";

  import {
    ShieldAlert,
    Users,
    Building2,
    UserCog,
    Activity,
    Search,
    MoreVertical,
    Bell,
    Settings,
    Database,
    AlertCircle,
    RefreshCw,
    Loader2,
    UserCheck,
    UserX,
    Eye,
    X,
    CheckCircle2,
    AlertTriangle,
  } from "lucide-react";

  import api from "../../services/api";

  // =========================================================
  // ADMIN NAVIGATION
  // =========================================================

  const navigation = [
    {
      name: "Dashboard",
      icon: Activity,
      path: "/admin",
    },
    {
      name: "User Management",
      icon: Users,
      path: "/admin/users",
    },
    {
      name: "Departments",
      icon: Building2,
      path: "/admin/departments",
    },
    {
      name: "System Settings",
      icon: Settings,
      path: "/admin/settings",
    },
    {
      name: "Announcements",
      icon: Bell,
      path: "/admin/announcements",
    },
    {
      name: "Security Logs",
      icon: ShieldAlert,
      path: "/admin/security",
    },
    {
      name: "Notifications",
      icon: Bell,
      path: "/admin/notifications",
    },
  ];

  // =========================================================
  // HELPERS
  // =========================================================

  const normalizeRole = (role) => {
    return String(role || "")
      .trim()
      .toLowerCase();
  };

  const normalizeDepartment = (department) => {
    if (!department) return "";

    return String(department)
      .trim()
      .toUpperCase();
  };

  // Students use branch.
  // Faculty/HOD use department.
  const getUserDepartment = (user) => {
    const role = normalizeRole(user?.role);

    if (role === "student") {
      return normalizeDepartment(
        user?.branch || user?.department
      );
    }

    return normalizeDepartment(
      user?.department || user?.branch
    );
  };

  const formatRole = (role) => {
    if (!role) return "-";

    const normalized = normalizeRole(role);

    return (
      normalized.charAt(0).toUpperCase() +
      normalized.slice(1)
    );
  };

  const formatLastLogin = (date) => {
    if (!date) {
      return "Never";
    }

    const loginDate = new Date(date);

    if (Number.isNaN(loginDate.getTime())) {
      return "Never";
    }

    return loginDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // =========================================================
  // GET CURRENT LOGGED-IN USER
  // =========================================================

  const getCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem("jit_user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error(
        "Unable to read logged-in user:",
        error
      );

      return null;
    }
  };

  // =========================================================
  // COMPONENT
  // =========================================================

  export default function AdminDashboard() {
    // -------------------------------------------------------
    // USERS
    // -------------------------------------------------------

    const [users, setUsers] = useState([]);

    // -------------------------------------------------------
    // SEARCH / FILTER
    // -------------------------------------------------------

    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("All");

    // -------------------------------------------------------
    // LOADING
    // -------------------------------------------------------

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // -------------------------------------------------------
    // ERROR
    // -------------------------------------------------------

    const [error, setError] = useState("");

    // -------------------------------------------------------
    // ACTION MENU
    // -------------------------------------------------------

    const [openMenuId, setOpenMenuId] = useState(null);

    // -------------------------------------------------------
    // SELECTED USER
    // -------------------------------------------------------

    const [selectedUser, setSelectedUser] = useState(null);

    // -------------------------------------------------------
    // CONFIRMATION MODAL
    // -------------------------------------------------------

    const [confirmModal, setConfirmModal] = useState({
      open: false,
      user: null,
      action: null,
    });

    // -------------------------------------------------------
    // STATUS UPDATE
    // -------------------------------------------------------

    const [updatingUserId, setUpdatingUserId] =
      useState(null);

    // -------------------------------------------------------
    // TOAST
    // -------------------------------------------------------

    const [toast, setToast] = useState({
      visible: false,
      type: "",
      message: "",
    });

    // =========================================================
    // TOAST
    // =========================================================

    const showToast = (type, message) => {
      setToast({
        visible: true,
        type,
        message,
      });

      setTimeout(() => {
        setToast({
          visible: false,
          type: "",
          message: "",
        });
      }, 3500);
    };

    // =========================================================
    // LOAD USERS
    // =========================================================

    const loadUsers = async (refresh = false) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await api.get(
          "/admin/users"
        );

        const serverUsers =
          response.data?.data || [];

        setUsers(serverUsers);
      } catch (err) {
        console.error(
          "Admin dashboard users error:",
          err
        );

        const message =
          err.response?.data?.message ||
          "Unable to load users from the server.";

        setError(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
      loadUsers();
    }, []);

    // =========================================================
    // CLOSE MENU WHEN CLICKING OUTSIDE
    // =========================================================

    useEffect(() => {
      const handleDocumentClick = () => {
        setOpenMenuId(null);
      };

      document.addEventListener(
        "click",
        handleDocumentClick
      );

      return () => {
        document.removeEventListener(
          "click",
          handleDocumentClick
        );
      };
    }, []);

    // =========================================================
    // USER STATISTICS
    // =========================================================

    const totalUsers = users.length;

    const totalStudents = users.filter(
      (user) =>
        normalizeRole(user.role) === "student"
    ).length;

    const totalFaculty = users.filter(
      (user) =>
        normalizeRole(user.role) === "faculty"
    ).length;

    const totalHODs = users.filter(
      (user) =>
        normalizeRole(user.role) === "hod"
    ).length;

    const totalAdmins = users.filter(
      (user) =>
        normalizeRole(user.role) === "admin"
    ).length;

    const activeUsers = users.filter(
      (user) => user.isActive !== false
    ).length;

    // =========================================================
    // DEPARTMENT OVERVIEW
    // =========================================================

    const departments = useMemo(() => {
      const departmentMap = {};

      users.forEach((user) => {
        const role = normalizeRole(user.role);

        const department =
          getUserDepartment(user);

        if (!department) {
          return;
        }

        if (!departmentMap[department]) {
          departmentMap[department] = {
            name: department,
            students: 0,
            faculty: 0,
            hod: "-",
          };
        }

        if (role === "student") {
          departmentMap[department].students += 1;
        }

        if (role === "faculty") {
          departmentMap[department].faculty += 1;
        }

        if (role === "hod") {
          departmentMap[department].hod =
            user.name || "-";
        }
      });

      return Object.values(departmentMap).sort(
        (a, b) =>
          a.name.localeCompare(b.name)
      );
    }, [users]);

    // =========================================================
    // SEARCH + ROLE FILTER
    // =========================================================

    const filteredUsers = useMemo(() => {
      const searchText = search
        .trim()
        .toLowerCase();

      return users.filter((user) => {
        const role = normalizeRole(user.role);

        const identifier =
          user.usn ||
          user.email ||
          "";

        const department =
          getUserDepartment(user);

        const name =
          user.name || "";

        const matchesSearch =
          !searchText ||
          name
            .toLowerCase()
            .includes(searchText) ||
          identifier
            .toLowerCase()
            .includes(searchText) ||
          department
            .toLowerCase()
            .includes(searchText);

        const matchesRole =
          filterRole === "All" ||
          role ===
            filterRole.toLowerCase();

        return (
          matchesSearch &&
          matchesRole
        );
      });
    }, [
      users,
      search,
      filterRole,
    ]);

    // =========================================================
    // USER DETAILS
    // =========================================================

    const handleUserDetails = (user) => {
      setOpenMenuId(null);
      setSelectedUser(user);
    };

    // =========================================================
    // OPEN STATUS CONFIRMATION
    // =========================================================

    const openStatusConfirmation = (
      user
    ) => {
      setOpenMenuId(null);

      const currentUser =
        getCurrentUser();

      /*
      * Prevent the logged-in admin from
      * disabling their own account.
      */

      const currentUserId =
        currentUser?._id ||
        currentUser?.id;

      const selectedUserId =
        user?._id ||
        user?.id;

      if (
        currentUserId &&
        selectedUserId &&
        String(currentUserId) ===
          String(selectedUserId)
      ) {
        showToast(
          "error",
          "You cannot deactivate your own account."
        );

        return;
      }

      const currentlyActive =
        user.isActive !== false;

      setConfirmModal({
        open: true,
        user,
        action: currentlyActive
          ? "deactivate"
          : "activate",
      });
    };

    // =========================================================
    // CLOSE STATUS CONFIRMATION
    // =========================================================

    const closeConfirmation = () => {
      if (updatingUserId) {
        return;
      }

      setConfirmModal({
        open: false,
        user: null,
        action: null,
      });
    };

    // =========================================================
    // UPDATE USER STATUS
    // =========================================================

    const updateUserStatus = async () => {
      const user =
        confirmModal.user;

      if (!user) {
        return;
      }

      const userId =
        user._id ||
        user.id;

      if (!userId) {
        showToast(
          "error",
          "Unable to identify this user."
        );

        return;
      }

      const newStatus =
        confirmModal.action ===
        "activate";

      try {
        setUpdatingUserId(userId);
        setError("");

        const response =
          await api.put(
            `/admin/users/${userId}/status`,
            {
              isActive: newStatus,
            }
          );

        const updatedUser =
          response.data?.data;

        /*
        * Update the user directly in
        * local state so the UI changes
        * immediately.
        */

        setUsers((currentUsers) =>
          currentUsers.map(
            (currentUser) => {
              const currentId =
                currentUser._id ||
                currentUser.id;

              if (
                String(currentId) ===
                String(userId)
              ) {
                return (
                  updatedUser || {
                    ...currentUser,
                    isActive:
                      newStatus,
                  }
                );
              }

              return currentUser;
            }
          )
        );

        setConfirmModal({
          open: false,
          user: null,
          action: null,
        });

        showToast(
          "success",
          `${user.name} has been ${
            newStatus
              ? "activated"
              : "deactivated"
          } successfully.`
        );
      } catch (err) {
        console.error(
          "Update user status error:",
          err
        );

        showToast(
          "error",
          err.response?.data?.message ||
            "Unable to update user status."
        );
      } finally {
        setUpdatingUserId(null);
      }
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
      return (
        <DashboardLayout
          portalLabel="ADMIN PORTAL"
          navigation={navigation}
          userName="System Admin"
          userRole="Super Administrator"
        >
          <div className="admin-loading">
            <Loader2
              size={34}
              className="animate-spin"
            />

            <strong>
              Loading Admin Dashboard...
            </strong>

            <span className="text-muted">
              Fetching data from MongoDB
            </span>
          </div>
        </DashboardLayout>
      );
    }

    // =========================================================
    // DASHBOARD
    // =========================================================

    return (
      <DashboardLayout
        portalLabel="ADMIN PORTAL"
        navigation={navigation}
        userName="System Admin"
        userRole="Super Administrator"
      >
        <div
          className="admin-dashboard"
          onClick={() =>
            setOpenMenuId(null)
          }
        >

          {/* =====================================================
              WELCOME
          ====================================================== */}

          <section className="admin-welcome">
            <div className="admin-welcome-content">
              <h1 className="admin-welcome-title">
                System Administration
              </h1>

              <p className="admin-welcome-subtitle">
                Jyothy Institute of Technology -
                Super App Central Command
              </p>
            </div>

            <div className="admin-welcome-badges">
              <span className="badge-danger">
                Super Admin Access
              </span>

              <span className="badge-success">
                System Status: Online
              </span>
            </div>
          </section>

          {/* =====================================================
              ERROR
          ====================================================== */}

          {error && (
            <div className="admin-error">
              <AlertCircle size={18} />

              <span>{error}</span>

              <button
                onClick={() =>
                  loadUsers()
                }
              >
                Retry
              </button>
            </div>
          )}

          {/* =====================================================
              STATS
          ====================================================== */}

          <section className="admin-stats-grid">

            {[
              {
                label: "Total Users",
                value: totalUsers,
                icon: Users,
                color: "primary",
              },
              {
                label: "Total Students",
                value: totalStudents,
                icon: UserCog,
                color: "secondary",
              },
              {
                label: "Total Faculty",
                value: totalFaculty,
                icon: ShieldAlert,
                color: "warning",
              },
              {
                label: "Active HODs",
                value: totalHODs,
                icon: Building2,
                color: "success",
              },
              {
                label: "Departments",
                value: departments.length,
                icon: Database,
                color: "danger",
              },
              {
                label: "Active Users",
                value: activeUsers,
                icon: Activity,
                color: "primary",
              },
            ].map(
              (stat, index) => {
                const Icon =
                  stat.icon;

                return (
                  <div
                    key={index}
                    className="admin-stat-card"
                  >
                    <div className="admin-stat-header">
                      <div
                        className={`admin-stat-icon bg-${stat.color}-light text-${stat.color}`}
                      >
                        <Icon size={22} />
                      </div>
                    </div>

                    <div className="admin-stat-value">
                      {stat.value}
                    </div>

                    <div className="admin-stat-label">
                      {stat.label}
                    </div>
                  </div>
                );
              }
            )}

          </section>

          {/* =====================================================
              USER MANAGEMENT
          ====================================================== */}

          <section className="admin-panel">

            <div className="admin-panel-header">

              <div>
                <h2 className="admin-panel-title">
                  User Management
                </h2>

                <p className="admin-panel-desc">
                  Live users from the system database
                </p>
              </div>

              <div className="admin-panel-actions">

                <div className="admin-search-box">
                  <Search size={16} />

                  <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  />
                </div>

                <select
                  className="admin-filter-select"
                  value={filterRole}
                  onChange={(event) =>
                    setFilterRole(
                      event.target.value
                    )
                  }
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  <option value="All">
                    All Roles
                  </option>

                  <option value="student">
                    Students
                  </option>

                  <option value="faculty">
                    Faculty
                  </option>

                  <option value="hod">
                    HODs
                  </option>

                  <option value="admin">
                    Admins
                  </option>
                </select>

                <button
                  className="icon-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    loadUsers(true);
                  }}
                  disabled={refreshing}
                  title="Refresh"
                >
                  <RefreshCw
                    size={16}
                    className={
                      refreshing
                        ? "animate-spin"
                        : ""
                    }
                  />
                </button>

              </div>
            </div>

            {/* =================================================
                USER TABLE
            ================================================== */}

            <div className="admin-table-container">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Identifier</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(
                      (user) => {

                        const role =
                          normalizeRole(
                            user.role
                          );

                        const isActive =
                          user.isActive !== false;

                        const identifier =
                          user.usn ||
                          user.email ||
                          "-";

                        const department =
                          getUserDepartment(
                            user
                          );

                        const userId =
                          user._id ||
                          user.id;

                        return (
                          <tr
                            key={userId}
                          >

                            {/* NAME */}

                            <td className="font-medium text-dark">

                              <div className="admin-user-cell">

                                <div className="admin-user-avatar">
                                  {user.name
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                                </div>

                                <span>
                                  {user.name ||
                                    "-"}
                                </span>

                              </div>

                            </td>

                            {/* IDENTIFIER */}

                            <td className="text-muted">
                              {identifier}
                            </td>

                            {/* ROLE */}

                            <td>

                              <span
                                className={`role-badge role-${role}`}
                              >
                                {formatRole(role)}
                              </span>

                            </td>

                            {/* DEPARTMENT */}

                            <td>
                              {department ||
                                "-"}
                            </td>

                            {/* STATUS */}

                            <td>

                              <span
                                className={`status-dot ${
                                  isActive
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              />

                              {isActive
                                ? "Active"
                                : "Inactive"}

                            </td>

                            {/* LAST LOGIN */}

                            <td className="text-muted">
                              {formatLastLogin(
                                user.lastLogin
                              )}
                            </td>

                            {/* ACTION */}

                            <td>

                              <div
                                className="admin-action-wrapper"
                                onClick={(event) =>
                                  event.stopPropagation()
                                }
                              >

                                <button
                                  className="icon-btn admin-more-btn"
                                  onClick={() =>
                                    setOpenMenuId(
                                      openMenuId ===
                                        userId
                                        ? null
                                        : userId
                                    )
                                  }
                                  title="User actions"
                                >
                                  <MoreVertical
                                    size={17}
                                  />
                                </button>

                                {openMenuId ===
                                  userId && (

                                  <div className="admin-action-menu">

                                    {/* VIEW */}

                                    <button
                                      className="admin-action-menu-item"
                                      onClick={() =>
                                        handleUserDetails(
                                          user
                                        )
                                      }
                                    >
                                      <Eye
                                        size={16}
                                      />

                                      <span>
                                        View Details
                                      </span>
                                    </button>

                                    <div className="admin-action-divider" />

                                    {/* STATUS */}

                                    <button
                                      className={`admin-action-menu-item ${
                                        isActive
                                          ? "danger-action"
                                          : "success-action"
                                      }`}
                                      onClick={() =>
                                        openStatusConfirmation(
                                          user
                                        )
                                      }
                                    >

                                      {isActive ? (
                                        <UserX
                                          size={16}
                                        />
                                      ) : (
                                        <UserCheck
                                          size={16}
                                        />
                                      )}

                                      <span>
                                        {isActive
                                          ? "Deactivate User"
                                          : "Activate User"}
                                      </span>

                                    </button>

                                  </div>
                                )}

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )
                  ) : (

                    <tr>
                      <td
                        colSpan="7"
                        className="admin-empty-state"
                      >
                        <Users
                          size={30}
                        />

                        <strong>
                          No users found
                        </strong>

                        <span>
                          Try changing your search
                          or role filter.
                        </span>
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            {/* FOOTER */}

            <div className="admin-users-footer">
              Showing{" "}
              <strong>
                {filteredUsers.length}
              </strong>{" "}
              of{" "}
              <strong>
                {users.length}
              </strong>{" "}
              users
            </div>

          </section>

          {/* =====================================================
              LOWER GRID
          ====================================================== */}

          <div className="admin-grid-layout">

            {/* ===================================================
                DEPARTMENT OVERVIEW
            ==================================================== */}

            <div className="admin-col-left">

              <section className="admin-panel">

                <div className="admin-panel-header">
                  <h2 className="admin-panel-title">
                    Department Overview
                  </h2>
                </div>

                <div className="admin-dept-grid">

                  {departments.length > 0 ? (
                    departments.map(
                      (dept) => (

                        <div
                          key={dept.name}
                          className="admin-dept-card"
                        >

                          <h3 className="admin-dept-name">
                            {dept.name}
                          </h3>

                          <div className="admin-dept-hod">
                            HOD:{" "}
                            <strong>
                              {dept.hod || "-"}
                            </strong>
                          </div>

                          <div className="admin-dept-stats">

                            <div className="dept-stat">
                              <span className="stat-val">
                                {dept.students}
                              </span>

                              <span className="stat-lbl">
                                Students
                              </span>
                            </div>

                            <div className="dept-stat">
                              <span className="stat-val">
                                {dept.faculty}
                              </span>

                              <span className="stat-lbl">
                                Faculty
                              </span>
                            </div>

                          </div>

                        </div>

                      )
                    )
                  ) : (

                    <p className="text-muted">
                      No department data available.
                    </p>

                  )}

                </div>

              </section>

            </div>

            {/* ===================================================
                RIGHT SIDE
            ==================================================== */}

            <div className="admin-col-right">

              {/* SYSTEM ANNOUNCEMENTS */}

              <section className="admin-panel mb-24">

                <div className="admin-panel-header">

                  <h2 className="admin-panel-title">
                    System Announcements
                  </h2>

                  <button
                    className="admin-btn-primary"
                    onClick={() =>
                      showToast(
                        "info",
                        "Announcement management is available from the Announcements module."
                      )
                    }
                  >
                    New Alert
                  </button>

                </div>

                <div className="admin-announcement-list">

                  <div className="announcement-item">

                    <div className="announcement-icon bg-warning-light text-warning">
                      <AlertCircle
                        size={18}
                      />
                    </div>

                    <div className="announcement-content">

                      <h4>
                        System Data Connected
                      </h4>

                      <p>
                        Dashboard is now reading
                        users from MongoDB.
                      </p>

                    </div>

                  </div>

                  <div className="announcement-item">

                    <div className="announcement-icon bg-primary-light text-primary">
                      <Bell
                        size={18}
                      />
                    </div>

                    <div className="announcement-content">

                      <h4>
                        Admin Portal
                      </h4>

                      <p>
                        User management is
                        connected to the backend.
                      </p>

                    </div>

                  </div>

                </div>

              </section>

              {/* SYSTEM OVERVIEW */}

              <section className="admin-panel">

                <div className="admin-panel-header">

                  <h2 className="admin-panel-title">
                    System Overview
                  </h2>

                </div>

                <div className="admin-timeline">

                  <div className="timeline-item">

                    <div className="timeline-dot type-system" />

                    <div className="timeline-content">

                      <div className="timeline-event">
                        Database Connected
                      </div>

                      <div className="timeline-time">
                        MongoDB is providing live
                        user data
                      </div>

                    </div>

                  </div>

                  <div className="timeline-item">

                    <div className="timeline-dot type-user" />

                    <div className="timeline-content">

                      <div className="timeline-event">
                        User Records Loaded
                      </div>

                      <div className="timeline-time">
                        {totalUsers} users currently
                        available
                      </div>

                    </div>

                  </div>

                  <div className="timeline-item">

                    <div className="timeline-dot type-data" />

                    <div className="timeline-content">

                      <div className="timeline-event">
                        Active Accounts
                      </div>

                      <div className="timeline-time">
                        {activeUsers} active accounts
                      </div>

                    </div>

                  </div>

                  <div className="timeline-item">

                    <div className="timeline-dot type-alert" />

                    <div className="timeline-content">

                      <div className="timeline-event">
                        Administrators
                      </div>

                      <div className="timeline-time">
                        {totalAdmins} admin account
                        {totalAdmins !== 1
                          ? "s"
                          : ""}
                      </div>

                    </div>

                  </div>

                </div>

              </section>

            </div>

          </div>

        </div>

        {/* =======================================================
            USER DETAILS MODAL
        ======================================================== */}

        {selectedUser && (

          <div
            className="admin-modal-overlay"
            onClick={() =>
              setSelectedUser(null)
            }
          >

            <div
              className="admin-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="admin-modal-header">

                <div>
                  <h3>
                    User Details
                  </h3>

                  <p>
                    Complete account information
                  </p>
                </div>

                <button
                  className="admin-modal-close"
                  onClick={() =>
                    setSelectedUser(null)
                  }
                >
                  <X size={19} />
                </button>

              </div>

              <div className="admin-modal-user">

                <div className="admin-modal-avatar">
                  {selectedUser.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                <div>
                  <strong>
                    {selectedUser.name}
                  </strong>

                  <span>
                    {formatRole(
                      selectedUser.role
                    )}
                  </span>
                </div>

              </div>

              <div className="admin-details-grid">

                <div>
                  <label>
                    Email
                  </label>

                  <strong>
                    {selectedUser.email ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <label>
                    USN
                  </label>

                  <strong>
                    {selectedUser.usn ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <label>
                    Department
                  </label>

                  <strong>
                    {getUserDepartment(
                      selectedUser
                    ) || "-"}
                  </strong>
                </div>

                <div>
                  <label>
                    Semester
                  </label>

                  <strong>
                    {selectedUser.semester ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <label>
                    Status
                  </label>

                  <strong>
                    {selectedUser.isActive !==
                    false
                      ? "Active"
                      : "Inactive"}
                  </strong>
                </div>

                <div>
                  <label>
                    Last Login
                  </label>

                  <strong>
                    {formatLastLogin(
                      selectedUser.lastLogin
                    )}
                  </strong>
                </div>

              </div>

              <div className="admin-modal-footer">

                <button
                  className="admin-modal-secondary"
                  onClick={() =>
                    setSelectedUser(null)
                  }
                >
                  Close
                </button>

                <button
                  className={
                    selectedUser.isActive !==
                    false
                      ? "admin-modal-danger"
                      : "admin-modal-success"
                  }
                  onClick={() => {
                    const user =
                      selectedUser;

                    setSelectedUser(null);

                    openStatusConfirmation(
                      user
                    );
                  }}
                >
                  {selectedUser.isActive !==
                  false
                    ? "Deactivate User"
                    : "Activate User"}
                </button>

              </div>

            </div>

          </div>

        )}

        {/* =======================================================
            CONFIRM STATUS MODAL
        ======================================================== */}

        {confirmModal.open &&
          confirmModal.user && (

            <div
              className="admin-modal-overlay"
              onClick={closeConfirmation}
            >

              <div
                className="admin-confirm-modal"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >

                <div
                  className={`admin-confirm-icon ${
                    confirmModal.action ===
                    "activate"
                      ? "confirm-success"
                      : "confirm-danger"
                  }`}
                >

                  {confirmModal.action ===
                  "activate" ? (
                    <UserCheck
                      size={24}
                    />
                  ) : (
                    <AlertTriangle
                      size={24}
                    />
                  )}

                </div>

                <h3>
                  {confirmModal.action ===
                  "activate"
                    ? "Activate User?"
                    : "Deactivate User?"}
                </h3>

                <p>
                  Are you sure you want to{" "}
                  <strong>
                    {confirmModal.action ===
                    "activate"
                      ? "activate"
                      : "deactivate"}
                  </strong>{" "}
                  <strong>
                    {confirmModal.user.name}
                  </strong>
                  ?
                </p>

                {confirmModal.action ===
                  "deactivate" && (

                  <div className="admin-warning-box">
                    <AlertTriangle
                      size={17}
                    />

                    <span>
                      This user will no longer be
                      able to use their account
                      while it is inactive.
                    </span>
                  </div>

                )}

                <div className="admin-confirm-actions">

                  <button
                    className="admin-modal-secondary"
                    onClick={
                      closeConfirmation
                    }
                    disabled={
                      Boolean(
                        updatingUserId
                      )
                    }
                  >
                    Cancel
                  </button>

                  <button
                    className={
                      confirmModal.action ===
                      "activate"
                        ? "admin-modal-success"
                        : "admin-modal-danger"
                    }
                    onClick={
                      updateUserStatus
                    }
                    disabled={
                      Boolean(
                        updatingUserId
                      )
                    }
                  >

                    {updatingUserId ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />

                        Updating...
                      </>
                    ) : (
                      <>
                        {confirmModal.action ===
                        "activate" ? (
                          <UserCheck
                            size={16}
                          />
                        ) : (
                          <UserX
                            size={16}
                          />
                        )}

                        {confirmModal.action ===
                        "activate"
                          ? "Activate User"
                          : "Deactivate User"}
                      </>
                    )}

                  </button>

                </div>

              </div>

            </div>
          )}

        {/* =======================================================
            TOAST
        ======================================================== */}

        {toast.visible && (

          <div
            className={`admin-toast toast-${toast.type}`}
          >

            <div className="admin-toast-icon">

              {toast.type ===
              "success" ? (
                <CheckCircle2
                  size={19}
                />
              ) : toast.type ===
                "error" ? (
                <AlertCircle
                  size={19}
                />
              ) : (
                <AlertCircle
                  size={19}
                />
              )}

            </div>

            <span>
              {toast.message}
            </span>

            <button
              onClick={() =>
                setToast({
                  visible: false,
                  type: "",
                  message: "",
                })
              }
            >
              <X size={15} />
            </button>

          </div>

        )}
 
      </DashboardLayout>
    );
  }