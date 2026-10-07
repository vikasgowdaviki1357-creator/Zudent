import { useRef, useState } from "react";
import {
  UserRound,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Pencil,
  Camera,
  Award,
  Code2,
  BriefcaseBusiness,
  FileText,
  Download,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Plus,
  X,
} from "lucide-react";

function Profile() {
  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const [profile, setProfile] = useState({
    name: "Vikas Gowda",
    usn: "1JT25CS001",
    email: "vikas@jit.edu.in",
    phone: "+91 98765 43210",
    branch: "Computer Science & Engineering",
    semester: "2nd Semester",
    section: "A",
    cgpa: "9.48",
    admissionYear: "2025",
  });

  const [skills, setSkills] = useState([
    "C",
    "Python",
    "HTML",
    "CSS",
    "React",
  ]);

  const [resume, setResume] = useState(null);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const addSkill = () => {
    const skill = newSkill.trim();

    if (!skill || skills.includes(skill)) return;

    setSkills((current) => [...current, skill]);
    setNewSkill("");
  };

  const removeSkill = (skill) => {
    setSkills((current) =>
      current.filter((item) => item !== skill)
    );
  };

  const handleResume = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setResume(file);
  };

  return (
    <div className="profile-page">
      <div className="module-heading">
        <div>
          <p className="page-eyebrow">MY ACCOUNT</p>
          <h1>Profile</h1>
          <p>
            Manage your personal, academic and career information.
          </p>
        </div>

        <button
          className="profile-edit-button"
          onClick={() => setEditing(!editing)}
        >
          {editing ? (
            <>
              <CheckCircle2 size={16} />
              Save Profile
            </>
          ) : (
            <>
              <Pencil size={15} />
              Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="profile-hero">
        <div className="profile-avatar-large">
          VG

          <button>
            <Camera size={15} />
          </button>
        </div>

        <div className="profile-identity">
          <div className="profile-name-row">
            <h2>{profile.name}</h2>

            <span>
              <CheckCircle2 size={13} />
              Verified Student
            </span>
          </div>

          <p>{profile.usn}</p>

          <div className="profile-hero-details">
            <span>
              <GraduationCap size={14} />
              {profile.branch}
            </span>

            <span>
              <Mail size={14} />
              {profile.email}
            </span>
          </div>
        </div>

        <div className="profile-cgpa">
          <span>Current CGPA</span>
          <strong>{profile.cgpa}</strong>
          <small>Academic performance</small>
        </div>
      </div>

      <div className="profile-layout">
        <div className="profile-main-column">
          <ProfileSection
            title="Personal Information"
            icon={<UserRound size={18} />}
          >
            <div className="profile-form-grid">
              <ProfileField
                label="Full Name"
                name="name"
                value={profile.name}
                editing={editing}
                onChange={handleProfileChange}
              />

              <ProfileField
                label="USN"
                name="usn"
                value={profile.usn}
                editing={false}
              />

              <ProfileField
                label="Email Address"
                name="email"
                value={profile.email}
                editing={editing}
                onChange={handleProfileChange}
                icon={<Mail size={14} />}
              />

              <ProfileField
                label="Phone Number"
                name="phone"
                value={profile.phone}
                editing={editing}
                onChange={handleProfileChange}
                icon={<Phone size={14} />}
              />
            </div>
          </ProfileSection>

          <ProfileSection
            title="Academic Information"
            icon={<GraduationCap size={18} />}
          >
            <div className="profile-form-grid">
              <ProfileField
                label="Department"
                value={profile.branch}
              />

              <ProfileField
                label="Semester"
                value={profile.semester}
              />

              <ProfileField
                label="Section"
                value={profile.section}
              />

              <ProfileField
                label="Admission Year"
                value={profile.admissionYear}
              />

              <ProfileField
                label="CGPA"
                value={profile.cgpa}
              />

              <ProfileField
                label="College"
                value="Jyothy Institute of Technology"
              />
            </div>
          </ProfileSection>

          <ProfileSection
            title="Skills"
            icon={<Code2 size={18} />}
          >
            <div className="skills-container">
              {skills.map((skill) => (
                <div className="skill-chip" key={skill}>
                  {skill}

                  {editing && (
                    <button onClick={() => removeSkill(skill)}>
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {editing && (
              <div className="add-skill">
                <input
                  value={newSkill}
                  onChange={(event) =>
                    setNewSkill(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Add a skill..."
                />

                <button onClick={addSkill}>
                  <Plus size={15} />
                  Add
                </button>
              </div>
            )}
          </ProfileSection>

          <ProfileSection
            title="Achievements"
            icon={<Award size={18} />}
          >
            <div className="achievement-list">
              <Achievement
                title="Academic Excellence"
                description="CGPA above 9.0"
                date="2026"
              />

              <Achievement
                title="Project Development"
                description="Developed JIT Share Hub"
                date="2026"
              />
            </div>
          </ProfileSection>
        </div>

        <div className="profile-side-column">
          <div className="profile-side-card">
            <div className="side-card-heading">
              <BriefcaseBusiness size={18} />
              <h3>Placement Profile</h3>
            </div>

            <div className="profile-completion">
              <div>
                <strong>Profile Completion</strong>
                <span>85%</span>
              </div>

              <div className="completion-track">
                <div style={{ width: "85%" }} />
              </div>
            </div>

            <ProfileCheck text="Personal information" />
            <ProfileCheck text="Academic details" />
            <ProfileCheck text="Skills added" />
            <ProfileCheck
              text="Resume uploaded"
              completed={Boolean(resume)}
            />
          </div>

          <div className="profile-side-card">
            <div className="side-card-heading">
              <FileText size={18} />
              <h3>Resume</h3>
            </div>

            {resume ? (
              <div className="resume-uploaded">
                <div>
                  <FileText size={22} />
                </div>

                <section>
                  <strong>{resume.name}</strong>
                  <span>
                    {(resume.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </section>
              </div>
            ) : (
              <div className="resume-empty">
                <Upload size={25} />
                <strong>No resume uploaded</strong>
                <span>
                  Upload your latest placement resume.
                </span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              hidden
              onChange={handleResume}
            />

            <button
              className="resume-button"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={14} />
              {resume ? "Replace Resume" : "Upload Resume"}
            </button>
          </div>

          <div className="profile-side-card">
            <div className="side-card-heading">
              <ShieldCheck size={18} />
              <h3>Account</h3>
            </div>

            <button className="account-option">
              Change Password
            </button>

            <button className="account-option">
              Notification Settings
            </button>

            <button className="account-option">
              Privacy & Security
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ title, icon, children }) {
  return (
    <section className="profile-section">
      <div className="profile-section-heading">
        <div>{icon}</div>
        <h3>{title}</h3>
      </div>

      {children}
    </section>
  );
}

function ProfileField({
  label,
  name,
  value,
  editing = false,
  onChange,
  icon,
}) {
  return (
    <div className="profile-field">
      <label>{label}</label>

      {editing ? (
        <input
          name={name}
          value={value}
          onChange={onChange}
        />
      ) : (
        <div>
          {icon}
          <span>{value}</span>
        </div>
      )}
    </div>
  );
}

function Achievement({ title, description, date }) {
  return (
    <div className="achievement-item">
      <div>
        <Award size={18} />
      </div>

      <section>
        <strong>{title}</strong>
        <span>{description}</span>
      </section>

      <small>{date}</small>
    </div>
  );
}

function ProfileCheck({ text, completed = true }) {
  return (
    <div
      className={`profile-check-item ${
        completed ? "complete" : ""
      }`}
    >
      <CheckCircle2 size={15} />
      <span>{text}</span>
    </div>
  );
}

export default Profile;