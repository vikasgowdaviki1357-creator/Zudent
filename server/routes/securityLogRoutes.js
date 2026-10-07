import express from "express";

import {
  getSecurityLogs,
  getSecurityLogById,
  createSecurityLog,
  deleteSecurityLog,
  clearSecurityLogs,
} from "../controllers/securityLogController.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// All security-log management routes require admin authentication
router.use(protect);
router.use(authorize("admin"));

// GET /api/admin/security
router.get("/", getSecurityLogs);

// GET /api/admin/security/:id
router.get("/:id", getSecurityLogById);

// POST /api/admin/security
router.post("/", createSecurityLog);

// DELETE /api/admin/security/:id
router.delete("/:id", deleteSecurityLog);

// DELETE /api/admin/security
router.delete("/", clearSecurityLogs);

export default router;