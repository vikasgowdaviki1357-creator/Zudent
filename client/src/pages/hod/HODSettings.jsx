import { useState } from "react";
import {
  Settings,
  Building2,
  Bell,
  ShieldCheck,
  Save,
  Mail,
} from "lucide-react";
import "./HODSettings.css";

function HODSettings() {
  const [notifications, setNotifications] = useState(true);
  const [attendanceAlerts, setAttendanceAlerts] = useState(true);
  const [emailReports, setEmailReports] = useState(false);

  const [department, setDepartment] = useState({
    name: "Computer Science and Engineering",
    code: "CSE",
    hodName: "Dr. Sunita Sharma",
    email: "hod.cse@jit.edu.in",
    academicYear: "2026-27",
  });

  const handleChange = (e) => {
    setDepartment({
      ...department,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "jit_hod_settings",
      JSON.stringify(department)
    );

    alert("Settings saved successfully.");
  };

  return (
    <div className="hod-settings">
      <div className="settings-header">
        <div>
          <p className="settings-eyebrow">HOD PORTAL</p>
          <h1>Settings</h1>
          <p>
            Manage department information and HOD portal preferences.
          </p>
        </div>
      </div>

      <div className="settings-grid">
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              <Building2 size={21} />
            </div>

            <div>
              <h2>Department Information</h2>
              <p>Basic information about your department.</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="settings-form">
            <div className="settings-field full">
              <label>Department Name</label>
              <input
                name="name"
                value={department.name}
                onChange={handleChange}
              />
            </div>

            <div className="settings-field">
              <label>Department Code</label>
              <input
                name="code"
                value={department.code}
                onChange={handleChange}
              />
            </div>

            <div className="settings-field">
              <label>Academic Year</label>
              <select
                name="academicYear"
                value={department.academicYear}
                onChange={handleChange}
              >
                <option>2026-27</option>
                <option>2025-26</option>
                <option>2024-25</option>
              </select>
            </div>

            <div className="settings-field">
              <label>HOD Name</label>
              <input
                name="hodName"
                value={department.hodName}
                onChange={handleChange}
              />
            </div>

            <div className="settings-field">
              <label>HOD Email</label>
              <div className="settings-input-icon">
                <Mail size={17} />
                <input
                  name="email"
                  type="email"
                  value={department.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="settings-actions">
              <button type="submit">
                <Save size={17} />
                Save Changes
              </button>
            </div>
          </form>
        </section>

        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              <Bell size={21} />
            </div>

            <div>
              <h2>Notifications</h2>
              <p>Choose which alerts you want to receive.</p>
            </div>
          </div>

          <div className="settings-options">
            <div className="settings-option">
              <div>
                <strong>Portal Notifications</strong>
                <span>
                  Receive important HOD portal notifications.
                </span>
              </div>

              <button
                type="button"
                className={`toggle ${notifications ? "on" : ""}`}
                onClick={() => setNotifications(!notifications)}
              >
                <span />
              </button>
            </div>

            <div className="settings-option">
              <div>
                <strong>Attendance Alerts</strong>
                <span>
                  Get alerts for students below attendance requirements.
                </span>
              </div>

              <button
                type="button"
                className={`toggle ${attendanceAlerts ? "on" : ""}`}
                onClick={() =>
                  setAttendanceAlerts(!attendanceAlerts)
                }
              >
                <span />
              </button>
            </div>

            <div className="settings-option">
              <div>
                <strong>Email Reports</strong>
                <span>
                  Receive department reports through email.
                </span>
              </div>

              <button
                type="button"
                className={`toggle ${emailReports ? "on" : ""}`}
                onClick={() => setEmailReports(!emailReports)}
              >
                <span />
              </button>
            </div>
          </div>
        </section>

        <section className="settings-card security-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h2>Security</h2>
              <p>Manage your HOD account security.</p>
            </div>
          </div>

          <div className="security-info">
            <div>
              <strong>Account Role</strong>
              <span>Head of Department</span>
            </div>

            <div>
              <strong>Department Access</strong>
              <span>Computer Science and Engineering</span>
            </div>

            <div>
              <strong>Portal Access</strong>
              <span className="access-active">
                Active
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HODSettings;