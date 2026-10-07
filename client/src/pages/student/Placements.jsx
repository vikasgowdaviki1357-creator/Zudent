import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  GraduationCap,
  Search,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

const opportunities = [
  {
    id: 1,
    company: "TechNova",
    role: "Software Developer Intern",
    type: "Internship",
    location: "Bengaluru",
    package: "₹25,000 / month",
    deadline: "30 Jul 2026",
    minCgpa: 7.5,
    branches: ["CSE", "ISE"],
    skills: ["Java", "Python", "DSA"],
  },
  {
    id: 2,
    company: "CloudSphere",
    role: "Graduate Engineer Trainee",
    type: "Full Time",
    location: "Bengaluru",
    package: "₹6.5 LPA",
    deadline: "04 Aug 2026",
    minCgpa: 7,
    branches: ["CSE", "ISE", "ECE"],
    skills: ["JavaScript", "React", "SQL"],
  },
  {
    id: 3,
    company: "DataWorks",
    role: "Data Analyst Intern",
    type: "Internship",
    location: "Hybrid",
    package: "₹20,000 / month",
    deadline: "08 Aug 2026",
    minCgpa: 8,
    branches: ["CSE", "ISE"],
    skills: ["Python", "SQL", "Excel"],
  },
  {
    id: 4,
    company: "CoreTech Industries",
    role: "Associate Engineer",
    type: "Full Time",
    location: "Mysuru",
    package: "₹5.2 LPA",
    deadline: "12 Aug 2026",
    minCgpa: 6.5,
    branches: ["ECE", "EEE", "MECH"],
    skills: ["Problem Solving", "Communication"],
  },
];

const preparationResources = [
  {
    title: "Aptitude Preparation",
    description: "Quantitative aptitude, reasoning and verbal practice.",
    type: "Practice",
  },
  {
    title: "DSA Interview Guide",
    description: "Important data structures and coding interview topics.",
    type: "Guide",
  },
  {
    title: "Resume Preparation",
    description: "Build a professional placement-ready resume.",
    type: "Template",
  },
  {
    title: "HR Interview Questions",
    description: "Frequently asked HR and behavioral questions.",
    type: "Questions",
  },
];

function Placements() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("All");
  const [applications, setApplications] = useState([]);

  const student = {
    branch: "CSE",
    cgpa: 9.48,
  };

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((job) => {
      const matchesSearch =
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.role.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        jobType === "All" || job.type === jobType;

      return matchesSearch && matchesType;
    });
  }, [search, jobType]);

  const isEligible = (job) =>
    student.cgpa >= job.minCgpa &&
    job.branches.includes(student.branch);

  const apply = (job) => {
    if (!isEligible(job)) return;

    if (!applications.some((item) => item.id === job.id)) {
      setApplications((current) => [
        ...current,
        {
          ...job,
          applicationStatus: "Applied",
        },
      ]);
    }
  };

  return (
    <div className="placements-page">
      <div className="module-heading">
        <div>
          <p className="page-eyebrow">CAREER CENTER</p>
          <h1>Placements</h1>
          <p>
            Discover opportunities, check eligibility and prepare for your
            career.
          </p>
        </div>

        <div className="semester-badge">
          <BriefcaseBusiness size={19} />
          Placement Portal
        </div>
      </div>

      <div className="placement-tabs">
        {[
          "Overview",
          "Opportunities",
          "My Applications",
          "Preparation",
        ].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <PlacementOverview
          applications={applications}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === "Opportunities" && (
        <Opportunities
          jobs={filteredOpportunities}
          search={search}
          setSearch={setSearch}
          jobType={jobType}
          setJobType={setJobType}
          isEligible={isEligible}
          applications={applications}
          apply={apply}
        />
      )}

      {activeTab === "My Applications" && (
        <Applications applications={applications} />
      )}

      {activeTab === "Preparation" && <Preparation />}
    </div>
  );
}

function PlacementOverview({ applications, setActiveTab }) {
  return (
    <>
      <div className="placement-stat-grid">
        <PlacementStat
          icon={<Building2 />}
          value="24"
          label="Companies"
        />

        <PlacementStat
          icon={<BriefcaseBusiness />}
          value={opportunities.length}
          label="Open Opportunities"
        />

        <PlacementStat
          icon={<FileText />}
          value={applications.length}
          label="My Applications"
        />

        <PlacementStat
          icon={<TrendingUp />}
          value="9.48"
          label="Current CGPA"
        />
      </div>

      <div className="placement-layout">
        <section className="module-card">
          <div className="card-header">
            <h3>Recommended Opportunities</h3>

            <button onClick={() => setActiveTab("Opportunities")}>
              View all
              <ExternalLink size={14} />
            </button>
          </div>

          {opportunities.slice(0, 3).map((job) => (
            <div className="recommended-job" key={job.id}>
              <CompanyLogo name={job.company} />

              <div>
                <strong>{job.role}</strong>
                <span>
                  {job.company} • {job.location}
                </span>
              </div>

              <span className="job-type">{job.type}</span>
            </div>
          ))}
        </section>

        <section className="module-card eligibility-card">
          <Target size={27} />

          <h3>Your Placement Profile</h3>

          <div className="profile-check">
            <CheckCircle2 size={16} />
            CGPA: 9.48
          </div>

          <div className="profile-check">
            <CheckCircle2 size={16} />
            Branch: CSE
          </div>

          <div className="profile-check">
            <CheckCircle2 size={16} />
            Profile active
          </div>

          <button onClick={() => setActiveTab("Opportunities")}>
            Find Eligible Jobs
          </button>
        </section>
      </div>

      <section className="module-card placement-updates">
        <div className="card-header">
          <h3>Placement Updates</h3>
        </div>

        <PlacementUpdate
          title="Placement aptitude training begins next week"
          date="24 Jul 2026"
        />

        <PlacementUpdate
          title="Resume review registrations are now open"
          date="22 Jul 2026"
        />

        <PlacementUpdate
          title="Mock interview session announced"
          date="20 Jul 2026"
        />
      </section>
    </>
  );
}

