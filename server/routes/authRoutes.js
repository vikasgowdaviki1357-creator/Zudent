import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

const registerValidation = [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  body('role').optional().isIn(['student', 'faculty', 'hod', 'admin']),
  body('usn', 'USN is required for students').if(body('role').equals('student')).not().isEmpty(),
  body('branch', 'Branch is required for students').if(body('role').equals('student')).not().isEmpty(),
  body('semester', 'Semester is required for students').if(body('role').equals('student')).not().isEmpty(),
];

const loginValidation = [
  body('password', 'Password is required').exists(),
];

const changePasswordValidation = [
  body('oldPassword', 'Old password is required').exists(),
  body('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
];

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, validate(changePasswordValidation), changePassword);

export default router;
