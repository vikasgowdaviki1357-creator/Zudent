import Course from '../models/Course.js';
import Attendance from '../models/Attendance.js';
import Assignment from '../models/Assignment.js';
import Resource from '../models/Resource.js';
import Announcement from '../models/Announcement.js';
import Marks from '../models/Marks.js';

export const getDashboard = async (req, res) => {
  try {
    const facultyId = req.user._id;

    // Faculty's courses with student counts
    const courses = await Course.find({ faculty: facultyId });
    const courseStats = courses.map(course => ({
      _id: course._id,
      name: course.name,
      code: course.code,
      studentCount: course.enrolledStudents.length
    }));

    // Today's classes (assuming schedule has dayOfWeek or similar, checking simple presence for now)
    const today = new Date().toLocaleString('en-us', { weekday: 'long' });
    const todaysClasses = courses.filter(course => 
      course.schedule && course.schedule.some(s => s.day === today)
    ).map(c => ({ _id: c._id, name: c.name }));

    // Pending tasks summary
    const courseIds = courses.map(c => c._id);
    const pendingAssignments = await Assignment.countDocuments({
      course: { $in: courseIds },
      dueDate: { $gte: new Date() }
    });

    res.status(200).json({
      success: true,
      data: {
        courses: courseStats,
        todaysClasses,
        pendingTasks: {
          activeAssignments: pendingAssignments
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyClasses = async (req, res) => {
  try {
    const facultyId = req.user._id;
    const courses = await Course.find({ faculty: facultyId })
      .populate('enrolledStudents', 'name usn email');
    
    res.status(200).json({
      success: true,
      data: courses.map(c => ({
        _id: c._id,
        name: c.name,
        code: c.code,
        studentCount: c.enrolledStudents.length,
        students: c.enrolledStudents
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const takeAttendance = async (req, res) => {
  try {
    const { courseId, date, records } = req.body;
    
    // Validate course belongs to faculty
    const course = await Course.findOne({ _id: courseId, faculty: req.user._id });
    if (!course) {
      return res.status(403).json({ success: false, message: 'Unauthorized for this course' });
    }

    const existing = await Attendance.findOne({ course: courseId, date: new Date(date) });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Attendance already taken for this date' });
    }

    let totalPresent = 0;
    let totalAbsent = 0;
    records.forEach(r => {
      if (r.present) totalPresent++;
      else totalAbsent++;
    });

    const attendance = await Attendance.create({
      course: courseId,
      date: new Date(date),
      faculty: req.user._id,
      records,
      totalPresent,
      totalAbsent
    });

    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAttendanceHistory = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { startDate, endDate } = req.query;

    const course = await Course.findOne({ _id: courseId, faculty: req.user._id });
    if (!course) {
      return res.status(403).json({ success: false, message: 'Unauthorized for this course' });
    }

    let query = { course: courseId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const history = await Attendance.find(query)
      .populate('records.student', 'name usn')
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const { courseId, title, description, dueDate } = req.body;
    
    const course = await Course.findOne({ _id: courseId, faculty: req.user._id });
    if (!course) {
      return res.status(403).json({ success: false, message: 'Unauthorized for this course' });
    }

    const assignment = await Assignment.create({
      course: courseId,
      createdBy: req.user._id,
      title,
      description,
      dueDate,
      status: 'Active'
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ createdBy: req.user._id })
      .populate('course', 'name code')
      .sort({ createdAt: -1 });

    const result = assignments.map(a => ({
      ...a.toObject(),
      submissionCount: a.submissions.length
    }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      req.body,
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found or unauthorized' });
    }

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubmissions = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findOne({ _id: id, createdBy: req.user._id })
      .populate('submissions.student', 'name usn email');

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found or unauthorized' });
    }

    res.status(200).json({ success: true, data: assignment.submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const gradeSubmission = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;
    const { marks, feedback } = req.body;

    const assignment = await Assignment.findOne({ _id: assignmentId, createdBy: req.user._id });
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found or unauthorized' });
    }

    const submission = assignment.submissions.find(s => s.student.toString() === studentId);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    submission.marks = marks;
    submission.feedback = feedback;
    
    await assignment.save();

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const enterMarks = async (req, res) => {
  try {
    const { courseId, assessmentType, maxMarks, entries } = req.body;

    const course = await Course.findOne({ _id: courseId, faculty: req.user._id });
    if (!course) {
      return res.status(403).json({ success: false, message: 'Unauthorized for this course' });
    }

    const processedEntries = entries.map(entry => {
      const percentage = (entry.marks / maxMarks) * 100;
      let grade = 'F';
      if (percentage >= 90) grade = 'O';
      else if (percentage >= 80) grade = 'A+';
      else if (percentage >= 70) grade = 'A';
      else if (percentage >= 60) grade = 'B+';
      else if (percentage >= 50) grade = 'B';
      else if (percentage >= 40) grade = 'C';

      return {
        ...entry,
        grade
      };
    });

    const marks = await Marks.findOneAndUpdate(
      { course: courseId, assessmentType },
      { course: courseId, assessmentType, maxMarks, faculty: req.user._id, entries: processedEntries },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: marks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMarksHistory = async (req, res) => {
  try {
    const marks = await Marks.find({ faculty: req.user._id })
      .populate('course', 'name code')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: marks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadResource = async (req, res) => {
  try {
    const resourceData = { ...req.body, uploadedBy: req.user._id, isApproved: true };
    const resource = await Resource.create(resourceData);
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyResources = async (req, res) => {
  try {
    const resources = await Resource.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findOneAndDelete({ _id: req.params.id, uploadedBy: req.user._id });
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found or unauthorized' });
    }
    res.status(200).json({ success: true, message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      author: req.user._id
    });
    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ author: req.user._id }).sort({ date: -1 });
    res.status(200).json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      req.body,
      { new: true }
    );
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found or unauthorized' });
    }
    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found or unauthorized' });
    }
    res.status(200).json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const togglePinAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findOne({ _id: req.params.id, author: req.user._id });
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found or unauthorized' });
    }
    
    announcement.isPinned = !announcement.isPinned;
    await announcement.save();
    
    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
