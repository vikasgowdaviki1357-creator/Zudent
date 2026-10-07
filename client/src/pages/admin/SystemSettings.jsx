import React, { useEffect, useState } from "react";

import {
  Settings,
  Globe,
  ShieldCheck,
  Bell,
  Database,
  Save,
  RotateCcw,
  Mail,
  Users,
  Lock,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import "./SystemSettings.css";

/* =========================================
   ADMIN NAVIGATION
========================================= */

const navigation = [
  {
    name: "Dashboard",
    icon: Settings,
    path: "/admin",
  },
  {
    name: "User Management",
    icon: Users,
    path: "/admin/users",
  },
  {
    name: "Departments",
    icon: Database,
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
    icon: ShieldCheck,
    path: "/admin/security",
  },
];

/* =========================================
   DEFAULT SETTINGS
========================================= */

const defaultSettings = {
  institutionName: "Jyothy Institute of Technology",
  institutionCode: "JIT",
  email: "admin@jit.ac.in",
  phone: "+91 80 2848 6800",

  academicYear: "2026-27",
  semester: "Odd Semester",
  timezone: "Asia/Kolkata",

  emailNotifications: true,
  announcementNotifications: true,
  loginNotifications: true,

  maintenanceMode: false,

  sessionTimeout: "30",
};

/* =========================================
   COMPONENT
========================================= */

function SystemSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  /* =========================================
     LOAD SAVED SETTINGS
  ========================================= */

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(
        "jit_system_settings"
      );

      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);

        setSettings({
          ...defaultSettings,
          ...parsedSettings,
        });
      }
    } catch (error) {
      console.error(
        "Failed to load system settings:",
        error
      );

      setSettings(defaultSettings);
    }
  }, []);

  /* =========================================
     HANDLE INPUT CHANGE
  ========================================= */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setSaved(false);
  };

  /* =========================================
     SAVE SETTINGS
  ========================================= */

  const handleSave = () => {
    try {
      localStorage.setItem(
        "jit_system_settings",
        JSON.stringify(settings)
      );

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to save system settings:",
        error
      );

      alert(
        "Unable to save settings. Please try again."
      );
    }
  };

  /* =========================================
     RESET SETTINGS
  ========================================= */

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset all system settings to their default values?"
    );

    if (!confirmed) {
      return;
    }

    setSettings({
      ...defaultSettings,
    });

    localStorage.removeItem(
      "jit_system_settings"
    );

    setSaved(false);
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <DashboardLayout
      portalLabel="ADMIN PORTAL"
      navigation={navigation}
      userName="System Admin"
      userRole="Super Administrator"
    >
      <div className="settings-page">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="settings-header">

          <div>
            <p className="settings-eyebrow">
              ADMIN PORTAL
            </p>

            <h1>System Settings</h1>

            <p>
              Configure institution, academic,
              notification and security settings.
            </p>
          </div>

          <button
            type="button"
            className="settings-save-top"
            onClick={handleSave}
          >
            <Save size={17} />
            Save Changes
          </button>

        </div>

        {/* =====================================
            SUCCESS MESSAGE
        ====================================== */}

        {saved && (
          <div className="settings-success">
            <span>✓</span>

            <div>
              System settings saved successfully.
            </div>
          </div>
        )}

        {/* =====================================
            INSTITUTION INFORMATION
        ====================================== */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-section-icon">
              <Globe size={19} />
            </div>

            <div>
              <h2>
                Institution Information
              </h2>

              <p>
                Basic information about the institution.
              </p>
            </div>

          </div>

          <div className="settings-grid">

            {/* Institution Name */}

            <div className="settings-field">

              <label>
                Institution Name
              </label>

              <div className="settings-input-icon">

                <Globe size={16} />

                <input
                  type="text"
                  name="institutionName"
                  value={settings.institutionName}
                  onChange={handleChange}
                  placeholder="Institution name"
                />

              </div>

            </div>

            {/* Institution Code */}

            <div className="settings-field">

              <label>
                Institution Code
              </label>

              <input
                type="text"
                name="institutionCode"
                value={settings.institutionCode}
                onChange={handleChange}
                placeholder="Institution code"
              />

            </div>

            {/* Administrator Email */}

            <div className="settings-field">

              <label>
                Administrator Email
              </label>

              <div className="settings-input-icon">

                <Mail size={16} />

                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                />

              </div>

            </div>

            {/* Contact Number */}

            <div className="settings-field">

              <label>
                Contact Number
              </label>

              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                placeholder="Contact number"
              />

            </div>

          </div>

        </section>

        {/* =====================================
            ACADEMIC CONFIGURATION
        ====================================== */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-section-icon">
              <Database size={19} />
            </div>

            <div>
              <h2>
                Academic Configuration
              </h2>

              <p>
                Configure the current academic session.
              </p>
            </div>

          </div>

          <div className="settings-grid">

            {/* Academic Year */}

            <div className="settings-field">

              <label>
                Academic Year
              </label>

              <select
                name="academicYear"
                value={settings.academicYear}
                onChange={handleChange}
              >
                <option value="2026-27">
                  2026-27
                </option>

                <option value="2027-28">
                  2027-28
                </option>

                <option value="2028-29">
                  2028-29
                </option>

                <option value="2029-30">
                  2029-30
                </option>
              </select>

            </div>

            {/* Semester */}

            <div className="settings-field">

              <label>
                Current Semester
              </label>

              <select
                name="semester"
                value={settings.semester}
                onChange={handleChange}
              >
                <option value="Odd Semester">
                  Odd Semester
                </option>

                <option value="Even Semester">
                  Even Semester
                </option>
              </select>

            </div>

            {/* Timezone */}

            <div className="settings-field full-width">

              <label>
                Timezone
              </label>

              <select
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
              >
                <option value="Asia/Kolkata">
                  India Standard Time (IST)
                </option>

                <option value="UTC">
                  Coordinated Universal Time (UTC)
                </option>
              </select>

            </div>

          </div>

        </section>

        {/* =====================================
            NOTIFICATION SETTINGS
        ====================================== */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-section-icon">
              <Bell size={19} />
            </div>

            <div>
              <h2>
                Notification Settings
              </h2>

              <p>
                Control system notification behaviour.
              </p>
            </div>

          </div>

          <div className="settings-options">

            {/* Email Notifications */}

            <label className="settings-toggle">

              <div className="toggle-icon">
                <Mail size={16} />
              </div>

              <div className="toggle-content">

                <strong>
                  Email Notifications
                </strong>

                <span>
                  Send important system notifications
                  through email.
                </span>

              </div>

              <input
                type="checkbox"
                name="emailNotifications"
                checked={
                  settings.emailNotifications
                }
                onChange={handleChange}
              />

              <span className="toggle-switch" />

            </label>

            {/* Announcement Notifications */}

            <label className="settings-toggle">

              <div className="toggle-icon">
                <Bell size={16} />
              </div>

              <div className="toggle-content">

                <strong>
                  Announcement Notifications
                </strong>

                <span>
                  Notify users when new announcements
                  are published.
                </span>

              </div>

              <input
                type="checkbox"
                name="announcementNotifications"
                checked={
                  settings.announcementNotifications
                }
                onChange={handleChange}
              />

              <span className="toggle-switch" />

            </label>

            {/* Login Notifications */}

            <label className="settings-toggle">

              <div className="toggle-icon">
                <ShieldCheck size={16} />
              </div>

              <div className="toggle-content">

                <strong>
                  Login Notifications
                </strong>

                <span>
                  Notify administrators about account
                  logins.
                </span>

              </div>

              <input
                type="checkbox"
                name="loginNotifications"
                checked={
                  settings.loginNotifications
                }
                onChange={handleChange}
              />

              <span className="toggle-switch" />

            </label>

          </div>

        </section>

        {/* =====================================
            SECURITY SETTINGS
        ====================================== */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-section-icon">
              <Lock size={19} />
            </div>

            <div>
              <h2>
                Security Settings
              </h2>

              <p>
                Configure authentication and session
                behaviour.
              </p>
            </div>

          </div>

          <div className="settings-options">

            {/* Session Timeout */}

            <div className="settings-toggle">

              <div className="toggle-icon">
                <Lock size={16} />
              </div>

              <div className="toggle-content">

                <strong>
                  Session Timeout
                </strong>

                <span>
                  Automatically log users out after
                  inactivity.
                </span>

              </div>

              <select
                name="sessionTimeout"
                value={settings.sessionTimeout}
                onChange={handleChange}
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <option value="15">
                  15 minutes
                </option>

                <option value="30">
                  30 minutes
                </option>

                <option value="60">
                  1 hour
                </option>

                <option value="120">
                  2 hours
                </option>
              </select>

            </div>

            {/* Maintenance Mode */}

            <label className="settings-toggle danger-option">

              <div className="toggle-icon">
                <ShieldCheck size={16} />
              </div>

              <div className="toggle-content">

                <strong>
                  Maintenance Mode
                </strong>

                <span>
                  Temporarily restrict access to the
                  application.
                </span>

              </div>

              <input
                type="checkbox"
                name="maintenanceMode"
                checked={
                  settings.maintenanceMode
                }
                onChange={handleChange}
              />

              <span className="toggle-switch" />

            </label>

          </div>

        </section>

        {/* =====================================
            ACTION BUTTONS
        ====================================== */}

        <div className="settings-actions">

          <button
            type="button"
            className="settings-cancel"
            onClick={handleReset}
          >
            <RotateCcw size={15} />
            Reset
          </button>

          <button
            type="button"
            className="settings-save"
            onClick={handleSave}
          >
            <Save size={15} />
            Save Settings
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default SystemSettings;