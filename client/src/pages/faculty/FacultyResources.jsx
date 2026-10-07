import { useState } from 'react';
import { 
  FileText, Upload, Download, Search, Filter, 
  Edit, Trash2, File, Database, Monitor, Network
} from 'lucide-react';
import './FacultyResources.css';

const INITIAL_RESOURCES = [
  { id: 1, title: 'Unit 1 - Introduction to Data Structures', subject: 'Data Structures', type: 'Notes', date: '2023-08-10', downloads: 145, size: '2.4 MB' },
  { id: 2, title: 'Python Programming Lab Manual', subject: 'Python', type: 'Lab Manuals', date: '2023-08-15', downloads: 89, size: '5.1 MB' },
  { id: 3, title: 'OS Process Management Questions', subject: 'Operating Systems', type: 'Question Papers', date: '2023-09-02', downloads: 230, size: '1.2 MB' },
  { id: 4, title: 'Sorting Algorithms Cheat Sheet', subject: 'Data Structures', type: 'Notes', date: '2023-09-20', downloads: 312, size: '0.8 MB' },
  { id: 5, title: 'Previous Year SEE Paper (2022)', subject: 'Python', type: 'Question Papers', date: '2023-10-01', downloads: 180, size: '3.4 MB' },
  { id: 6, title: 'Deadlock Notes', subject: 'Operating Systems', type: 'Notes', date: '2023-10-15', downloads: 95, size: '1.8 MB' },
  { id: 7, title: 'Python Web Scraping Guide', subject: 'Python', type: 'Notes', date: '2023-10-22', downloads: 120, size: '2.1 MB' },
  { id: 8, title: 'Data Structures Important Topics', subject: 'Data Structures', type: 'Important Questions', date: '2023-11-05', downloads: 410, size: '0.5 MB' }
];

const SUBJECTS = ['Data Structures', 'Python', 'Operating Systems', 'Computer Networks', 'Database Systems'];
const TYPES = ['Notes', 'Question Papers', 'Lab Manuals', 'Important Questions'];

function FacultyResources() {
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '', subject: SUBJECTS[0], type: TYPES[0], sem: '3', description: ''
  });

  const handleUpload = (e) => {
    e.preventDefault();
    if (!formData.title) return;
    
    const newResource = {
      id: Date.now(),
      title: formData.title,
      subject: formData.subject,
      type: formData.type,
      date: new Date().toISOString().split('T')[0],
      downloads: 0,
      size: '1.0 MB' // Mock size
    };
    
    setResources([newResource, ...resources]);
    setFormData({ ...formData, title: '', description: '' });
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase()) || res.subject.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'All' || res.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type) => {
    switch(type) {
      case 'Notes': return 'badge-notes';
      case 'Question Papers': return 'badge-qp';
      case 'Lab Manuals': return 'badge-lab';
      default: return 'badge-other';
    }
  };

  return (
    <div className="faculty-resources-page">
      <div className="page-header">
        <span className="eyebrow">FACULTY PORTAL</span>
        <h1>Resources</h1>
        <p>Upload and manage study materials, assignments, and question papers.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><FileText size={24} /></div>
          <div className="stat-info">
            <h3>Total Uploads</h3>
            <p>{resources.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon notes"><Database size={24} /></div>
          <div className="stat-info">
            <h3>Notes</h3>
            <p>{resources.filter(r => r.type === 'Notes').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon qp"><Monitor size={24} /></div>
          <div className="stat-info">
            <h3>Question Papers</h3>
            <p>{resources.filter(r => r.type === 'Question Papers').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon lab"><Network size={24} /></div>
          <div className="stat-info">
            <h3>Lab Manuals</h3>
            <p>{resources.filter(r => r.type === 'Lab Manuals').length}</p>
          </div>
        </div>
      </div>

      <div className="upload-section card">
        <div className="card-header">
          <h2><Upload size={20} /> Upload New Resource</h2>
        </div>
        <div className="card-body">
          <form className="upload-form" onSubmit={handleUpload}>
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Chapter 1 Notes" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Resource Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Semester</label>
                <select value={formData.sem} onChange={e => setFormData({...formData, sem: e.target.value})}>
                  <option>1</option><option>2</option><option>3</option><option>4</option>
                  <option>5</option><option>6</option><option>7</option><option>8</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>File</label>
              <div className="file-drop-area">
                <File size={32} className="file-icon" />
                <p>Drag and drop your file here, or click to browse</p>
                <span className="file-hint">Supports PDF, DOCX, PPTX, ZIP (Max 50MB)</span>
                <input type="file" className="file-input" />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              <Upload size={18} /> Upload Resource
            </button>
          </form>
        </div>
      </div>

      <div className="resources-list-section">
        <div className="section-header">
          <h2>My Uploads</h2>
          <div className="controls">
            <div className="search-box">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-box">
              <Filter size={18} />
              <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="All">All Types</option>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="resources-grid">
          {filteredResources.map(res => (
            <div key={res.id} className="resource-card">
              <div className="res-header">
                <span className={`badge ${getTypeColor(res.type)}`}>{res.type}</span>
                <div className="res-actions">
                  <button className="icon-btn"><Edit size={16} /></button>
                  <button className="icon-btn danger"><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className="res-title">{res.title}</h3>
              <p className="res-subject">{res.subject}</p>
              
              <div className="res-meta">
                <span>{res.date}</span>
                <span>{res.size}</span>
                <span><Download size={14} className="inline-icon" /> {res.downloads}</span>
              </div>
            </div>
          ))}
          {filteredResources.length === 0 && (
            <div className="no-results">No resources found matching your criteria.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FacultyResources;
