import express from "express";

import {
  getSystemSettings,
  updateSystemSettings,
} from "../controllers/systemSettingsController.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// All system settings routes require admin authentication
router.use(protect);
router.use(authorize("admin"));

// Get current system settings
router.get("/", getSystemSettings);

// Update system settings
router.put("/", updateSystemSettings);

export default router;