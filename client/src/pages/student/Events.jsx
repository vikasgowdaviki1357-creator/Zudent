import { useMemo, useState } from "react";
import {
  CalendarDays,
  Search,
  MapPin,
  Clock3,
  Users,
  Trophy,
  Code2,
  Music,
  GraduationCap,
  X,
  CheckCircle2,
  Ticket,
  Award,
} from "lucide-react";

const eventsData = [
  {
    id: 1,
    title: "JIT Tech Fest 2026",
    category: "Technical",
    date: "02 Aug 2026",
    time: "9:30 AM",
    venue: "Main Auditorium",
    organizer: "Department of CSE",
    registrations: 186,
    capacity: 250,
    description:
      "A technical festival featuring coding challenges, project exhibitions, technical quizzes and innovation showcases.",
  },
  {
    id: 2,
    title: "Hackathon 2026",
    category: "Technical",
    date: "08 Aug 2026",
    time: "8:30 AM",
    venue: "CSE Block",
    organizer: "Coding Club",
    registrations: 112,
    capacity: 150,
    description:
      "Build innovative solutions with your team in a college-level hackathon.",
  },
  {
    id: 3,
    title: "Cultural Day",
    category: "Cultural",
    date: "15 Aug 2026",
    time: "10:00 AM",
    venue: "College Grounds",
    organizer: "Cultural Committee",
    registrations: 320,
    capacity: 500,
    description:
      "Music, dance, performances and cultural activities by JIT students.",
  },
  {
    id: 4,
    title: "Inter Department Cricket",
    category: "Sports",
    date: "21 Aug 2026",
    time: "8:00 AM",
    venue: "JIT Sports Ground",
    organizer: "Sports Committee",
    registrations: 95,
    capacity: 120,
    description:
      "Inter-department cricket tournament for JIT students.",
  },
  {
    id: 5,
    title: "Career & Placement Workshop",
    category: "Workshop",
    date: "25 Aug 2026",
    time: "2:00 PM",
    venue: "Seminar Hall",
    organizer: "Placement Cell",
    registrations: 145,
    capacity: 200,
    description:
      "Resume preparation, interview skills and placement guidance.",
  },
  {
    id: 6,
    title: "AI & Machine Learning Seminar",
    category: "Seminar",
    date: "29 Aug 2026",
    time: "11:00 AM",
    venue: "Main Auditorium",
    organizer: "Department of ISE",
    registrations: 204,
    capacity: 300,
    description:
      "An introductory seminar covering current developments in AI and machine learning.",
  },
];

const categories = [
  "All",
  "Technical",
  "Cultural",
  "Sports",
  "Workshop",
  "Seminar",
];

