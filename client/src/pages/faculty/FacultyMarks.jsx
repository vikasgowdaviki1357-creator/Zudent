import { useState } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  Save, 
  CheckCircle, 
  FileSpreadsheet, 
  RotateCcw,
  Clock,
  Check
} from 'lucide-react';
import './FacultyMarks.css';

const CLASSES = [
  { id: 'c1', name: 'Data Structures', section: 'CSE-A', sem: 3 },
  { id: 'c2', name: 'Python Programming', section: 'CSE-B', sem: 3 },
  { id: 'c3', name: 'Operating Systems', section: 'CSE-A', sem: 5 }
];

const ASSESSMENTS = [
  { id: 'a1', name: 'IA-1', max: 20 },
  { id: 'a2', name: 'IA-2', max: 20 },
  { id: 'a3', name: 'IA-3', max: 20 },
  { id: 'a4', name: 'SEE', max: 100 }
];

const STUDENTS = Array.from({ length: 15 }, (_, i) => ({
  usn: `1JT22CS${String(i + 1).padStart(3, '0')}`,
  name: [
    'Aarav Sharma', 'Aditi Rao', 'Ananya Singh', 'Aryan Patel', 'Bhavya Desai',
    'Chaitanya Reddy', 'Daksh Gowda', 'Diya Menon', 'Eshan Verma', 'Gauri Joshi',
    'Harshith Kumar', 'Isha Nair', 'Kavya Bhat', 'Lakshya K', 'Megha R'
  ][i]
}));

const PAST_ENTRIES = [
  { id: 1, date: '2023-09-15', className: 'Data Structures (CSE-A)', assessment: 'IA-1', avg: '16.5/20' },
  { id: 2, date: '2023-10-20', className: 'Python (CSE-B)', assessment: 'IA-2', avg: '17.2/20' }
];

