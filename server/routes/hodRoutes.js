import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getDashboard,
  getFacultyList,
  getAttendanceReport,
  getStudentPerformance,
  handleLeaveRequest,
  getPendingApprovals,
  approveResource
} from '../controllers/hodController.js';

const router = express.Router();

router.use(protect);
router.use(authorize('hod'));

router.get('/dashboard', getDashboard);
router.get('/faculty', getFacultyList);
router.get('/attendance-report', getAttendanceReport);
router.get('/students', getStudentPerformance);
router.put('/leave/:id', handleLeaveRequest);
router.get('/approvals', getPendingApprovals);
router.put('/resources/:id/approve', approveResource);

export default router;
