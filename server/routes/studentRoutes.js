import express from "express";

import {
  getDashboard,
  getAttendance,
  getAssignments,
  submitAssignment,
  getResources,
  uploadResource,
  getMarketplace,
  createListing,
  toggleWishlist,
  getEvents,
  registerForEvent,
  getAnnouncements,
  createComplaint,
  getComplaints,
  applyLeave,
  getLeaveRequests,
  reportLostFound,
  getLostFound,
  getMarks,
  getCourses,
} from "../controllers/studentController.js";

import {
  protect,
  authorize,
} from "../middleware/auth.js";

import uploadResourceFile from "../middleware/upload.js";
import uploadMarketplaceImages from "../middleware/uploadMarketplace.js";

const router = express.Router();

/* =========================================================
   AUTHENTICATION
   ========================================================= */

router.use(protect);

/* =========================================================
   DASHBOARD
   ========================================================= */

router.get(
  "/dashboard",
  authorize("student"),
  getDashboard
);

/* =========================================================
   ATTENDANCE
   ========================================================= */

router.get(
  "/attendance",
  authorize("student"),
  getAttendance
);

/* =========================================================
   ASSIGNMENTS
   ========================================================= */

router.get(
  "/assignments",
  authorize("student"),
  getAssignments
);

router.post(
  "/assignments/:assignmentId/submit",
  authorize("student"),
  submitAssignment
);

/* =========================================================
   RESOURCES
   ========================================================= */

router.get(
  "/resources",
  getResources
);

router.post(
  "/resources",
  authorize("student"),
  uploadResourceFile.single("file"),
  uploadResource
);

/* =========================================================
   MARKETPLACE
   ========================================================= */

router.get(
  "/marketplace",
  getMarketplace
);

router.post(
  "/marketplace",
  authorize("student"),
  uploadMarketplaceImages.array(
    "images",
    5
  ),
  createListing
);

router.put(
  "/marketplace/:id/wishlist",
  authorize("student"),
  toggleWishlist
);

/* =========================================================
   EVENTS
   ========================================================= */

router.get(
  "/events",
  getEvents
);

router.post(
  "/events/:id/register",
  authorize("student"),
  registerForEvent
);

/* =========================================================
   ANNOUNCEMENTS
   ========================================================= */

router.get(
  "/announcements",
  getAnnouncements
);

/* =========================================================
   COMPLAINTS
   ========================================================= */

router.post(
  "/complaints",
  authorize("student"),
  createComplaint
);

router.get(
  "/complaints",
  authorize("student"),
  getComplaints
);

/* =========================================================
   LEAVE
   ========================================================= */

router.post(
  "/leave",
  authorize("student"),
  applyLeave
);

router.get(
  "/leave",
  authorize("student"),
  getLeaveRequests
);

/* =========================================================
   LOST & FOUND
   ========================================================= */

router.post(
  "/lost-found",
  authorize("student"),
  reportLostFound
);

router.get(
  "/lost-found",
  getLostFound
);

/* =========================================================
   MARKS
   ========================================================= */

router.get(
  "/marks",
  authorize("student"),
  getMarks
);

/* =========================================================
   COURSES
   ========================================================= */

router.get(
  "/courses",
  getCourses
);

export default router;