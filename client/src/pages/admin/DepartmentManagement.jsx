import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  Megaphone,
  ShieldCheck,
  Bell,
  BarChart3,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Save,
  GraduationCap,
  UserRound,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import "./DepartmentManagement.css";

const navigation = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
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
    icon: Megaphone,
    path: "/admin/announcements",
  },
  {
    name: "Security Logs",
    icon: ShieldCheck,
    path: "/admin/security",
  },
  {
    name: "Notifications",
    icon: Bell,
    path: "/admin/notifications",
  },
  {
    name: "Reports & Analytics",
    icon: BarChart3,
    path: "/admin/reports",
  },
];

const emptyForm = {
  name: "",
  code: "",
  hod: "",
  status: "Active",
};

function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [hods, setHods] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * ---------------------------------------------------------
   * AUTH CONFIG
   * ---------------------------------------------------------
   *
   * Your backend uses protect middleware.
   * Therefore every department request must contain:
   *
   * Authorization: Bearer <jit_token>
   */

  const getAuthConfig = () => {
    const token = localStorage.getItem("jit_token");

    if (!token) {
      throw new Error("Your session has expired. Please login again.");
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  /*
   * ---------------------------------------------------------
   * ERROR HANDLER
   * ---------------------------------------------------------
   */

  const getErrorMessage = (err) => {
    return (
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong. Please try again."
    );
  };

  /*
   * ---------------------------------------------------------
   * LOAD DEPARTMENTS
   * ---------------------------------------------------------
   */

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/departments",
        getAuthConfig()
      );

      const data = response.data?.data || [];

      setDepartments(data);
    } catch (err) {
      console.error("Failed to load departments:", err);

      setError(getErrorMessage(err));

      if (err?.response?.status === 401) {
        localStorage.removeItem("jit_token");
        localStorage.removeItem("jit_user");
      }
    } finally {
      setLoading(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * LOAD HODS
   * ---------------------------------------------------------
   */

  const loadHods = async () => {
    try {
      const response = await api.get(
        "/admin/departments/hods",
        getAuthConfig()
      );

      setHods(response.data?.data || []);
    } catch (err) {
      console.error("Failed to load HODs:", err);

      /*
       * HOD loading should not stop the entire page.
       * We simply keep the list empty.
       */
    }
  };

  /*
   * ---------------------------------------------------------
   * INITIAL LOAD
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadDepartments(),
        loadHods(),
      ]);
    };

    loadData();
  }, []);

  /*
   * ---------------------------------------------------------
   * SEARCH
   * ---------------------------------------------------------
   */

  const filteredDepartments = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return departments;
    }

    return departments.filter((department) => {
      const departmentName =
        department.name?.toLowerCase() || "";

      const departmentCode =
        department.code?.toLowerCase() || "";

      const hodName =
        department.hod?.name?.toLowerCase() || "";

      const hodEmail =
        department.hod?.email?.toLowerCase() || "";

      return (
        departmentName.includes(value) ||
        departmentCode.includes(value) ||
        hodName.includes(value) ||
        hodEmail.includes(value)
      );
    });
  }, [departments, search]);

  /*
   * ---------------------------------------------------------
   * STATISTICS
   * ---------------------------------------------------------
   */

  const totalStudents = departments.reduce(
    (sum, department) =>
      sum + Number(department.students || 0),
    0
  );

  const totalFaculty = departments.reduce(
    (sum, department) =>
      sum + Number(department.faculty || 0),
    0
  );

  /*
   * ---------------------------------------------------------
   * MODAL
   * ---------------------------------------------------------
   */

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEditModal = (department) => {
    setEditingId(department.id);

    setForm({
      name: department.name || "",
      code: department.code || "",
      hod: department.hod?.id || "",
      status: department.status || "Active",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  /*
   * ---------------------------------------------------------
   * FORM CHANGE
   * ---------------------------------------------------------
   */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
   * ---------------------------------------------------------
   * CREATE / UPDATE
   * ---------------------------------------------------------
   */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Department name is required.");
      return;
    }

    if (!form.code.trim()) {
      setError("Department code is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        hod: form.hod || null,
        status: form.status,
      };

      if (editingId) {
        /*
         * UPDATE
         */

        const response = await api.put(
          `/admin/departments/${editingId}`,
          payload,
          getAuthConfig()
        );

        const updatedDepartment =
          response.data?.data;

        if (updatedDepartment) {
          setDepartments((previous) =>
            previous.map((department) =>
              department.id === editingId
                ? {
                    ...department,
                    ...updatedDepartment,

                    /*
                     * Backend returns populated HOD.
                     */
                    hod:
                      updatedDepartment.hod ||
                      null,
                  }
                : department
            )
          );
        }

        setSuccess(
          "Department updated successfully."
        );
      } else {
        /*
         * CREATE
         */

        const response = await api.post(
          "/admin/departments",
          payload,
          getAuthConfig()
        );

        const newDepartment =
          response.data?.data;

        if (newDepartment) {
          /*
           * Backend create endpoint returns
           * populated department.
           *
           * Faculty/student counts may not be
           * included in create response, so reload
           * the complete department list.
           */
          await loadDepartments();
        }

        setSuccess(
          "Department created successfully."
        );
      }

      await loadHods();

      setShowModal(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      console.error(
        "Department save failed:",
        err
      );

      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * DELETE
   * ---------------------------------------------------------
   */

  const handleDelete = async (id) => {
    const department = departments.find(
      (item) => item.id === id
    );

    if (!department) return;

    const confirmed = window.confirm(
      `Delete ${department.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await api.delete(
        `/admin/departments/${id}`,
        getAuthConfig()
      );

      setDepartments((previous) =>
        previous.filter(
          (item) => item.id !== id
        )
      );

      setSuccess(
        "Department deleted successfully."
      );
    } catch (err) {
      console.error(
        "Department delete failed:",
        err
      );

      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  /*
   * ---------------------------------------------------------
   * TOGGLE STATUS
   * ---------------------------------------------------------
   */

  const toggleStatus = async (department) => {
    const newStatus =
      department.status === "Active"
        ? "Inactive"
        : "Active";

    try {
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/admin/departments/${department.id}/status`,
        {
          status: newStatus,
        },
        getAuthConfig()
      );

      const updatedDepartment =
        response.data?.data;

      setDepartments((previous) =>
        previous.map((item) =>
          item.id === department.id
            ? {
                ...item,
                status:
                  updatedDepartment?.status ||
                  newStatus,
              }
            : item
        )
      );

      setSuccess(
        `Department marked ${newStatus}.`
      );
    } catch (err) {
      console.error(
        "Department status update failed:",
        err
      );

      setError(getErrorMessage(err));
    }
  };

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  return (
    <DashboardLayout
      portalLabel="ADMIN PORTAL"
      navigation={navigation}
      userName="System Admin"
      userRole="Super Administrator"
    >
      <div className="department-page">

        {/* HEADER */}
        <div className="department-header">
          <div>
            <p className="department-eyebrow">
              ADMIN PORTAL
            </p>

            <h1>
              Department Management
            </h1>

            <p>
              Manage academic departments, HODs,
              faculty and student information.
            </p>
          </div>

          <button
            className="add-department-btn"
            onClick={openAddModal}
          >
            <Plus size={18} />
            Add Department
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              marginBottom: "18px",
              padding: "12px 16px",
              borderRadius: "9px",
              border: "1px solid #fecaca",
              background: "#fef2f2",
              color: "#dc2626",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div
            style={{
              marginBottom: "18px",
              padding: "12px 16px",
              borderRadius: "9px",
              border: "1px solid #bbf7d0",
              background: "#f0fdf4",
              color: "#15803d",
              fontSize: "13px",
            }}
          >
            {success}
          </div>
        )}

        {/* STATISTICS */}
        <div className="department-stats">

          <div className="department-stat-card">
            <div className="department-stat-icon blue">
              <Building2 size={21} />
            </div>

            <div>
              <span>
                Total Departments
              </span>

              <strong>
                {loading
                  ? "..."
                  : departments.length}
              </strong>
            </div>
          </div>

          <div className="department-stat-card">
            <div className="department-stat-icon purple">
              <GraduationCap size={21} />
            </div>

            <div>
              <span>
                Total Students
              </span>

              <strong>
                {loading
                  ? "..."
                  : totalStudents.toLocaleString()}
              </strong>
            </div>
          </div>

          <div className="department-stat-card">
            <div className="department-stat-icon green">
              <UserRound size={21} />
            </div>

            <div>
              <span>
                Total Faculty
              </span>

              <strong>
                {loading
                  ? "..."
                  : totalFaculty.toLocaleString()}
              </strong>
            </div>
          </div>

        </div>

        {/* MAIN CARD */}
        <section className="department-card">

          <div className="department-toolbar">

            <div>
              <h2>
                Departments
              </h2>

              <p>
                {loading
                  ? "Loading departments..."
                  : `${filteredDepartments.length} department${
                      filteredDepartments.length !== 1
                        ? "s"
                        : ""
                    } found`}
              </p>
            </div>

            <div className="department-search">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search department, code or HOD..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>

          </div>

          {/* TABLE */}
          <div className="department-table-wrapper">

            <table className="department-table">

              <thead>
                <tr>
                  <th>
                    Department
                  </th>

                  <th>
                    Code
                  </th>

                  <th>
                    HOD
                  </th>

                  <th>
                    Faculty
                  </th>

                  <th>
                    Students
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        color: "#9ca3af",
                      }}
                    >
                      Loading departments...
                    </td>
                  </tr>
                ) : (
                  filteredDepartments.map(
                    (department) => (
                      <tr
                        key={department.id}
                      >

                        {/* DEPARTMENT */}
                        <td>
                          <div className="department-name-cell">

                            <div className="department-avatar">
                              <Building2 size={17} />
                            </div>

                            <div>
                              <strong>
                                {department.name}
                              </strong>

                              <span>
                                Academic Department
                              </span>
                            </div>

                          </div>
                        </td>

                        {/* CODE */}
                        <td>
                          <span className="department-code">
                            {department.code}
                          </span>
                        </td>

                        {/* HOD */}
                        <td>

                          {department.hod ? (
                            <div className="hod-cell">

                              <div className="hod-avatar">
                                {department.hod.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "H"}
                              </div>

                              <span>
                                {department.hod.name}
                              </span>

                            </div>
                          ) : (
                            <span
                              style={{
                                color: "#9ca3af",
                              }}
                            >
                              Not assigned
                            </span>
                          )}

                        </td>

                        {/* FACULTY */}
                        <td>
                          <strong>
                            {Number(
                              department.faculty || 0
                            ).toLocaleString()}
                          </strong>
                        </td>

                        {/* STUDENTS */}
                        <td>
                          <strong>
                            {Number(
                              department.students || 0
                            ).toLocaleString()}
                          </strong>
                        </td>

                        {/* STATUS */}
                        <td>

                          <button
                            className={`status-badge ${
                              department.status ===
                              "Active"
                                ? "active"
                                : "inactive"
                            }`}
                            onClick={() =>
                              toggleStatus(
                                department
                              )
                            }
                          >
                            <span />

                            {department.status}
                          </button>

                        </td>

                        {/* ACTIONS */}
                        <td>

                          <div className="department-actions">

                            <button
                              className="action-btn edit"
                              title="Edit"
                              onClick={() =>
                                openEditModal(
                                  department
                                )
                              }
                            >
                              <Edit3 size={16} />
                            </button>

                            <button
                              className="action-btn delete"
                              title="Delete"
                              disabled={
                                deletingId ===
                                department.id
                              }
                              onClick={() =>
                                handleDelete(
                                  department.id
                                )
                              }
                            >
                              <Trash2 size={16} />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>

            {!loading &&
              filteredDepartments.length === 0 && (
                <div className="empty-departments">

                  <Building2 size={35} />

                  <h3>
                    No departments found
                  </h3>

                  <p>
                    Try changing your search or
                    add a new department.
                  </p>

                </div>
              )}

          </div>

        </section>

        {/* ADD / EDIT MODAL */}
        {showModal && (
          <div
            className="department-modal-overlay"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeModal();
              }
            }}
          >

            <div className="department-modal">

              {/* MODAL HEADER */}
              <div className="department-modal-header">

                <div>
                  <h2>
                    {editingId
                      ? "Edit Department"
                      : "Add Department"}
                  </h2>

                  <p>
                    {editingId
                      ? "Update department information."
                      : "Enter the details of the new department."}
                  </p>
                </div>

                <button
                  className="modal-close"
                  onClick={closeModal}
                  disabled={saving}
                >
                  <X size={19} />
                </button>

              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="department-form"
              >

                <div className="department-form-grid">

                  {/* NAME */}
                  <div className="department-field full">

                    <label>
                      Department Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Computer Science & Engineering"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* CODE */}
                  <div className="department-field">

                    <label>
                      Department Code *
                    </label>

                    <input
                      type="text"
                      name="code"
                      placeholder="e.g. CSE"
                      value={form.code}
                      onChange={handleChange}
                      maxLength={10}
                      required
                    />

                  </div>

                  {/* HOD */}
                  <div className="department-field">

                    <label>
                      Head of Department
                    </label>

                    <select
                      name="hod"
                      value={form.hod}
                      onChange={handleChange}
                    >

                      <option value="">
                        Select HOD
                      </option>

                      {hods.map((hod) => (
                        <option
                          key={hod._id}
                          value={hod._id}
                        >
                          {hod.name}
                          {hod.department
                            ? ` — ${hod.department}`
                            : ""}
                        </option>
                      ))}

                    </select>

                  </div>

                  {/* STATUS */}
                  <div className="department-field">

                    <label>
                      Status
                    </label>

                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >

                      <option value="Active">
                        Active
                      </option>

                      <option value="Inactive">
                        Inactive
                      </option>

                    </select>

                  </div>

                </div>

                {/* FORM ACTIONS */}
                <div className="department-form-actions">

                  <button
                    type="button"
                    className="modal-cancel"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="modal-save"
                    disabled={saving}
                  >

                    <Save size={16} />

                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Update Department"
                      : "Add Department"}

                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default DepartmentManagement;