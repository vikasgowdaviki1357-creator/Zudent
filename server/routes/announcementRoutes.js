import express from "express";

import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  updateAnnouncementStatus,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// All announcement management routes require admin authentication
router.use(protect);
router.use(authorize("admin"));

// Get all announcements
router.get("/", getAnnouncements);

// Get single announcement
router.get("/:id", getAnnouncementById);

// Create announcement
router.post("/", createAnnouncement);

// Update announcement
router.put("/:id", updateAnnouncement);

// Update announcement status
router.patch("/:id/status", updateAnnouncementStatus);

// Delete announcement
router.delete("/:id", deleteAnnouncement);

export default router;