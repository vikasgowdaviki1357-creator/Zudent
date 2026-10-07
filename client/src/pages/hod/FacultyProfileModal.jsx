import {
  X,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Users,
  CalendarDays,
} from "lucide-react";

import "./FacultyProfileModal.css";

function FacultyProfileModal({ faculty, onClose }) {
  if (!faculty) return null;

  return (
    <div className="faculty-modal-overlay" onClick={onClose}>
      <div
        className="faculty-profile-modal"
        onClick={(event) => event.stopPropagation()}
      >

        {/* HEADER */}

        <div className="faculty-modal-header">

          <div className="faculty-modal-title">
            Faculty Profile
          </div>

          <button
            className="faculty-modal-close"
            onClick={onClose}
            type="button"
          >
            <X size={19} />
          </button>

        </div>

        {/* PROFILE */}

        <div className="faculty-profile-top">

          <div className="faculty-profile-avatar">
            {faculty.initials}
          </div>

          <div>

            <h2>{faculty.name}</h2>

            <p>
              {faculty.role} • {faculty.department}
            </p>

            <span
              className={`faculty-profile-status ${
                faculty.status === "Active"
                  ? "active"
                  : "leave"
              }`}
            >
              <span></span>
              {faculty.status}
            </span>

          </div>

        </div>

        {/* CONTACT */}

        <div className="faculty-profile-section">

          <h3>Contact Information</h3>

          <div className="faculty-contact-grid">

            <div className="faculty-contact-item">
              <Mail size={17} />
              <div>
                <span>Email</span>
                <strong>
                  {faculty.name
                    .toLowerCase()
                    .replaceAll(" ", ".")}@jit.ac.in
                </strong>
              </div>
            </div>

            <div className="faculty-contact-item">
              <Phone size={17} />
              <div>
                <span>Phone</span>
                <strong>+91 98765 43210</strong>
              </div>
            </div>

            <div className="faculty-contact-item">
              <Building2 size={17} />
              <div>
                <span>Department</span>
                <strong>{faculty.department}</strong>
              </div>
            </div>

            <div className="faculty-contact-item">
              <CalendarDays size={17} />
              <div>
                <span>Experience</span>
                <strong>8 Years</strong>
              </div>
            </div>

          </div>

        </div>

        {/* SUBJECTS */}

        <div className="faculty-profile-section">

          <h3>Teaching Subjects</h3>

          <div className="faculty-profile-subjects">

            {faculty.subjects.map((subject) => (
              <span key={subject}>
                <BookOpen size={14} />
                {subject}
              </span>
            ))}

          </div>

        </div>

        {/* TEACHING SUMMARY */}

        <div className="faculty-profile-section">

          <h3>Teaching Overview</h3>

          <div className="faculty-overview-grid">

            <div>
              <Users size={19} />
              <strong>{faculty.students}</strong>
              <span>Students</span>
            </div>

            <div>
              <BookOpen size={19} />
              <strong>{faculty.classes}</strong>
              <span>Classes</span>
            </div>

            <div>
              <CalendarDays size={19} />
              <strong>92%</strong>
              <span>Attendance</span>
            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="faculty-modal-footer">

          <button
            className="faculty-modal-secondary"
            onClick={onClose}
            type="button"
          >
            Close
          </button>

          <button
            className="faculty-modal-primary"
            type="button"
            onClick={() =>
              alert("Edit Faculty will be connected later.")
            }
          >
            Edit Faculty
          </button>

        </div>

      </div>
    </div>
  );
}

export default FacultyProfileModal;