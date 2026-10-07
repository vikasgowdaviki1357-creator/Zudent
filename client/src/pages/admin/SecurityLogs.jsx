import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
  Settings,
  UserPlus,
  Trash2,
  X,
  Shield,
  Monitor,
  Globe,
  User,
  Clock,
} from "lucide-react";

import "./SecurityLogs.css";

/* =========================================================
   ICON MAP
========================================================= */

const ICONS = {
  Login: LogIn,
  Logout: LogOut,
  Settings: Settings,
  "User Created": UserPlus,
};

/* =========================================================
   DEFAULT LOGS
========================================================= */

const DEFAULT_LOGS = [
  {
    id: 1,
    icon: "Login",
    title: "Login",
    status: "Success",
    description: "User logged into the portal",
    user: "Vikas Gowda",
    email: "vikas@jit.edu.in",
    ip: "192.168.1.24",
    device: "Chrome / Windows",
    time: "25 Sep 2026, 08:42 PM",
  },

  {
    id: 2,
    icon: "Settings",
    title: "Settings",
    status: "Success",
    description: "System settings updated",
    user: "System Admin",
    email: "admin@jit.edu.in",
    ip: "192.168.1.10",
    device: "Chrome / Windows",
    time: "25 Sep 2026, 07:15 PM",
  },

  {
    id: 3,
    icon: "Logout",
    title: "Logout",
    status: "Success",
    description: "User logged out of the portal",
    user: "Ananya Rao",
    email: "1JT22IS015@jit.edu.in",
    ip: "192.168.1.56",
    device: "Chrome / Android",
    time: "25 Sep 2026, 06:42 PM",
  },

  {
    id: 4,
    icon: "User Created",
    title: "User Created",
    status: "Success",
    description: "New faculty account created",
    user: "System Admin",
    email: "admin@jit.edu.in",
    ip: "192.168.1.10",
    device: "Chrome / Windows",
    time: "25 Sep 2026, 05:31 PM",
  },

  {
    id: 5,
    icon: "Login",
    title: "Login",
    status: "Failed",
    description: "Invalid password entered",
    user: "Unknown User",
    email: "unknown@example.com",
    ip: "103.25.91.17",
    device: "Chrome / Android",
    time: "25 Sep 2026, 04:18 PM",
  },
];

/* =========================================================
   STORAGE KEY
========================================================= */

const STORAGE_KEY = "jit_security_logs";

/* =========================================================
   COMPONENT
========================================================= */

