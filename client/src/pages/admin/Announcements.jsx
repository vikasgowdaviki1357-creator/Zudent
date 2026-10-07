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
  CalendarDays,
  UserRound,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import "./Announcements.css";

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
  title: "",
  description: "",
  audience: "All Users",
  department: "All Departments",
  priority: "Normal",
  status: "Published",
};

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  // --------------------------------------------------
  // FETCH ANNOUNCEMENTS
  // --------------------------------------------------

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/announcements");

      if (response.data?.success) {
        setAnnouncements(response.data.data || []);
      } else {
        throw new Error(
          response.data?.message || "Failed to load announcements."
        );
      }
    } catch (err) {
      console.error("Failed to fetch announcements:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load announcements."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filteredAnnouncements = useMemo(() => {
    const value = search.toLowerCase().trim();

    return announcements.filter((announcement) => {
      const matchesSearch =
        !value ||
        announcement.title?.toLowerCase().includes(value) ||
        announcement.description?.toLowerCase().includes(value) ||
        announcement.audience?.toLowerCase().includes(value) ||
        announcement.department?.toLowerCase().includes(value);

      const matchesPriority =
        priorityFilter === "All" ||
        announcement.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [announcements, search, priorityFilter]);

  // --------------------------------------------------
  // STATISTICS
  // --------------------------------------------------

  const totalAnnouncements = announcements.length;

  const publishedAnnouncements = announcements.filter(
    (announcement) => announcement.status === "Published"
  ).length;

  const urgentAnnouncements = announcements.filter(
    (announcement) => announcement.priority === "Urgent"
  ).length;

  // --------------------------------------------------
  // MODAL
  // --------------------------------------------------

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (announcement) => {
    setEditingId(announcement.id);

    setForm({
      title: announcement.title || "",
      description: announcement.description || "",
      audience: announcement.audience || "All Users",
      department:
        announcement.department || "All Departments",
      priority: announcement.priority || "Normal",
      status: announcement.status || "Published",
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // CREATE / UPDATE
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Announcement title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Announcement description is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      let response;

      if (editingId) {
        response = await api.put(
          `/admin/announcements/${editingId}`,
          form
        );
      } else {
        response = await api.post(
          "/admin/announcements",
          form
        );
      }

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to save announcement."
        );
      }

      setSuccess(
        editingId
          ? "Announcement updated successfully."
          : "Announcement created successfully."
      );

      closeModal();

      await fetchAnnouncements();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Failed to save announcement:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to save announcement."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete = async (id) => {
    const announcement = announcements.find(
      (item) => item.id === id
    );

    if (!announcement) return;

    const confirmed = window.confirm(
      `Delete "${announcement.title}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await api.delete(
        `/admin/announcements/${id}`
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to delete announcement."
        );
      }

      setSuccess("Announcement deleted successfully.");

      await fetchAnnouncements();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Failed to delete announcement:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to delete announcement."
      );
    }
  };

  // --------------------------------------------------
  // STATUS
  // --------------------------------------------------

  const toggleStatus = async (announcement) => {
    const newStatus =
      announcement.status === "Published"
        ? "Draft"
        : "Published";

    try {
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/admin/announcements/${announcement.id}/status`,
        {
          status: newStatus,
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to update announcement status."
        );
      }

      setSuccess(
        `Announcement marked ${newStatus}.`
      );

      await fetchAnnouncements();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Failed to update announcement status:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update announcement status."
      );
    }
  };

  // --------------------------------------------------
  // DATE
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout
      portalLabel="ADMIN PORTAL"
      navigation={navigation}
      userName="System Admin"
      userRole="Super Administrator"
    >
      <div className="announcements-page">

        {/* HEADER */}

        <div className="announcements-header">

          <div>
            <p className="announcement-eyebrow">
              ADMIN PORTAL
            </p>

            <h1>Announcements</h1>

            <p>
              Create and manage announcements for students,
              faculty and HODs.
            </p>
          </div>

          <button
            className="create-announcement-btn"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            Create Announcement
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="announcement-error">
            <AlertCircle size={17} />
            <span>{error}</span>

            <button onClick={() => setError("")}>
              <X size={15} />
            </button>
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="announcement-success">
            <CheckCircle2 size={17} />
            <span>{success}</span>
          </div>
        )}

        {/* STATISTICS */}

        <div className="announcement-stats">

          <div className="announcement-stat">

            <div className="announcement-stat-icon blue">
              <Megaphone size={21} />
            </div>

            <div>
              <span>Total Announcements</span>
              <strong>{totalAnnouncements}</strong>
            </div>

          </div>

          <div className="announcement-stat">

            <div className="announcement-stat-icon green">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>Published</span>
              <strong>{publishedAnnouncements}</strong>
            </div>

          </div>

          <div className="announcement-stat">

            <div className="announcement-stat-icon orange">
              <AlertCircle size={21} />
            </div>

            <div>
              <span>Urgent</span>
              <strong>{urgentAnnouncements}</strong>
            </div>

          </div>

        </div>

        {/* MAIN PANEL */}

        <section className="announcements-panel">

          {/* TOOLBAR */}

          <div className="announcement-toolbar">

            <div className="announcement-search">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search announcements..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
            >
              <option value="All">All Priorities</option>
              <option value="Normal">Normal</option>
              <option value="Important">Important</option>
              <option value="Urgent">Urgent</option>
            </select>

          </div>

          {/* LIST */}

          <div className="announcement-list">

            {loading ? (
              <div className="no-announcements">
                <Megaphone size={35} />

                <h3>Loading announcements...</h3>

                <p>
                  Please wait while announcements are
                  loaded.
                </p>
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="no-announcements">
                <Megaphone size={35} />

                <h3>No announcements found</h3>

                <p>
                  Create a new announcement or change your
                  search filters.
                </p>
              </div>
            ) : (
              filteredAnnouncements.map(
                (announcement) => (
                  <article
                    className="announcement-card"
                    key={announcement.id}
                  >

                    <div className="announcement-main">

                      <div className="announcement-icon">
                        <Megaphone size={19} />
                      </div>

                      <div className="announcement-content">

                        <div className="announcement-title-row">

                          <h2>
                            {announcement.title}
                          </h2>

                          <span
                            className={`priority-badge ${announcement.priority?.toLowerCase()}`}
                          >
                            {announcement.priority}
                          </span>

                        </div>

                        <p>
                          {announcement.description}
                        </p>

                        <div className="announcement-meta">

                          <span>
                            <UserRound size={13} />
                            {announcement.audience}
                          </span>

                          <span>
                            <Building2 size={13} />
                            {announcement.department}
                          </span>

                          <span>
                            <CalendarDays size={13} />
                            {formatDate(
                              announcement.createdAt ||
                                announcement.date
                            )}
                          </span>

                          <span
                            className={
                              announcement.status ===
                              "Published"
                                ? "published-status"
                                : ""
                            }
                          >
                            <span />
                            {announcement.status}
                          </span>

                        </div>

                      </div>

                    </div>

                    <div className="announcement-actions">

                      <button
                        title={
                          announcement.status ===
                          "Published"
                            ? "Move to Draft"
                            : "Publish"
                        }
                        onClick={() =>
                          toggleStatus(announcement)
                        }
                      >
                        {announcement.status ===
                        "Published" ? (
                          <Bell size={15} />
                        ) : (
                          <CheckCircle2 size={15} />
                        )}
                      </button>

                      <button
                        title="Edit"
                        onClick={() =>
                          openEditModal(announcement)
                        }
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        className="delete-announcement"
                        title="Delete"
                        onClick={() =>
                          handleDelete(announcement.id)
                        }
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>

                  </article>
                )
              )
            )}

          </div>

          {!loading && (
            <div className="announcement-footer">
              Showing{" "}
              <strong>
                {filteredAnnouncements.length}
              </strong>{" "}
              of{" "}
              <strong>{announcements.length}</strong>{" "}
              announcements
            </div>
          )}

        </section>

        {/* MODAL */}

        {showModal && (
          <div
            className="announcement-modal-overlay"
            onMouseDown={(event) => {
              if (
                event.target === event.currentTarget
              ) {
                closeModal();
              }
            }}
          >

            <div className="announcement-modal">

              <div className="modal-header">

                <div>
                  <h2>
                    {editingId
                      ? "Edit Announcement"
                      : "Create Announcement"}
                  </h2>

                  <p>
                    {editingId
                      ? "Update the announcement details."
                      : "Create a new announcement for users."}
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

              <form onSubmit={handleSubmit}>

                <div className="announcement-form-field">

                  <label>
                    Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    placeholder="Enter announcement title"
                    value={form.title}
                    onChange={handleChange}
                    maxLength={200}
                    required
                  />

                </div>

                <div className="announcement-form-field">

                  <label>
                    Description *
                  </label>

                  <textarea
                    name="description"
                    placeholder="Enter announcement details..."
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    maxLength={5000}
                    required
                  />

                </div>

                <div className="announcement-form-grid">

                  <div className="announcement-form-field">

                    <label>
                      Audience
                    </label>

                    <select
                      name="audience"
                      value={form.audience}
                      onChange={handleChange}
                    >
                      <option value="All Users">
                        All Users
                      </option>

                      <option value="Students">
                        Students
                      </option>

                      <option value="Faculty">
                        Faculty
                      </option>

                      <option value="HOD">
                        HOD
                      </option>
                    </select>

                  </div>

                  <div className="announcement-form-field">

                    <label>
                      Department
                    </label>

                    <input
                      type="text"
                      name="department"
                      placeholder="All Departments"
                      value={form.department}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="announcement-form-field">

                    <label>
                      Priority
                    </label>

                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                    >
                      <option value="Normal">
                        Normal
                      </option>

                      <option value="Important">
                        Important
                      </option>

                      <option value="Urgent">
                        Urgent
                      </option>
                    </select>

                  </div>

                  <div className="announcement-form-field">

                    <label>
                      Status
                    </label>

                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value="Published">
                        Published
                      </option>

                      <option value="Draft">
                        Draft
                      </option>
                    </select>

                  </div>

                </div>

                <div className="modal-actions">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="publish-btn"
                    disabled={saving}
                  >
                    <Save size={16} />

                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Update Announcement"
                      : "Create Announcement"}
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

export default Announcements;