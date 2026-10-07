import { useState } from 'react';
import { 
  Megaphone, Pin, Clock, Users, 
  Edit2, Trash, Plus, Search, Filter 
} from 'lucide-react';
import './FacultyAnnouncements.css';

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'IA-1 Schedule Released',
    content: 'The first internal assessment will commence from 25th September. Please find the detailed timetable attached on the department notice board.',
    priority: 'High',
    audience: 'All Students',
    date: '2023-09-10',
    pinned: true,
    author: 'Prof. Ramesh K'
  },
  {
    id: 2,
    title: 'Lab Timing Change for CSE-A',
    content: 'Data Structures Lab for CSE-A will be held from 2:00 PM to 4:00 PM instead of morning session this Wednesday.',
    priority: 'Medium',
    audience: 'CSE-A',
    date: '2023-09-12',
    pinned: false,
    author: 'Prof. Ramesh K'
  },
  {
    id: 3,
    title: 'Guest Lecture on AI Trends',
    content: 'We are hosting a guest lecture on recent trends in Generative AI by Dr. Suresh from IISc. Attendance is mandatory for 5th sem students.',
    priority: 'Low',
    audience: 'Department',
    date: '2023-09-14',
    pinned: false,
    author: 'Prof. Ramesh K'
  },
  {
    id: 4,
    title: 'Submission Deadline for Mini Project',
    content: 'Final deadline for Phase 1 submission is Friday 5 PM. No extensions will be provided.',
    priority: 'High',
    audience: 'CSE-B',
    date: '2023-09-18',
    pinned: false,
    author: 'Prof. Ramesh K'
  }
];

const PRIORITIES = ['Low', 'Medium', 'High'];
const AUDIENCES = ['All Students', 'CSE-A', 'CSE-B', 'Department'];

function FacultyAnnouncements() {
  const [activeTab, setActiveTab] = useState('All');
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  
  // Filters
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');

  // Form State
  const [formData, setFormData] = useState({
    title: '', content: '', priority: 'Medium', audience: 'All Students', scheduleDate: ''
  });

  const handlePost = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    
    const newAnnounce = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      priority: formData.priority,
      audience: formData.audience,
      date: new Date().toISOString().split('T')[0],
      pinned: false,
      author: 'Prof. Ramesh K'
    };
    
    setAnnouncements([newAnnounce, ...announcements]);
    setFormData({ title: '', content: '', priority: 'Medium', audience: 'All Students', scheduleDate: '' });
    setActiveTab('All');
  };

  const togglePin = (id) => {
    setAnnouncements(announcements.map(a => 
      a.id === id ? { ...a, pinned: !a.pinned } : a
    ));
  };

  const filteredAnnouncements = announcements
    .filter(a => filterPriority === 'All' || a.priority === filterPriority)
    .filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b.pinned === a.pinned) ? 0 : b.pinned ? 1 : -1); // Pinned first

  return (
    <div className="faculty-announcements-page">
      <div className="page-header">
        <span className="eyebrow">FACULTY PORTAL</span>
        <h1>Announcements</h1>
        <p>Broadcast messages, schedules, and important updates to students.</p>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'All' ? 'active' : ''}`}
            onClick={() => setActiveTab('All')}
          >
            <Megaphone size={18} /> All Announcements
          </button>
          <button 
            className={`tab ${activeTab === 'Create' ? 'active' : ''}`}
            onClick={() => setActiveTab('Create')}
          >
            <Plus size={18} /> Create New
          </button>
        </div>
      </div>

      {activeTab === 'All' && (
        <div className="tab-content fade-in">
          <div className="toolbar">
            <div className="search-box">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search announcements..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-box">
              <Filter size={18} />
              <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                <option value="All">All Priorities</option>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="announcements-grid">
            {filteredAnnouncements.map(ann => (
              <div key={ann.id} className={`announcement-card ${ann.pinned ? 'pinned' : ''}`}>
                <div className="ac-header">
                  <div className="badges">
                    <span className={`badge badge-${ann.priority.toLowerCase()}`}>
                      {ann.priority}
                    </span>
                    <span className="badge badge-audience">
                      <Users size={12} className="inline-icon" /> {ann.audience}
                    </span>
                  </div>
                  <div className="actions">
                    <button 
                      className={`icon-btn ${ann.pinned ? 'active-pin' : ''}`} 
                      onClick={() => togglePin(ann.id)}
                      title={ann.pinned ? 'Unpin' : 'Pin'}
                    >
                      <Pin size={16} />
                    </button>
                    <button className="icon-btn" title="Edit"><Edit2 size={16} /></button>
                    <button className="icon-btn danger" title="Delete"><Trash size={16} /></button>
                  </div>
                </div>
                
                <h3 className="ac-title">{ann.title}</h3>
                <p className="ac-content">{ann.content}</p>
                
                <div className="ac-footer">
                  <span className="ac-date"><Clock size={14} className="inline-icon" /> {ann.date}</span>
                  <span className="ac-author">{ann.author}</span>
                </div>
              </div>
            ))}
            {filteredAnnouncements.length === 0 && (
              <div className="no-results">No announcements found.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Create' && (
        <div className="tab-content fade-in">
          <div className="create-card">
            <h2>Create Announcement</h2>
            <form onSubmit={handlePost}>
              <div className="form-group">
                <label>Announcement Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Lab schedule update" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Message Content</label>
                <textarea 
                  rows="5" 
                  placeholder="Type your message here..."
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Target Audience</label>
                  <select value={formData.audience} onChange={e => setFormData({...formData, audience: e.target.value})}>
                    {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Schedule for Later (Optional)</label>
                <input 
                  type="date" 
                  value={formData.scheduleDate}
                  onChange={e => setFormData({...formData, scheduleDate: e.target.value})}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveTab('All')}>Cancel</button>
                <button type="submit" className="btn-primary">
                  <Megaphone size={18} /> Post Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyAnnouncements;
