import { useEffect, useMemo, useState } from "react";

import {
  Users,
  Search,
  Filter,
  Plus,
  UserCheck,
  UserX,
  Pencil,
  Trash2,
  Loader2,
  RefreshCw,
  AlertCircle,
  X,
  Save,
  Eye,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

import "./UserManagement.css";

const navigation = [
  {
    name: "Dashboard",
    icon: Users,
    path: "/admin",
  },
  {
    name: "User Management",
    icon: Users,
    path: "/admin/users",
  },
  {
    name: "Departments",
    icon: Users,
    path: "/admin/departments",
  },
  {
    name: "System Settings",
    icon: Users,
    path: "/admin/settings",
  },
  {
    name: "Announcements",
    icon: Users,
    path: "/admin/announcements",
  },
  {
    name: "Security Logs",
    icon: Users,
    path: "/admin/security",
  },
];

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "student",
  usn: "",
  phone: "",
  branch: "",
  semester: "",
  admissionYear: "",
  designation: "",
  department: "",
};

function UserManagement() {
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [department, setDepartment] = useState("All");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [saving, setSaving] = useState(false);
  const [actionUserId, setActionUserId] = useState(null);

  // =========================================================
  // LOAD USERS
  // =========================================================

  const loadUsers = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/admin/users");

      setUsers(response.data?.data || []);
    } catch (err) {
      console.error("Failed to load users:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load users from the server."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // =========================================================
  // DEPARTMENTS
  // =========================================================

  const departments = useMemo(() => {
    const values = users
      .map((user) => user.department || user.branch)
      .filter(Boolean);

    return [...new Set(values)].sort();
  }, [users]);

  // =========================================================
  // FILTER USERS
  // =========================================================

  const filteredUsers = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return users.filter((user) => {
      const userRole =
        String(user.role || "").toLowerCase();

      const userDepartment =
        user.department ||
        user.branch ||
        "";

      const matchesSearch =
        !searchText ||
        String(user.name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(user.email || "")
          .toLowerCase()
          .includes(searchText) ||
        String(user.usn || "")
          .toLowerCase()
          .includes(searchText) ||
        String(userDepartment)
          .toLowerCase()
          .includes(searchText);

      const matchesRole =
        role === "All" ||
        userRole === role.toLowerCase();

      const matchesDepartment =
        department === "All" ||
        userDepartment === department;

      return (
        matchesSearch &&
        matchesRole &&
        matchesDepartment
      );
    });
  }, [
    users,
    search,
    role,
    department,
  ]);

  // =========================================================
  // COUNTS
  // =========================================================

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.isActive !== false
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.isActive === false
  ).length;

  // =========================================================
  // HELPERS
  // =========================================================

  const formatRole = (userRole) => {
    if (!userRole) return "-";

    return (
      userRole.charAt(0).toUpperCase() +
      userRole.slice(1)
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

  const getUserId = (user) => {
    return user?._id || user?.id;
  };

  // =========================================================
  // FORM HANDLING
  // =========================================================

  const openCreateForm = () => {
    setEditingUser(null);
    setForm({
      ...emptyForm,
    });

    setError("");
    setSuccess("");

    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);

    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "student",
      usn: user.usn || "",
      phone: user.phone || "",
      branch: user.branch || "",
      semester: user.semester || "",
      admissionYear: user.admissionYear || "",
      designation: user.designation || "",
      department: user.department || "",
    });

    setError("");
    setSuccess("");

    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingUser(null);
    setForm({
      ...emptyForm,
    });
  };

  const handleFormChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  // =========================================================
  // SAVE USER
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    setError("");
    setSuccess("");

    const cleanName = form.name.trim();
    const cleanEmail =
      form.email.trim().toLowerCase();

    if (!cleanName) {
      setError("Name is required.");
      return;
    }

    if (!cleanEmail) {
      setError("Email is required.");
      return;
    }

    if (!form.role) {
      setError("Role is required.");
      return;
    }

    if (!editingUser && !form.password) {
      setError(
        "Password is required when creating a user."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: cleanName,
        email: cleanEmail,
        role: form.role,
        usn: form.usn.trim(),
        phone: form.phone.trim(),
        branch: form.branch.trim(),
        semester: form.semester
          ? Number(form.semester)
          : undefined,
        admissionYear: form.admissionYear
          ? Number(form.admissionYear)
          : undefined,
        designation:
          form.designation.trim(),
        department:
          form.department.trim(),
      };

      if (form.password.trim()) {
        payload.password =
          form.password.trim();
      }

      let response;

      if (editingUser) {
        const userId =
          getUserId(editingUser);

        response = await api.put(
          `/admin/users/${userId}`,
          payload
        );
      } else {
        response = await api.post(
          "/admin/users",
          payload
        );
      }

      const savedUser =
        response.data?.data;

      if (editingUser) {
        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            String(getUserId(user)) ===
            String(getUserId(editingUser))
              ? savedUser || {
                  ...user,
                  ...payload,
                }
              : user
          )
        );

        setSuccess(
          "User updated successfully."
        );
      } else {
        setUsers((currentUsers) => [
          savedUser,
          ...currentUsers,
        ]);

        setSuccess(
          "User created successfully."
        );
      }

      setShowForm(false);
      setEditingUser(null);
      setForm({
        ...emptyForm,
      });
    } catch (err) {
      console.error(
        "Failed to save user:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to save user."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  const handleToggleStatus = async (user) => {
    const userId = getUserId(user);

    if (!userId) {
      setError(
        "Unable to identify this user."
      );
      return;
    }

    const currentStatus =
      user.isActive !== false;

    const newStatus =
      !currentStatus;

    const actionText = newStatus
      ? "activate"
      : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionUserId(userId);
      setError("");
      setSuccess("");

      const response = await api.put(
        `/admin/users/${userId}/status`,
        {
          isActive: newStatus,
        }
      );

      const updatedUser =
        response.data?.data;

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          String(
            getUserId(currentUser)
          ) === String(userId)
            ? updatedUser || {
                ...currentUser,
                isActive: newStatus,
              }
            : currentUser
        )
      );

      setSuccess(
        `${user.name} has been ${
          newStatus
            ? "activated"
            : "deactivated"
        } successfully.`
      );
    } catch (err) {
      console.error(
        "Failed to update user status:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update user status."
      );
    } finally {
      setActionUserId(null);
    }
  };

  // =========================================================
  // DELETE USER
  // =========================================================

  const handleDelete = async (user) => {
    const userId = getUserId(user);

    if (!userId) {
      setError(
        "Unable to identify this user."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${user.name}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionUserId(userId);
      setError("");
      setSuccess("");

      await api.delete(
        `/admin/users/${userId}`
      );

      setUsers((currentUsers) =>
        currentUsers.filter(
          (currentUser) =>
            String(
              getUserId(currentUser)
            ) !== String(userId)
        )
      );

      setSuccess(
        `${user.name} was deleted successfully.`
      );
    } catch (err) {
      console.error(
        "Failed to delete user:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete user."
      );
    } finally {
      setActionUserId(null);
    }
  };

  // =========================================================
  // VIEW USER
  // =========================================================

  const handleView = async (user) => {
    const userId = getUserId(user);

    if (!userId) {
      setError(
        "Unable to identify this user."
      );
      return;
    }

    try {
      setActionUserId(userId);
      setError("");

      const response = await api.get(
        `/admin/users/${userId}`
      );

      setSelectedUser(
        response.data?.data || user
      );

      setShowDetails(true);
    } catch (err) {
      console.error(
        "Failed to load user details:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load user details."
      );
    } finally {
      setActionUserId(null);
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
        <div className="user-management loading-state">
          <Loader2
            size={36}
            className="animate-spin"
          />

          <strong>
            Loading users...
          </strong>

          <span>
            Fetching users from MongoDB
          </span>
        </div>
      </DashboardLayout>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <DashboardLayout
      portalLabel="ADMIN PORTAL"
      navigation={navigation}
      userName="System Admin"
      userRole="Super Administrator"
    >
      <div className="user-management">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="users-header">

          <div>
            <p className="users-eyebrow">
              ADMIN PORTAL
            </p>

            <h1>
              User Management
            </h1>

            <p>
              Manage students, faculty,
              HODs and administrators.
            </p>
          </div>

          <button
            className="add-user-btn"
            onClick={openCreateForm}
          >
            <Plus size={18} />
            Add User
          </button>

        </div>

        {/* =================================================
            ALERTS
        ================================================= */}

        {error && (
          <div className="user-alert error">
            <AlertCircle size={18} />

            <span>{error}</span>

            <button
              onClick={() =>
                setError("")
              }
            >
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className="user-alert success">
            <UserCheck size={18} />

            <span>{success}</span>

            <button
              onClick={() =>
                setSuccess("")
              }
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* =================================================
            STATS
        ================================================= */}

        <div className="user-stats">

          <div className="user-stat">

            <div className="user-stat-icon blue">
              <Users size={22} />
            </div>

            <div>
              <span>
                Total Users
              </span>

              <strong>
                {totalUsers}
              </strong>
            </div>

          </div>

          <div className="user-stat">

            <div className="user-stat-icon green">
              <UserCheck size={22} />
            </div>

            <div>
              <span>
                Active Users
              </span>

              <strong>
                {activeUsers}
              </strong>
            </div>

          </div>

          <div className="user-stat">

            <div className="user-stat-icon red">
              <UserX size={22} />
            </div>

            <div>
              <span>
                Inactive Users
              </span>

              <strong>
                {inactiveUsers}
              </strong>
            </div>

          </div>

        </div>

        {/* =================================================
            USERS PANEL
        ================================================= */}

        <div className="users-panel">

          {/* TOOLBAR */}

          <div className="users-toolbar">

            <div className="user-search">

              <Search size={19} />

              <input
                type="text"
                placeholder="Search by name, email, USN..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="user-filter">

              <Filter size={17} />

              <select
                value={role}
                onChange={(event) =>
                  setRole(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Roles
                </option>

                <option value="student">
                  Student
                </option>

                <option value="faculty">
                  Faculty
                </option>

                <option value="hod">
                  HOD
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>

            </div>

            <div className="user-filter">

              <select
                value={department}
                onChange={(event) =>
                  setDepartment(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Departments
                </option>

                {departments.map(
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

            </div>

            <button
              className="refresh-btn"
              onClick={() =>
                loadUsers(true)
              }
              disabled={refreshing}
              title="Refresh users"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "spin"
                    : ""
                }
              />
              Refresh
            </button>

          </div>

          {/* TABLE */}

          <div className="users-table-wrapper">

            <table className="users-table">

              <thead>
                <tr>
                  <th>User</th>
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

                      const userId =
                        getUserId(user);

                      const isActive =
                        user.isActive !== false;

                      const departmentName =
                        user.department ||
                        user.branch ||
                        "-";

                      const identifier =
                        user.usn ||
                        user.email ||
                        "-";

                      const isBusy =
                        actionUserId ===
                        userId;

                      return (
                        <tr
                          key={userId}
                        >

                          {/* USER */}

                          <td>

                            <div className="user-cell">

                              <div className="user-avatar">
                                {user.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "U"}
                              </div>

                              <div>
                                <strong>
                                  {user.name}
                                </strong>

                                <small>
                                  {user.email}
                                </small>
                              </div>

                            </div>

                          </td>

                          {/* IDENTIFIER */}

                          <td className="muted">
                            {identifier}
                          </td>

                          {/* ROLE */}

                          <td>

                            <span
                              className={`role-badge role-${
                                user.role
                              }`}
                            >
                              {formatRole(
                                user.role
                              )}
                            </span>

                          </td>

                          {/* DEPARTMENT */}

                          <td>
                            {departmentName}
                          </td>

                          {/* STATUS */}

                          <td>

                            <span
                              className={`user-status ${
                                isActive
                                  ? "active"
                                  : "inactive"
                              }`}
                            >
                              <span />
                              {isActive
                                ? "Active"
                                : "Inactive"}
                            </span>

                          </td>

                          {/* LAST LOGIN */}

                          <td className="muted">
                            {formatLastLogin(
                              user.lastLogin
                            )}
                          </td>

                          {/* ACTIONS */}

                          <td>

                            <div className="user-actions">

                              <button
                                title="View"
                                disabled={isBusy}
                                onClick={() =>
                                  handleView(
                                    user
                                  )
                                }
                              >
                                {isBusy ? (
                                  <Loader2
                                    size={15}
                                    className="spin"
                                  />
                                ) : (
                                  <Eye
                                    size={15}
                                  />
                                )}
                              </button>

                              <button
                                title="Edit"
                                disabled={isBusy}
                                onClick={() =>
                                  handleEdit(
                                    user
                                  )
                                }
                              >
                                <Pencil
                                  size={15}
                                />
                              </button>

                              <button
                                title={
                                  isActive
                                    ? "Deactivate"
                                    : "Activate"
                                }
                                disabled={isBusy}
                                onClick={() =>
                                  handleToggleStatus(
                                    user
                                  )
                                }
                                className={
                                  isActive
                                    ? "status-action"
                                    : "activate-action"
                                }
                              >
                                {isActive ? (
                                  <UserX
                                    size={15}
                                  />
                                ) : (
                                  <UserCheck
                                    size={15}
                                  />
                                )}
                              </button>

                              <button
                                title="Delete"
                                disabled={isBusy}
                                className="delete-action"
                                onClick={() =>
                                  handleDelete(
                                    user
                                  )
                                }
                              >
                                <Trash2
                                  size={15}
                                />
                              </button>

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
                      className="no-users"
                    >
                      <Users size={32} />

                      <strong>
                        No users found
                      </strong>

                      <span>
                        Try changing your
                        search or filters.
                      </span>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* FOOTER */}

          <div className="users-footer">
            Showing{" "}
            <strong>
              {filteredUsers.length}
            </strong>{" "}
            of{" "}
            <strong>
              {totalUsers}
            </strong>{" "}
            users
          </div>

        </div>

        {/* =================================================
            CREATE / EDIT MODAL
        ================================================= */}

        {showForm && (
          <div
            className="modal-overlay"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeForm();
              }
            }}
          >

            <div className="user-modal">

              <div className="modal-header">

                <div>
                  <h2>
                    {editingUser
                      ? "Edit User"
                      : "Add User"}
                  </h2>

                  <p>
                    {editingUser
                      ? "Update account information."
                      : "Create a new JIT user account."}
                  </p>
                </div>

                <button
                  className="modal-close"
                  onClick={closeForm}
                  disabled={saving}
                >
                  <X size={20} />
                </button>

              </div>

              <form
                className="user-form"
                onSubmit={handleSubmit}
              >

                <div className="form-grid">

                  <div className="form-group">
                    <label>
                      Full Name *
                    </label>

                    <input
                      name="name"
                      value={form.name}
                      onChange={
                        handleFormChange
                      }
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Email *
                    </label>

                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={
                        handleFormChange
                      }
                      placeholder="example@jit.edu"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Password
                      {!editingUser &&
                        " *"}
                    </label>

                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={
                        handleFormChange
                      }
                      placeholder={
                        editingUser
                          ? "Leave blank to keep current password"
                          : "Enter password"
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Role *
                    </label>

                    <select
                      name="role"
                      value={form.role}
                      onChange={
                        handleFormChange
                      }
                    >
                      <option value="student">
                        Student
                      </option>

                      <option value="faculty">
                        Faculty
                      </option>

                      <option value="hod">
                        HOD
                      </option>

                      <option value="admin">
                        Admin
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      USN
                    </label>

                    <input
                      name="usn"
                      value={form.usn}
                      onChange={
                        handleFormChange
                      }
                      placeholder="1JT22CS001"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Phone
                    </label>

                    <input
                      name="phone"
                      value={form.phone}
                      onChange={
                        handleFormChange
                      }
                      placeholder="Phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Department
                    </label>

                    <input
                      name="department"
                      value={form.department}
                      onChange={
                        handleFormChange
                      }
                      placeholder="CSE"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Branch
                    </label>

                    <input
                      name="branch"
                      value={form.branch}
                      onChange={
                        handleFormChange
                      }
                      placeholder="CSE"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Semester
                    </label>

                    <input
                      name="semester"
                      type="number"
                      min="1"
                      max="8"
                      value={form.semester}
                      onChange={
                        handleFormChange
                      }
                      placeholder="3"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Admission Year
                    </label>

                    <input
                      name="admissionYear"
                      type="number"
                      value={
                        form.admissionYear
                      }
                      onChange={
                        handleFormChange
                      }
                      placeholder="2025"
                    />
                  </div>

                  <div className="form-group form-full">
                    <label>
                      Designation
                    </label>

                    <input
                      name="designation"
                      value={
                        form.designation
                      }
                      onChange={
                        handleFormChange
                      }
                      placeholder="Professor / Student / HOD"
                    />
                  </div>

                </div>

                {error && (
                  <div className="form-error">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="modal-actions">

                  <button
                    type="button"
                    className="modal-cancel-btn"
                    onClick={closeForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="modal-save-btn"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2
                          size={16}
                          className="spin"
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        {editingUser
                          ? "Update User"
                          : "Create User"}
                      </>
                    )}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

        {/* =================================================
            VIEW USER MODAL
        ================================================= */}

        {showDetails &&
          selectedUser && (
            <div
              className="modal-overlay"
              onMouseDown={(event) => {
                if (
                  event.target ===
                  event.currentTarget
                ) {
                  setShowDetails(false);
                }
              }}
            >

              <div className="user-modal details-modal">

                <div className="modal-header">

                  <div>
                    <h2>
                      User Details
                    </h2>

                    <p>
                      Account information
                    </p>
                  </div>

                  <button
                    className="modal-close"
                    onClick={() =>
                      setShowDetails(false)
                    }
                  >
                    <X size={20} />
                  </button>

                </div>

                <div className="details-profile">

                  <div className="details-avatar">
                    {selectedUser.name
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "U"}
                  </div>

                  <div>
                    <h3>
                      {selectedUser.name}
                    </h3>

                    <p>
                      {selectedUser.email}
                    </p>

                    <span
                      className={`role-badge role-${
                        selectedUser.role
                      }`}
                    >
                      {formatRole(
                        selectedUser.role
                      )}
                    </span>
                  </div>

                </div>

                <div className="details-grid">

                  <div>
                    <span>
                      USN
                    </span>

                    <strong>
                      {selectedUser.usn ||
                        "-"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Department
                    </span>

                    <strong>
                      {selectedUser.department ||
                        "-"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Branch
                    </span>

                    <strong>
                      {selectedUser.branch ||
                        "-"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Semester
                    </span>

                    <strong>
                      {selectedUser.semester ||
                        "-"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Phone
                    </span>

                    <strong>
                      {selectedUser.phone ||
                        "-"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Designation
                    </span>

                    <strong>
                      {selectedUser.designation ||
                        "-"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Status
                    </span>

                    <strong
                      className={
                        selectedUser.isActive ===
                        false
                          ? "details-inactive"
                          : "details-active"
                      }
                    >
                      {selectedUser.isActive ===
                      false
                        ? "Inactive"
                        : "Active"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Last Login
                    </span>

                    <strong>
                      {formatLastLogin(
                        selectedUser.lastLogin
                      )}
                    </strong>
                  </div>

                </div>

                <div className="modal-actions">

                  <button
                    className="modal-cancel-btn"
                    onClick={() =>
                      setShowDetails(false)
                    }
                  >
                    Close
                  </button>

                  <button
                    className="modal-save-btn"
                    onClick={() => {
                      setShowDetails(false);
                      handleEdit(
                        selectedUser
                      );
                    }}
                  >
                    <Pencil size={16} />
                    Edit User
                  </button>

                </div>

              </div>

            </div>
          )}

      </div>
    </DashboardLayout>
  );
}

export default UserManagement;