function FacultyMarks() {
  const [step, setStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [marksData, setMarksData] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  const calculateGrade = (marks, max) => {
    if (marks === '' || marks == null) return '-';
    const percent = (Number(marks) / max) * 100;
    if (percent >= 90) return { grade: 'O', class: 'grade-o' };
    if (percent >= 80) return { grade: 'A+', class: 'grade-ap' };
    if (percent >= 70) return { grade: 'A', class: 'grade-a' };
    if (percent >= 60) return { grade: 'B+', class: 'grade-bp' };
    if (percent >= 50) return { grade: 'B', class: 'grade-b' };
    return { grade: 'F', class: 'grade-f' };
  };

  const handleMarkChange = (usn, value) => {
    if (value === '' || (Number(value) >= 0 && Number(value) <= selectedAssessment.max)) {
      setMarksData(prev => ({ ...prev, [usn]: value }));
      setIsSaved(false);
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const resetSelection = () => {
    setStep(1);
    setSelectedClass(null);
    setSelectedAssessment(null);
    setMarksData({});
    setIsSaved(false);
  };

  // Stats calculation
  const enteredMarks = Object.values(marksData).filter(m => m !== '').map(Number);
  const avg = enteredMarks.length ? (enteredMarks.reduce((a, b) => a + b, 0) / enteredMarks.length).toFixed(1) : '-';
  const highest = enteredMarks.length ? Math.max(...enteredMarks) : '-';
  const lowest = enteredMarks.length ? Math.min(...enteredMarks) : '-';
  const passCount = enteredMarks.filter(m => (m / selectedAssessment?.max) >= 0.5).length;
  const passPercent = enteredMarks.length ? Math.round((passCount / enteredMarks.length) * 100) : '-';

  return (
    <div className="faculty-marks-page">
      <div className="page-header">
        <span className="eyebrow">FACULTY PORTAL</span>
        <h1>Marks Entry</h1>
        <p>Manage continuous internal evaluation and semester end marks.</p>
      </div>

      <div className="steps-indicator">
        <div className={`step ${step >= 1 ? 'active' : ''}`} onClick={() => step > 1 && setStep(1)}>
          <div className="step-num">1</div>
          <span>Class</span>
        </div>
        <div className="step-line" />
        <div className={`step ${step >= 2 ? 'active' : ''}`} onClick={() => step > 2 && setStep(2)}>
          <div className="step-num">2</div>
          <span>Assessment</span>
        </div>
        <div className="step-line" />
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-num">3</div>
          <span>Enter Marks</span>
        </div>
      </div>

      {step === 1 && (
        <div className="step-content">
          <h2 className="step-title">Select Class</h2>
          <div className="class-grid">
            {CLASSES.map(cls => (
              <div 
                key={cls.id} 
                className={`class-card ${selectedClass?.id === cls.id ? 'selected' : ''}`}
                onClick={() => { setSelectedClass(cls); setStep(2); }}
              >
                <div className="class-icon"><BookOpen size={24} /></div>
                <h3>{cls.name}</h3>
                <p>{cls.section} • Sem {cls.sem}</p>
              </div>
            ))}
          </div>

          <div className="past-entries-section">
            <h3><Clock size={18} /> Recent Entries</h3>
            <div className="table-responsive">
              <table className="fm-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Class</th>
                    <th>Assessment</th>
                    <th>Average</th>
                  </tr>
                </thead>
                <tbody>
                  {PAST_ENTRIES.map(entry => (
                    <tr key={entry.id}>
                      <td>{entry.date}</td>
                      <td>{entry.className}</td>
                      <td>{entry.assessment}</td>
                      <td><span className="badge badge-info">{entry.avg}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step-content">
          <div className="selection-summary">
            <span>Selected Class: <strong>{selectedClass.name} ({selectedClass.section})</strong></span>
            <button className="btn-icon" onClick={() => setStep(1)}><RotateCcw size={16} /></button>
          </div>
          <h2 className="step-title">Select Assessment Type</h2>
          <div className="assessment-grid">
            {ASSESSMENTS.map(ast => (
              <div 
                key={ast.id} 
                className="assessment-card"
                onClick={() => { setSelectedAssessment(ast); setStep(3); }}
              >
                <h3>{ast.name}</h3>
                <div className="max-marks">Max Marks: {ast.max}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="step-content">
          <div className="selection-summary">
            <span>
              <strong>{selectedClass.name} ({selectedClass.section})</strong> 
              <ChevronRight size={16} className="inline-icon" /> 
              <strong>{selectedAssessment.name}</strong> (Max: {selectedAssessment.max})
            </span>
            <button className="btn-icon" onClick={resetSelection}><RotateCcw size={16} /></button>
          </div>

          <div className="marks-entry-container">
            <div className="table-wrapper">
              <table className="fm-table entry-table">
                <thead>
                  <tr>
                    <th>Sl No</th>
                    <th>USN</th>
                    <th>Student Name</th>
                    <th>Marks</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {STUDENTS.map((st, idx) => {
                    const gradeInfo = calculateGrade(marksData[st.usn], selectedAssessment.max);
                    return (
                      <tr key={st.usn}>
                        <td>{idx + 1}</td>
                        <td className="usn-cell">{st.usn}</td>
                        <td>{st.name}</td>
                        <td>
                          <input 
                            type="number" 
                            className="marks-input"
                            value={marksData[st.usn] || ''}
                            onChange={(e) => handleMarkChange(st.usn, e.target.value)}
                            min="0"
                            max={selectedAssessment.max}
                            placeholder="-"
                          />
                        </td>
                        <td>
                          <span className={`grade-badge ${gradeInfo.class}`}>
                            {gradeInfo.grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="sidebar-stats">
              <div className="stats-card">
                <h3>Assessment Summary</h3>
                <div className="stat-row">
                  <span>Class Average</span>
                  <strong>{avg}</strong>
                </div>
                <div className="stat-row">
                  <span>Highest Score</span>
                  <strong>{highest}</strong>
                </div>
                <div className="stat-row">
                  <span>Lowest Score</span>
                  <strong>{lowest}</strong>
                </div>
                <div className="stat-row">
                  <span>Pass Percentage</span>
                  <strong>{passPercent}%</strong>
                </div>
                <div className="stat-row">
                  <span>Entries</span>
                  <strong>{enteredMarks.length} / {STUDENTS.length}</strong>
                </div>

                <div className="actions">
                  <button className="btn-primary full-width" onClick={handleSave}>
                    {isSaved ? <><Check size={18} /> Saved</> : <><Save size={18} /> Save Marks</>}
                  </button>
                  {isSaved && <div className="success-msg">Marks saved successfully!</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyMarks;
