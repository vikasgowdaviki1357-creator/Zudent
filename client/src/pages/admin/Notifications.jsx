import { useMemo, useState } from "react";
import {
  Bell,
  Search,
  Plus,
  CheckCircle2,
  Clock3,
  Trash2,
  X,
  Send,
  Users,
  AlertTriangle,
  Info,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import "./Notifications.css";

const navigation = [
  { name: "Dashboard", icon: Bell, path: "/admin" },
  { name: "User Management", icon: Users, path: "/admin/users" },
  { name: "Departments", icon: Users, path: "/admin/departments" },
  { name: "System Settings", icon: Bell, path: "/admin/settings" },
  {
    name: "Announcements",
    icon: Bell,
    path: "/admin/announcements",
  },
  {
    name: "Security Logs",
    icon: Bell,
    path: "/admin/security",
  },
  {
    name: "Notifications",
    icon: Bell,
    path: "/admin/notifications",
  },
];

const initialNotifications = [
  {
    id: 1,
    title: "Mid Semester Examination Reminder",
    message:
      "Students are requested to check the examination timetable and prepare accordingly.",
    type: "Academic",
    audience: "Students",
    priority: "Important",
    time: "10 minutes ago",
    status: "Unread",
  },
  {
    id: 2,
    title: "Faculty Meeting Reminder",
    message:
      "The department coordination meeting is scheduled for tomorrow at 10:00 AM.",
    type: "Meeting",
    audience: "Faculty",
    priority: "Normal",
    time: "1 hour ago",
    status: "Read",
  },
  {
    id: 3,
    title: "System Maintenance",
    message:
      "The JIT Super App will undergo scheduled maintenance tonight.",
    type: "System",
    audience: "All Users",
    priority: "Urgent",
    time: "3 hours ago",
    status: "Unread",
  },
  {
    id: 4,
    title: "Hackathon Registration",
    message:
      "Registration is now open for the upcoming college hackathon.",
    type: "Event",
    audience: "Students",
    priority: "Normal",
    time: "Yesterday",
    status: "Read",
  },
];

function Notifications() {
  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "General",
    audience: "All Users",
    priority: "Normal",
  });

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        notification.title
          .toLowerCase()
          .includes(searchText) ||
        notification.message
          .toLowerCase()
          .includes(searchText);

      const matchesType =
        typeFilter === "All" ||
        notification.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" ||
        notification.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [notifications, search, typeFilter, statusFilter]);

  const unreadCount = notifications.filter(
    (item) => item.status === "Unread"
  ).length;

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, status: "Read" }
          : notification
      )
    );
  };

  const deleteNotification = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!confirmed) return;

    setNotifications((current) =>
      current.filter(
        (notification) => notification.id !== id
      )
    );
  };

  const handleFormChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const sendNotification = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.message.trim()) {
      alert("Please enter a title and message.");
      return;
    }

    const newNotification = {
      id: Date.now(),
      title: form.title,
      message: form.message,
      type: form.type,
      audience: form.audience,
      priority: form.priority,
      time: "Just now",
      status: "Unread",
    };

    setNotifications((current) => [
      newNotification,
      ...current,
    ]);

    setForm({
      title: "",
      message: "",
      type: "General",
      audience: "All Users",
      priority: "Normal",
    });

    setShowModal(false);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Academic":
        return <Info size={18} />;

      case "Meeting":
        return <Users size={18} />;

      case "System":
        return <AlertTriangle size={18} />;

      case "Event":
        return <Clock3 size={18} />;

      default:
        return <Bell size={18} />;
    }
  };

  return (
    <DashboardLayout
      portalLabel="ADMIN PORTAL"
      navigation={navigation}
      userName="System Admin"
      userRole="Super Administrator"
    >
      <div className="notifications-page">

        {/* Header */}
        <div className="notifications-header">
          <div>
            <p className="notifications-eyebrow">
              ADMIN PORTAL
            </p>

            <h1>Notifications</h1>

            <p>
              Manage and send notifications across the JIT
              Super App.
            </p>
          </div>

          <button
            className="send-notification-btn"
            onClick={() => setShowModal(true)}
          >
            <Plus size={18} />
            Send Notification
          </button>
        </div>

        {/* Stats */}
        <div className="notification-stats">

          <div className="notification-stat">
            <div className="notification-stat-icon blue">
              <Bell size={20} />
            </div>

            <div>
              <span>Total Notifications</span>
              <strong>{notifications.length}</strong>
            </div>
          </div>

          <div className="notification-stat">
            <div className="notification-stat-icon orange">
              <Clock3 size={20} />
            </div>

            <div>
              <span>Unread</span>
              <strong>{unreadCount}</strong>
            </div>
          </div>

          <div className="notification-stat">
            <div className="notification-stat-icon green">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Read</span>
              <strong>
                {
                  notifications.filter(
                    (item) => item.status === "Read"
                  ).length
                }
              </strong>
            </div>
          </div>

        </div>

        {/* Panel */}
        <section className="notifications-panel">

          {/* Toolbar */}
          <div className="notifications-toolbar">

            <div className="notification-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search notifications..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value)
              }
            >
              <option value="All">All Types</option>
              <option value="Academic">Academic</option>
              <option value="Meeting">Meeting</option>
              <option value="System">System</option>
              <option value="Event">Event</option>
              <option value="General">General</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="All">All Status</option>
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
            </select>

          </div>

          {/* Notification List */}
          <div className="notification-list">

            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <article
                  className={`notification-card ${
                    notification.status === "Unread"
                      ? "unread"
                      : ""
                  }`}
                  key={notification.id}
                >

                  <div
                    className={`notification-type-icon ${notification.type.toLowerCase()}`}
                  >
                    {getTypeIcon(notification.type)}
                  </div>

                  <div className="notification-content">

                    <div className="notification-title-row">

                      <h2>{notification.title}</h2>

                      {notification.status === "Unread" && (
                        <span className="unread-badge">
                          Unread
                        </span>
                      )}

                      <span
                        className={`notification-priority ${notification.priority.toLowerCase()}`}
                      >
                        {notification.priority}
                      </span>

                    </div>

                    <p>{notification.message}</p>

                    <div className="notification-meta">

                      <span>
                        <Users size={13} />
                        {notification.audience}
                      </span>

                      <span>
                        <Bell size={13} />
                        {notification.type}
                      </span>

                      <span>
                        <Clock3 size={13} />
                        {notification.time}
                      </span>

                    </div>

                  </div>

                  <div className="notification-actions">

                    {notification.status === "Unread" && (
                      <button
                        title="Mark as read"
                        onClick={() =>
                          markAsRead(notification.id)
                        }
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    )}

                    <button
                      className="delete-notification"
                      title="Delete"
                      onClick={() =>
                        deleteNotification(notification.id)
                      }
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </article>
              ))
            ) : (
              <div className="no-notifications">

                <Bell size={34} />

                <h3>No notifications found</h3>

                <p>
                  Try changing your search or filter options.
                </p>

              </div>
            )}

          </div>

          <div className="notifications-footer">
            Showing{" "}
            <strong>
              {filteredNotifications.length}
            </strong>{" "}
            of{" "}
            <strong>{notifications.length}</strong>{" "}
            notifications
          </div>

        </section>

        {/* Send Notification Modal */}
        {showModal && (
          <div
            className="notification-modal-overlay"
            onClick={() => setShowModal(false)}
          >
            <div
              className="notification-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="notification-modal-header">

                <div>
                  <h2>Send Notification</h2>

                  <p>
                    Send a notification to users of the
                    platform.
                  </p>
                </div>

                <button
                  className="notification-modal-close"
                  onClick={() => setShowModal(false)}
                >
                  <X size={20} />
                </button>

              </div>

              <form onSubmit={sendNotification}>

                <div className="notification-form-field">
                  <label>Notification Title</label>

                  <input
                    type="text"
                    name="title"
                    placeholder="Enter notification title"
                    value={form.title}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="notification-form-field">
                  <label>Message</label>

                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Write your notification..."
                    value={form.message}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="notification-form-grid">

                  <div className="notification-form-field">
                    <label>Notification Type</label>

                    <select
                      name="type"
                      value={form.type}
                      onChange={handleFormChange}
                    >
                      <option>General</option>
                      <option>Academic</option>
                      <option>Meeting</option>
                      <option>System</option>
                      <option>Event</option>
                    </select>
                  </div>

                  <div className="notification-form-field">
                    <label>Target Audience</label>

                    <select
                      name="audience"
                      value={form.audience}
                      onChange={handleFormChange}
                    >
                      <option>All Users</option>
                      <option>Students</option>
                      <option>Faculty</option>
                      <option>HOD</option>
                      <option>Admin</option>
                    </select>
                  </div>

                </div>

                <div className="notification-form-field">
                  <label>Priority</label>

                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleFormChange}
                  >
                    <option>Normal</option>
                    <option>Important</option>
                    <option>Urgent</option>
                  </select>
                </div>

                <div className="notification-modal-actions">

                  <button
                    type="button"
                    className="notification-cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="notification-publish-btn"
                  >
                    <Send size={17} />
                    Send Notification
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

export default Notifications;