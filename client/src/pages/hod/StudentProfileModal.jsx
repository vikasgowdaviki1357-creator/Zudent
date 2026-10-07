import {
  X,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  BookOpen,
  CalendarDays,
  UserRound,
} from "lucide-react";

import "./StudentProfileModal.css";

function StudentProfileModal({ student, onClose }) {
  if (!student) return null;

  return (
    <div className="student-modal-overlay" onClick={onClose}>

      <div
        className="student-profile-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="student-modal-header">

          <strong>Student Profile</strong>

          <button onClick={onClose}>
            <X size={18} />
          </button>

        </div>

        <div className="student-profile-top">

          <div className="student-profile-avatar">
            {student.initials}
          </div>

          <div>
            <h2>{student.name}</h2>

            <p>
              {student.usn} • {student.department}
            </p>

            <span className="student-profile-active">
              <span></span>
              {student.status}
            </span>
          </div>

        </div>

        <div className="student-profile-section">

          <h3>Academic Information</h3>

          <div className="student-info-grid">

            <div>
              <GraduationCap />
              <span>Year</span>
              <strong>{student.year}</strong>
            </div>

            <div>
              <BookOpen />
              <span>Semester</span>
              <strong>{student.semester}</strong>
            </div>

            <div>
              <Building2 />
              <span>Department</span>
              <strong>{student.department}</strong>
            </div>

            <div>
              <UserRound />
              <span>Section</span>
              <strong>{student.section}</strong>
            </div>

          </div>

        </div>

        <div className="student-profile-section">

          <h3>Academic Performance</h3>

          <div className="student-performance">

            <div>
              <strong>{student.cgpa}</strong>
              <span>CGPA</span>
            </div>

            <div>
              <strong>{student.attendance}</strong>
              <span>Attendance</span>
            </div>

            <div>
              <strong>Good</strong>
              <span>Academic Status</span>
            </div>

          </div>

        </div>

        <div className="student-profile-section">

          <h3>Contact Information</h3>

          <div className="student-contact-list">

            <div>
              <Mail size={17} />
              <span>{student.email}</span>
            </div>

            <div>
              <Phone size={17} />
              <span>{student.phone}</span>
            </div>

          </div>

        </div>

        <div className="student-profile-footer">

          <button onClick={onClose}>
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

export default StudentProfileModal;