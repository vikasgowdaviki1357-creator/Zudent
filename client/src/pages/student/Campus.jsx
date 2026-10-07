import { useState } from "react";
import {
  Bell,
  Bus,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Flag,
  MapPin,
  Megaphone,
  Search,
  Send,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

const notices = [
  {
    id: 1,
    title: "Internal Assessment Examination Schedule",
    category: "Academic",
    date: "24 Jul 2026",
    priority: "Important",
    description:
      "Students are informed that the Internal Assessment examination schedule has been published.",
  },
  {
    id: 2,
    title: "Kargil Vijay Diwas Programme",
    category: "General",
    date: "23 Jul 2026",
    priority: "Normal",
    description:
      "Kargil Vijay Diwas will be observed on campus with a special programme.",
  },
  {
    id: 3,
    title: "Placement Training Registration",
    category: "Placement",
    date: "22 Jul 2026",
    priority: "Important",
    description:
      "Eligible students can register for the upcoming placement training programme.",
  },
  {
    id: 4,
    title: "Library Timing Update",
    category: "General",
    date: "20 Jul 2026",
    priority: "Normal",
    description:
      "The library will remain open for extended hours during the examination period.",
  },
];

const clubs = [
  {
    id: 1,
    name: "Coding Club",
    category: "Technical",
    members: 186,
    description:
      "Coding contests, hackathons, development sessions and technical workshops.",
  },
  {
    id: 2,
    name: "Cultural Club",
    category: "Cultural",
    members: 245,
    description:
      "Dance, music, theatre and cultural activities across the campus.",
  },
  {
    id: 3,
    name: "Robotics Club",
    category: "Technical",
    members: 104,
    description:
      "Build robots, embedded systems and participate in technical competitions.",
  },
  {
    id: 4,
    name: "Sports Club",
    category: "Sports",
    members: 312,
    description:
      "Cricket, football, volleyball, athletics and other sporting activities.",
  },
];

const buses = [
  {
    id: 1,
    route: "Route 01",
    name: "Banashankari → JIT",
    departure: "7:15 AM",
    arrival: "8:25 AM",
    status: "On Time",
  },
  {
    id: 2,
    route: "Route 02",
    name: "Kengeri → JIT",
    departure: "7:30 AM",
    arrival: "8:20 AM",
    status: "On Time",
  },
  {
    id: 3,
    route: "Route 03",
    name: "Vijayanagar → JIT",
    departure: "7:10 AM",
    arrival: "8:25 AM",
    status: "Delayed",
  },
];

const initialLostFound = [
  {
    id: 1,
    type: "Lost",
    item: "Black Scientific Calculator",
    location: "CSE Block - Room 204",
    date: "23 Jul 2026",
    owner: "Student",
  },
  {
    id: 2,
    type: "Found",
    item: "Blue Water Bottle",
    location: "Library",
    date: "22 Jul 2026",
    owner: "Library Staff",
  },
  {
    id: 3,
    type: "Lost",
    item: "College ID Card",
    location: "Canteen",
    date: "21 Jul 2026",
    owner: "Student",
  },
];

const campusTabs = [
  "Notices",
  "Clubs",
  "Bus",
  "Lost & Found",
  "Leave",
  "Complaints",
];

function Campus() {
  const [activeTab, setActiveTab] = useState("Notices");

  return (
    <div className="campus-page">
      <div className="module-heading">
        <div>
          <p className="page-eyebrow">JIT CAMPUS</p>
          <h1>Campus Hub</h1>
          <p>
            Access notices, clubs, transport and student support services.
          </p>
        </div>

        <div className="semester-badge">
          <ShieldCheck size={19} />
          Student Services
        </div>
      </div>

      <div className="campus-tabs">
        {campusTabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Notices" && <Notices />}
      {activeTab === "Clubs" && <Clubs />}
      {activeTab === "Bus" && <BusSection />}
      {activeTab === "Lost & Found" && <LostFound />}
      {activeTab === "Leave" && <Leave />}
      {activeTab === "Complaints" && <Complaints />}
    </div>
  );
}

function Notices() {
  const [search, setSearch] = useState("");

  const filtered = notices.filter((notice) =>
    notice.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="campus-search">
        <Search size={18} />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search notices..."
        />
      </div>

      <div className="notice-list">
        {filtered.map((notice) => (
          <article className="campus-notice" key={notice.id}>
            <div className="campus-notice-icon">
              <Megaphone size={20} />
            </div>

            <div className="campus-notice-content">
              <div className="notice-title-row">
                <h3>{notice.title}</h3>

                {notice.priority === "Important" && (
                  <span className="important-badge">Important</span>
                )}
              </div>

              <div className="notice-metadata">
                <span>{notice.category}</span>
                <span>{notice.date}</span>
              </div>

              <p>{notice.description}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function Clubs() {
  const [joined, setJoined] = useState([]);

  const toggleClub = (id) => {
    setJoined((current) =>
      current.includes(id)
        ? current.filter((clubId) => clubId !== id)
        : [...current, id]
    );
  };

  return (
    <div className="club-grid">
      {clubs.map((club) => {
        const isJoined = joined.includes(club.id);

        return (
          <article className="club-card" key={club.id}>
            <div className="club-icon">
              <Users size={24} />
            </div>

            <span>{club.category}</span>
            <h3>{club.name}</h3>
            <p>{club.description}</p>

            <div className="club-members">
              <Users size={14} />
              {club.members + (isJoined ? 1 : 0)} members
            </div>

            <button
              className={isJoined ? "joined" : ""}
              onClick={() => toggleClub(club.id)}
            >
              {isJoined ? (
                <>
                  <CheckCircle2 size={15} />
                  Joined
                </>
              ) : (
                "Join Club"
              )}
            </button>
          </article>
        );
      })}
    </div>
  );
}

function BusSection() {
  return (
    <>
      <div className="bus-banner">
        <div>
          <span>COLLEGE TRANSPORT</span>
          <h2>JIT Bus Service</h2>
          <p>
            View your routes, departure times and current bus status.
          </p>
        </div>

        <Bus size={50} />
      </div>

      <div className="bus-grid">
        {buses.map((bus) => (
          <article className="bus-card" key={bus.id}>
            <div className="bus-card-header">
              <div>
                <span>{bus.route}</span>
                <h3>{bus.name}</h3>
              </div>

              <span
                className={
                  bus.status === "On Time"
                    ? "bus-status on-time"
                    : "bus-status delayed"
                }
              >
                {bus.status}
              </span>
            </div>

            <div className="bus-times">
              <div>
                <Clock3 size={17} />

                <section>
                  <span>Departure</span>
                  <strong>{bus.departure}</strong>
                </section>
              </div>

              <div>
                <MapPin size={17} />

                <section>
                  <span>Campus Arrival</span>
                  <strong>{bus.arrival}</strong>
                </section>
              </div>
            </div>

            <button
              onClick={() =>
                alert(
                  "Live GPS tracking will be connected when the transport backend is added."
                )
              }
            >
              <MapPin size={15} />
              Track Bus
            </button>
          </article>
        ))}
      </div>
    </>
  );
}

function LostFound() {
  const [items, setItems] = useState(initialLostFound);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const filtered =
    filter === "All"
      ? items
      : items.filter((item) => item.type === filter);

  const report = (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    setItems((current) => [
      {
        id: Date.now(),
        type: form.get("type"),
        item: form.get("item"),
        location: form.get("location"),
        date: "Today",
        owner: "You",
      },
      ...current,
    ]);

    setShowForm(false);
  };

  return (
    <>
      <div className="lost-found-header">
        <div className="lost-found-filter">
          {["All", "Lost", "Found"].map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          className="primary-action"
          onClick={() => setShowForm(true)}
        >
          <Flag size={16} />
          Report Item
        </button>
      </div>

      <div className="lost-found-grid">
        {filtered.map((item) => (
          <article className="lost-found-card" key={item.id}>
            <span
              className={
                item.type === "Lost"
                  ? "item-type lost"
                  : "item-type found"
              }
            >
              {item.type}
            </span>

            <h3>{item.item}</h3>

            <div>
              <MapPin size={14} />
              {item.location}
            </div>

            <div>
              <CalendarDays size={14} />
              {item.date}
            </div>

            <small>Reported by {item.owner}</small>
          </article>
        ))}
      </div>

      {showForm && (
        <LostFoundModal
          close={() => setShowForm(false)}
          submit={report}
        />
      )}
    </>
  );
}

function LostFoundModal({ close, submit }) {
  return (
    <div className="modal-overlay">
      <div className="resource-modal">
        <div className="modal-header">
          <div>
            <h2>Report Lost / Found Item</h2>
            <p>Help return lost items to their owners.</p>
          </div>

          <button onClick={close}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit}>
          <label>Report Type</label>

          <select name="type">
            <option>Lost</option>
            <option>Found</option>
          </select>

          <label>Item</label>

          <input
            name="item"
            placeholder="Example: Scientific Calculator"
            required
          />

          <label>Location</label>

          <input
            name="location"
            placeholder="Where was it lost/found?"
            required
          />

          <label>Description</label>

          <textarea
            rows="4"
            placeholder="Provide identifying details..."
          />

          <div className="modal-actions">
            <button type="button" onClick={close}>
              Cancel
            </button>

            <button className="primary-action">
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Leave() {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const submitLeave = (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    setRequests((current) => [
      {
        id: Date.now(),
        from: form.get("from"),
        to: form.get("to"),
        reason: form.get("reason"),
        status: "Pending",
      },
      ...current,
    ]);

    setShowForm(false);
  };

  return (
    <>
      <div className="service-header">
        <div>
          <h3>Leave Requests</h3>
          <p>Apply for leave and track approval status.</p>
        </div>

        <button
          className="primary-action"
          onClick={() => setShowForm(true)}
        >
          <FileText size={16} />
          Apply for Leave
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <CalendarDays size={35} />
          <h3>No leave requests</h3>
          <p>Your submitted leave applications will appear here.</p>
        </div>
      ) : (
        <div className="module-card table-card">
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.from}</td>
                    <td>{request.to}</td>
                    <td>{request.reason}</td>
                    <td>
                      <span className="status-pill pending">
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <LeaveModal
          close={() => setShowForm(false)}
          submit={submitLeave}
        />
      )}
    </>
  );
}

function LeaveModal({ close, submit }) {
  return (
    <div className="modal-overlay">
      <div className="resource-modal">
        <div className="modal-header">
          <div>
            <h2>Apply for Leave</h2>
            <p>Submit your leave request for approval.</p>
          </div>

          <button onClick={close}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="modal-form-grid">
            <div>
              <label>From Date</label>
              <input type="date" name="from" required />
            </div>

            <div>
              <label>To Date</label>
              <input type="date" name="to" required />
            </div>
          </div>

          <label>Reason</label>

          <textarea
            name="reason"
            rows="5"
            placeholder="Explain the reason for leave..."
            required
          />

          <div className="modal-actions">
            <button type="button" onClick={close}>
              Cancel
            </button>

            <button className="primary-action">
              <Send size={15} />
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const submitComplaint = (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    setComplaints((current) => [
      {
        id: `CMP-${String(Date.now()).slice(-5)}`,
        category: form.get("category"),
        subject: form.get("subject"),
        status: "Submitted",
        date: "Today",
      },
      ...current,
    ]);

    setShowForm(false);
  };

  return (
    <>
      <div className="service-header">
        <div>
          <h3>Complaints & Support</h3>
          <p>Report campus issues and track their resolution.</p>
        </div>

        <button
          className="primary-action"
          onClick={() => setShowForm(true)}
        >
          <Bell size={16} />
          New Complaint
        </button>
      </div>

      {complaints.length === 0 ? (
        <div className="empty-state">
          <CheckCircle2 size={35} />
          <h3>No complaints submitted</h3>
          <p>Your submitted complaints and status updates will appear here.</p>
        </div>
      ) : (
        <div className="module-card table-card">
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td>
                      <strong>{complaint.id}</strong>
                    </td>
                    <td>{complaint.category}</td>
                    <td>{complaint.subject}</td>
                    <td>{complaint.date}</td>
                    <td>
                      <span className="application-status">
                        {complaint.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <ComplaintModal
          close={() => setShowForm(false)}
          submit={submitComplaint}
        />
      )}
    </>
  );
}

function ComplaintModal({ close, submit }) {
  return (
    <div className="modal-overlay">
      <div className="resource-modal">
        <div className="modal-header">
          <div>
            <h2>Submit Complaint</h2>
            <p>Describe the campus issue you are facing.</p>
          </div>

          <button onClick={close}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit}>
          <label>Category</label>

          <select name="category">
            <option>Academics</option>
            <option>Infrastructure</option>
            <option>Transport</option>
            <option>Hostel</option>
            <option>Library</option>
            <option>Canteen</option>
            <option>Other</option>
          </select>

          <label>Subject</label>

          <input
            name="subject"
            placeholder="Brief description of the issue"
            required
          />

          <label>Description</label>

          <textarea
            rows="5"
            placeholder="Explain the issue in detail..."
            required
          />

          <div className="modal-actions">
            <button type="button" onClick={close}>
              Cancel
            </button>

            <button className="primary-action">
              <Send size={15} />
              Submit Complaint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Campus;