function SecurityLogs() {
  /* =======================================================
     LOAD LOGS FROM LOCAL STORAGE
  ======================================================= */

  const [logs, setLogs] = useState(() => {
    try {
      const savedLogs = localStorage.getItem(STORAGE_KEY);

      if (savedLogs !== null) {
        return JSON.parse(savedLogs);
      }

      return DEFAULT_LOGS;
    } catch (error) {
      console.error("Failed to load security logs:", error);
      return DEFAULT_LOGS;
    }
  });

  /* =======================================================
     OTHER STATES
  ======================================================= */

  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("All Events");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedLog, setSelectedLog] = useState(null);

  /* =======================================================
     SAVE LOGS TO LOCAL STORAGE
  ======================================================= */

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error("Failed to save security logs:", error);
    }
  }, [logs]);

  /* =======================================================
     FILTER LOGS
  ======================================================= */

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const searchText = `
        ${log.title}
        ${log.status}
        ${log.description}
        ${log.user}
        ${log.email}
        ${log.ip}
        ${log.device}
      `.toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      const matchesEvent =
        eventFilter === "All Events" ||
        log.title === eventFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        log.status === statusFilter;

      return (
        matchesSearch &&
        matchesEvent &&
        matchesStatus
      );
    });
  }, [logs, search, eventFilter, statusFilter]);

  /* =======================================================
     CLEAR ALL LOGS
  ======================================================= */

  const handleClearLogs = () => {
    if (logs.length === 0) {
      alert("There are no security logs to clear.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to clear all security logs?\n\nThis action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    /* Clear React state */
    setLogs([]);

    /* Clear local storage immediately */
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([])
    );

    /* Close modal if open */
    setSelectedLog(null);
  };

  /* =======================================================
     VIEW LOG
  ======================================================= */

  const handleViewLog = (log) => {
    setSelectedLog(log);
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const closeModal = () => {
    setSelectedLog(null);
  };

  /* =======================================================
     GET ICON
  ======================================================= */

  const getLogIcon = (iconName) => {
    return ICONS[iconName] || LogIn;
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="security-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="security-page-header">

        <div>
          <h1>Security Logs</h1>

          <p>
            Monitor login activity and security events
            across the system.
          </p>
        </div>

        <button
          type="button"
          className="clear-logs-btn"
          onClick={handleClearLogs}
          disabled={logs.length === 0}
        >
          <Trash2 size={17} />

          Clear Logs
        </button>

      </div>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="security-toolbar">

        {/* Search */}

        <div className="security-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search security logs..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* Event Filter */}

        <select
          value={eventFilter}
          onChange={(e) =>
            setEventFilter(e.target.value)
          }
        >
          <option>All Events</option>
          <option>Login</option>
          <option>Logout</option>
          <option>User Created</option>
          <option>Settings</option>
        </select>

        {/* Status Filter */}

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option>All Status</option>
          <option>Success</option>
          <option>Failed</option>
        </select>

      </div>

      {/* =================================================
          SECURITY CARD
      ================================================= */}

      <div className="security-card">

        {/* Card Header */}

        <div className="security-card-header">

          <div>

            <h2>Recent Activity</h2>

            <p>
              Showing {filteredLogs.length} of{" "}
              {logs.length} security events
            </p>

          </div>

        </div>

        {/* =================================================
            LOG LIST
        ================================================= */}

        <div className="security-list">

          {filteredLogs.map((log) => {

            const Icon = getLogIcon(log.icon);

            return (
              <div
                className="security-log"
                key={log.id}
              >

                {/* Log Icon */}

                <div
                  className={`security-log-icon ${log.status.toLowerCase()}`}
                >
                  <Icon size={20} />
                </div>

                {/* Main Content */}

                <div className="security-log-content">

                  <div className="security-log-title">

                    <h3>
                      {log.title}
                    </h3>

                    <span
                      className={`status-badge ${log.status.toLowerCase()}`}
                    >

                      {log.status === "Success" ? (
                        <CheckCircle size={13} />
                      ) : (
                        <XCircle size={13} />
                      )}

                      {log.status}

                    </span>

                  </div>

                  <p className="security-description">
                    {log.description}
                  </p>

                  <div className="security-meta">

                    <span>
                      <strong>User:</strong>{" "}
                      {log.user}
                    </span>

                    <span>
                      <strong>Email:</strong>{" "}
                      {log.email}
                    </span>

                    <span>
                      <strong>IP:</strong>{" "}
                      {log.ip}
                    </span>

                    <span>
                      <strong>Device:</strong>{" "}
                      {log.device}
                    </span>

                  </div>

                </div>

                {/* Time + View */}

                <div className="security-log-right">

                  <span className="security-time">
                    {log.time}
                  </span>

                  <button
                    type="button"
                    className="view-log-btn"
                    title="View details"
                    onClick={() =>
                      handleViewLog(log)
                    }
                  >
                    <Eye size={17} />
                  </button>

                </div>

              </div>
            );
          })}

        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {filteredLogs.length === 0 && (

          <div className="no-security-logs">

            <Search size={40} />

            <h3>
              {logs.length === 0
                ? "No security logs"
                : "No logs found"}
            </h3>

            <p>
              {logs.length === 0
                ? "There are currently no security events in the system."
                : "Try changing your search or filters."}
            </p>

          </div>

        )}

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="security-footer">

          Showing{" "}

          <strong>
            {filteredLogs.length}
          </strong>{" "}

          of{" "}

          <strong>
            {logs.length}
          </strong>{" "}

          security events

        </div>

      </div>

      {/* =================================================
          VIEW LOG MODAL
      ================================================= */}

      {selectedLog && (

        <div
          className="security-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="security-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="security-modal-header">

              <div>

                <div className="security-modal-title">

                  <div
                    className={`security-modal-icon ${selectedLog.status.toLowerCase()}`}
                  >
                    {React.createElement(
                      getLogIcon(selectedLog.icon),
                      {
                        size: 20,
                      }
                    )}
                  </div>

                  <div>

                    <h2>
                      {selectedLog.title}
                    </h2>

                    <span
                      className={`status-badge ${selectedLog.status.toLowerCase()}`}
                    >

                      {selectedLog.status ===
                      "Success" ? (
                        <CheckCircle size={13} />
                      ) : (
                        <XCircle size={13} />
                      )}

                      {selectedLog.status}

                    </span>

                  </div>

                </div>

              </div>

              <button
                type="button"
                className="security-modal-close"
                onClick={closeModal}
                title="Close"
              >
                <X size={18} />
              </button>

            </div>

            {/* Description */}

            <div className="security-modal-description">

              <p>
                {selectedLog.description}
              </p>

            </div>

            {/* =================================================
                DETAILS
            ================================================= */}

            <div className="security-details">

              {/* User */}

              <div className="security-detail-item">

                <div className="security-detail-icon">
                  <User size={17} />
                </div>

                <div>
                  <span>User</span>

                  <strong>
                    {selectedLog.user}
                  </strong>
                </div>

              </div>

              {/* Email */}

              <div className="security-detail-item">

                <div className="security-detail-icon">
                  <Shield size={17} />
                </div>

                <div>
                  <span>Email</span>

                  <strong>
                    {selectedLog.email}
                  </strong>
                </div>

              </div>

              {/* IP */}

              <div className="security-detail-item">

                <div className="security-detail-icon">
                  <Globe size={17} />
                </div>

                <div>
                  <span>IP Address</span>

                  <strong>
                    {selectedLog.ip}
                  </strong>
                </div>

              </div>

              {/* Device */}

              <div className="security-detail-item">

                <div className="security-detail-icon">
                  <Monitor size={17} />
                </div>

                <div>
                  <span>Device</span>

                  <strong>
                    {selectedLog.device}
                  </strong>
                </div>

              </div>

              {/* Date */}

              <div className="security-detail-item">

                <div className="security-detail-icon">
                  <Clock size={17} />
                </div>

                <div>
                  <span>Date & Time</span>

                  <strong>
                    {selectedLog.time}
                  </strong>
                </div>

              </div>

              {/* Event */}

              <div className="security-detail-item">

                <div className="security-detail-icon">
                  <CheckCircle size={17} />
                </div>

                <div>
                  <span>Event</span>

                  <strong>
                    {selectedLog.title}
                  </strong>
                </div>

              </div>

            </div>

            {/* =================================================
                MODAL FOOTER
            ================================================= */}

            <div className="security-modal-footer">

              <button
                type="button"
                onClick={closeModal}
                className="security-modal-done"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default SecurityLogs;