function PlacementStat({ icon, value, label }) {
  return (
    <div className="placement-stat">
      <div>{icon}</div>

      <section>
        <strong>{value}</strong>
        <span>{label}</span>
      </section>
    </div>
  );
}

function Opportunities({
  jobs,
  search,
  setSearch,
  jobType,
  setJobType,
  isEligible,
  applications,
  apply,
}) {
  return (
    <>
      <div className="placement-toolbar">
        <div className="resource-search">
          <Search size={18} />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search companies or job roles..."
          />
        </div>

        <select
          value={jobType}
          onChange={(event) => setJobType(event.target.value)}
        >
          <option>All</option>
          <option>Internship</option>
          <option>Full Time</option>
        </select>
      </div>

      <div className="job-list">
        {jobs.map((job) => {
          const eligible = isEligible(job);
          const applied = applications.some(
            (application) => application.id === job.id
          );

          return (
            <article className="job-card" key={job.id}>
              <div className="job-main">
                <CompanyLogo name={job.company} />

                <div className="job-information">
                  <div className="job-title-line">
                    <h3>{job.role}</h3>

                    <span
                      className={
                        eligible
                          ? "eligibility-badge eligible"
                          : "eligibility-badge not-eligible"
                      }
                    >
                      {eligible ? "Eligible" : "Not Eligible"}
                    </span>
                  </div>

                  <strong>{job.company}</strong>

                  <div className="job-meta">
                    <span>
                      <Building2 size={13} />
                      {job.location}
                    </span>

                    <span>
                      <BriefcaseBusiness size={13} />
                      {job.type}
                    </span>

                    <span>
                      <CalendarDays size={13} />
                      Apply by {job.deadline}
                    </span>
                  </div>

                  <div className="job-skills">
                    {job.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="job-action">
                  <strong>{job.package}</strong>

                  <small>Min CGPA: {job.minCgpa}</small>

                  <button
                    disabled={!eligible || applied}
                    onClick={() => apply(job)}
                  >
                    {applied
                      ? "Applied"
                      : eligible
                        ? "Apply Now"
                        : "Not Eligible"}
                  </button>
                </div>
              </div>

              <div className="job-branches">
                Eligible branches: {job.branches.join(", ")}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

function Applications({ applications }) {
  if (applications.length === 0) {
    return (
      <div className="empty-state">
        <BriefcaseBusiness size={36} />
        <h3>No applications yet</h3>
        <p>Your placement applications will appear here.</p>
      </div>
    );
  }

  return (
    <div className="module-card table-card">
      <h3>My Applications</h3>

      <div className="responsive-table">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Type</th>
              <th>Package</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((application) => (
              <tr key={application.id}>
                <td>
                  <strong>{application.company}</strong>
                </td>

                <td>{application.role}</td>
                <td>{application.type}</td>
                <td>{application.package}</td>

                <td>
                  <span className="application-status">
                    {application.applicationStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Preparation() {
  return (
    <>
      <div className="preparation-banner">
        <div>
          <span>PLACEMENT PREPARATION</span>
          <h2>Prepare. Practice. Get Placed.</h2>
          <p>
            Access aptitude, coding, resume and interview preparation
            resources.
          </p>
        </div>

        <GraduationCap size={55} />
      </div>

      <div className="preparation-grid">
        {preparationResources.map((resource) => (
          <article className="preparation-card" key={resource.title}>
            <div>
              <FileText size={20} />
            </div>

            <span>{resource.type}</span>
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>

            <button
              onClick={() =>
                alert(
                  "Preparation content will be connected to the Resources Hub."
                )
              }
            >
              Open Resource
            </button>
          </article>
        ))}
      </div>
    </>
  );
}

function CompanyLogo({ name }) {
  return (
    <div className="company-logo">
      {name.charAt(0)}
    </div>
  );
}

function PlacementUpdate({ title, date }) {
  return (
    <div className="placement-update">
      <div>
        <Clock3 size={16} />
      </div>

      <section>
        <strong>{title}</strong>
        <span>{date}</span>
      </section>
    </div>
  );
}

export default Placements;