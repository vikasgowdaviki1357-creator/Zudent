import express from 'express';
import {
  getDashboard,
  getMyClasses,
  takeAttendance,
  getAttendanceHistory,
  createAssignment,
  getAssignments,
  updateAssignment,
  getSubmissions,
  gradeSubmission,
  enterMarks,
  getMarksHistory,
  uploadResource,
  getMyResources,
  deleteResource,
  createAnnouncement,
  getMyAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  togglePinAnnouncement
} from '../controllers/facultyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('faculty'));

router.get('/dashboard', getDashboard);
router.get('/classes', getMyClasses);

router.post('/attendance', takeAttendance);
router.get('/attendance/:courseId', getAttendanceHistory);

router.post('/assignments', createAssignment);
router.get('/assignments', getAssignments);
router.put('/assignments/:id', updateAssignment);
router.get('/assignments/:id/submissions', getSubmissions);
router.put('/assignments/:assignmentId/submissions/:studentId', gradeSubmission);

router.post('/marks', enterMarks);
router.get('/marks', getMarksHistory);

router.post('/resources', uploadResource);
router.get('/resources', getMyResources);
router.delete('/resources/:id', deleteResource);

router.post('/announcements', createAnnouncement);
router.get('/announcements', getMyAnnouncements);
router.put('/announcements/:id', updateAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);
router.put('/announcements/:id/pin', togglePinAnnouncement);

export default router;
