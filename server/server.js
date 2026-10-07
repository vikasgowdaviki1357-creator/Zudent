import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import departmentRoutes from "./routes/departmentRoutes.js";

import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import hodRoutes from './routes/hodRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import announcementRoutes from "./routes/announcementRoutes.js";

import systemSettingsRoutes from "./routes/systemSettingsRoutes.js";
import securityLogRoutes from "./routes/securityLogRoutes.js";
import path from "path";
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use("/api/admin/departments", departmentRoutes);

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/admin/settings", systemSettingsRoutes);
app.use("/api/admin/announcements", announcementRoutes);
app.use("/api/admin/security", securityLogRoutes);
app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);
// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'JIT Super App API running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});