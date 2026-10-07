import express from "express";

import {
  getDepartments,
  createDepartment,
  updateDepartment,
  updateDepartmentStatus,
  deleteDepartment,
  getDepartmentHods,
} from "../controllers/departmentController.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// All department management routes require admin authentication
router.use(protect);
router.use(authorize("admin"));

// Departments
router.get("/", getDepartments);
router.post("/", createDepartment);
router.put("/:id", updateDepartment);
router.patch("/:id/status", updateDepartmentStatus);
router.delete("/:id", deleteDepartment);

// HOD list for department form
router.get("/hods", getDepartmentHods);

export default router;