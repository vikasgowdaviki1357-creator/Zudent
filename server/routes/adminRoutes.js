import express from 'express';

import {
  getDashboard,
  getUsers,
  getUserById,
  updateUserStatus,
  createUser,
  updateUser,
  deleteUser,
  getDepartments,
  getSystemAnnouncements,
  createSystemAnnouncement,
  getActivityLog,
} from '../controllers/adminController.js';

import {
  protect,
  authorize,
} from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

/* Dashboard */
router.get('/dashboard', getDashboard);

/* Users */
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

/* Departments */
router.get('/departments', getDepartments);

/* Announcements */
router.get('/announcements', getSystemAnnouncements);
router.post('/announcements', createSystemAnnouncement);

/* Activity */
router.get('/activity-log', getActivityLog);

export default router;