function Events() {
  const [activeTab, setActiveTab] = useState("Discover");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [registered, setRegistered] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents = useMemo(() => {
    let list =
      activeTab === "My Events"
        ? eventsData.filter((event) => registered.includes(event.id))
        : eventsData;

    return list.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.organizer.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || event.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category, activeTab, registered]);

  const registerEvent = (id) => {
    setRegistered((current) =>
      current.includes(id) ? current : [...current, id]
    );
  };

  return (
    <div className="events-page">
      <div className="module-heading">
        <div>
          <p className="page-eyebrow">CAMPUS LIFE</p>
          <h1>Events</h1>
          <p>
            Discover technical, cultural, sports and academic events at JIT.
          </p>
        </div>

        <div className="semester-badge">
          <CalendarDays size={19} />
          {eventsData.length} Upcoming
        </div>
      </div>

      <div className="event-stats">
        <EventStat
          icon={<CalendarDays />}
          value={eventsData.length}
          label="Upcoming Events"
        />

        <EventStat
          icon={<Ticket />}
          value={registered.length}
          label="My Registrations"
        />

        <EventStat
          icon={<Users />}
          value="1K+"
          label="Participants"
        />

        <EventStat
          icon={<Award />}
          value="0"
          label="Certificates"
        />
      </div>

      <div className="event-tabs">
        {["Discover", "My Events", "Certificates"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab !== "Certificates" && (
        <>
          <div className="event-toolbar">
            <div className="resource-search">
              <Search size={18} />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search events or organizers..."
              />
            </div>
          </div>

          <div className="event-categories">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="resources-heading">
            <h3>
              {activeTab === "Discover"
                ? "Upcoming Events"
                : "My Registered Events"}
            </h3>

            <span>{filteredEvents.length} events</span>
          </div>

          <div className="event-grid">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                registered={registered.includes(event.id)}
                open={setSelectedEvent}
              />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="empty-state">
              <CalendarDays size={35} />
              <h3>No events found</h3>
              <p>
                {activeTab === "My Events"
                  ? "You haven't registered for any events yet."
                  : "Try changing your search or category."}
              </p>
            </div>
          )}
        </>
      )}

      {activeTab === "Certificates" && (
        <Certificates registered={registered} />
      )}

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          registered={registered.includes(selectedEvent.id)}
          register={registerEvent}
          close={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

function EventStat({ icon, value, label }) {
  return (
    <div className="event-stat">
      <div>{icon}</div>

      <section>
        <strong>{value}</strong>
        <span>{label}</span>
      </section>
    </div>
  );
}

function EventCard({ event, registered, open }) {
  const EventIcon =
    event.category === "Technical"
      ? Code2
      : event.category === "Cultural"
        ? Music
        : event.category === "Sports"
          ? Trophy
          : GraduationCap;

  return (
    <article className="event-card">
      <div className="event-cover">
        <EventIcon size={39} />

        <span className="event-category">
          {event.category}
        </span>

        {registered && (
          <span className="registered-badge">
            <CheckCircle2 size={12} />
            Registered
          </span>
        )}
      </div>

      <div className="event-card-body">
        <span className="event-organizer">
          {event.organizer}
        </span>

        <h3>{event.title}</h3>

        <div className="event-details">
          <span>
            <CalendarDays size={14} />
            {event.date}
          </span>

          <span>
            <Clock3 size={14} />
            {event.time}
          </span>

          <span>
            <MapPin size={14} />
            {event.venue}
          </span>
        </div>

        <div className="event-capacity">
          <div>
            <Users size={14} />
            {event.registrations}/{event.capacity}
          </div>

          <span>participants</span>
        </div>

        <button onClick={() => open(event)}>
          {registered ? "View Registration" : "View Event"}
        </button>
      </div>
    </article>
  );
}

function EventModal({
  event,
  registered,
  register,
  close,
}) {
  return (
    <div className="modal-overlay">
      <div className="event-modal">
        <div className="modal-header">
          <div>
            <span className="product-category">
              {event.category}
            </span>

            <h2>{event.title}</h2>
          </div>

          <button onClick={close}>
            <X size={20} />
          </button>
        </div>

        <div className="event-modal-banner">
          <CalendarDays size={48} />
        </div>

        <div className="event-modal-info">
          <div>
            <CalendarDays size={17} />
            <section>
              <span>Date</span>
              <strong>{event.date}</strong>
            </section>
          </div>

          <div>
            <Clock3 size={17} />
            <section>
              <span>Time</span>
              <strong>{event.time}</strong>
            </section>
          </div>

          <div>
            <MapPin size={17} />
            <section>
              <span>Venue</span>
              <strong>{event.venue}</strong>
            </section>
          </div>
        </div>

        <div className="event-description">
          <h3>About this event</h3>
          <p>{event.description}</p>
        </div>

        <div className="event-organizer-panel">
          <span>Organized by</span>
          <strong>{event.organizer}</strong>
        </div>

        {registered ? (
          <div className="registration-success">
            <CheckCircle2 size={19} />

            <div>
              <strong>Registration Confirmed</strong>
              <span>
                Your event registration is active.
              </span>
            </div>
          </div>
        ) : (
          <button
            className="event-register-button"
            onClick={() => register(event.id)}
          >
            <Ticket size={17} />
            Register for Event
          </button>
        )}
      </div>
    </div>
  );
}

function Certificates({ registered }) {
  return (
    <div className="certificate-section">
      <div className="certificate-banner">
        <Award size={42} />

        <div>
          <h2>Event Certificates</h2>
          <p>
            Participation and achievement certificates will appear here after
            event completion.
          </p>
        </div>
      </div>

      {registered.length === 0 ? (
        <div className="empty-state">
          <Award size={35} />
          <h3>No certificates available</h3>
          <p>Participate in events to earn certificates.</p>
        </div>
      ) : (
        <div className="module-card">
          <p className="certificate-message">
            You have {registered.length} registered event
            {registered.length !== 1 ? "s" : ""}. Certificates become
            available after attendance is verified by the event organizer.
          </p>
        </div>
      )}
    </div>
  );
}

export default Events;