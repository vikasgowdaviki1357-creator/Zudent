import User from "../models/User.js";
import Course from "../models/Course.js";
import Attendance from "../models/Attendance.js";
import Assignment from "../models/Assignment.js";
import Resource from "../models/Resource.js";
import MarketplaceItem from "../models/MarketplaceItem.js";
import Event from "../models/Event.js";
import Announcement from "../models/Announcement.js";
import Complaint from "../models/Complaint.js";
import LeaveRequest from "../models/LeaveRequest.js";
import LostFound from "../models/LostFound.js";
import Marks from "../models/Marks.js";

/* =========================================================
   GET COURSES FOR LOGGED-IN STUDENT
   ========================================================= */

const getStudentCourses = async (student) => {
  let courses = await Course.find({
    enrolledStudents: student._id,
  }).populate(
    "faculty",
    "name email designation department"
  );

  if (courses.length === 0) {
    const query = {};

    if (student.branch) {
      query.branch = student.branch;
    }

    if (student.semester) {
      query.semester = student.semester;
    }

    courses = await Course.find(query)
      .populate(
        "faculty",
        "name email designation department"
      )
      .sort({ code: 1 });
  }

  return courses;
};

/* =========================================================
   DASHBOARD
   ========================================================= */

export const getDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    const attendanceRecords =
      await Attendance.find({
        "records.student": studentId,
      });

    let totalClasses = 0;
    let attendedClasses = 0;

    attendanceRecords.forEach((record) => {
      totalClasses++;

      const studentRecord =
        record.records.find(
          (r) =>
            r.student.toString() ===
            studentId.toString()
        );

      if (
        studentRecord &&
        studentRecord.present
      ) {
        attendedClasses++;
      }
    });

    const attendancePercentage =
      totalClasses === 0
        ? 0
        : (attendedClasses / totalClasses) * 100;

    const courses =
      await Course.find({
        enrolledStudents: studentId,
      });

    const courseIds =
      courses.map((c) => c._id);

    const pendingAssignments =
      await Assignment.countDocuments({
        course: { $in: courseIds },
        status: "Active",
        "submissions.student": {
          $ne: studentId,
        },
        dueDate: {
          $gte: new Date(),
        },
      });

    const upcomingExams =
      await Course.find({
        enrolledStudents: studentId,
        "schedule.type": "Exam",
        "schedule.date": {
          $gte: new Date(),
        },
      }).select("name schedule");

    const recentNotices =
      await Announcement.find({
        $or: [
          { targetAudience: "All" },
          {
            targetAudience:
              req.user.branch,
          },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(5);

    res.status(200).json({
      success: true,
      data: {
        attendance: {
          totalClasses,
          attendedClasses,
          percentage:
            attendancePercentage,
        },
        pendingAssignments,
        upcomingExams,
        recentNotices,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   ATTENDANCE
   ========================================================= */

export const getAttendance = async (
  req,
  res
) => {
  try {
    const studentId = req.user._id;

    const records =
      await Attendance.find({
        "records.student": studentId,
      }).populate(
        "course",
        "name code"
      );

    const subjectWise = {};

    records.forEach((record) => {
      const courseId =
        record.course._id.toString();

      if (!subjectWise[courseId]) {
        subjectWise[courseId] = {
          courseName:
            record.course.name,
          courseCode:
            record.course.code,
          total: 0,
          attended: 0,
        };
      }

      subjectWise[courseId].total++;

      const studentRecord =
        record.records.find(
          (r) =>
            r.student.toString() ===
            studentId.toString()
        );

      if (
        studentRecord &&
        studentRecord.present
      ) {
        subjectWise[
          courseId
        ].attended++;
      }
    });

    const result =
      Object.values(subjectWise).map(
        (subject) => ({
          ...subject,
          percentage:
            subject.total === 0
              ? 0
              : (subject.attended /
                  subject.total) *
                100,
        })
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   COURSES
   ========================================================= */

export const getCourses = async (
  req,
  res
) => {
  try {
    const studentId = req.user._id;

    const student =
      await User.findById(
        studentId
      ).select(
        "name email usn branch semester department"
      );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const courses =
      await getStudentCourses(student);

    const courseIds =
      courses.map(
        (course) => course._id
      );

    const attendanceRecords =
      await Attendance.find({
        course: {
          $in: courseIds,
        },
        "records.student":
          studentId,
      });

    const attendanceMap = {};

    attendanceRecords.forEach(
      (record) => {
        if (!record.course) return;

        const courseId =
          record.course.toString();

        if (
          !attendanceMap[courseId]
        ) {
          attendanceMap[courseId] = {
            total: 0,
            attended: 0,
          };
        }

        attendanceMap[
          courseId
        ].total++;

        const studentRecord =
          record.records.find(
            (item) =>
              item.student.toString() ===
              studentId.toString()
          );

        if (
          studentRecord &&
          studentRecord.present
        ) {
          attendanceMap[
            courseId
          ].attended++;
        }
      }
    );

    const result =
      courses.map((course) => {
        const courseId =
          course._id.toString();

        const attendance =
          attendanceMap[courseId];

        let attendancePercentage =
          null;

        if (
          attendance &&
          attendance.total > 0
        ) {
          attendancePercentage =
            Number(
              (
                (attendance.attended /
                  attendance.total) *
                100
              ).toFixed(1)
            );
        }

        return {
          _id: course._id,
          code: course.code,
          name: course.name,
          branch: course.branch,
          semester: course.semester,
          credits: course.credits,
          type: course.type,
          faculty:
            course.faculty || null,
          attendance: {
            total:
              attendance?.total || 0,
            attended:
              attendance?.attended || 0,
            percentage:
              attendancePercentage,
          },
        };
      });

    return res.status(200).json({
      success: true,
      data: {
        student: {
          name: student.name,
          email: student.email,
          usn: student.usn,
          branch: student.branch,
          semester: student.semester,
          department:
            student.department,
        },
        courses: result,
      },
    });
  } catch (error) {
    console.error(
      "Student courses error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   ASSIGNMENTS
   ========================================================= */

export const getAssignments = async (
  req,
  res
) => {
  try {
    const studentId = req.user._id;

    const student =
      await User.findById(
        studentId
      ).select(
        "branch semester"
      );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const courses =
      await getStudentCourses(student);

    const courseIds =
      courses.map(
        (course) => course._id
      );

    const { status } =
      req.query;

    const query = {
      course: {
        $in: courseIds,
      },
    };

    if (status === "pending") {
      query[
        "submissions.student"
      ] = {
        $ne: studentId,
      };
    }

    if (status === "submitted") {
      query[
        "submissions.student"
      ] = studentId;
    }

    const assignments =
      await Assignment.find(query)
        .populate(
          "course",
          "name code"
        )
        .populate(
          "faculty",
          "name email"
        )
        .sort({
          dueDate: 1,
        });

    const formattedAssignments =
      assignments.map(
        (assignment) => {
          const submission =
            assignment.submissions?.find(
              (submission) =>
                submission.student.toString() ===
                studentId.toString()
            );

          return {
            _id:
              assignment._id,
            title:
              assignment.title,
            description:
              assignment.description ||
              "",
            dueDate:
              assignment.dueDate,
            course:
              assignment.course,
            status:
              assignment.status,
            submitted:
              Boolean(submission),
            submissionDetails:
              submission || null,
          };
        }
      );

    return res.status(200).json({
      success: true,
      data: formattedAssignments,
    });
  } catch (error) {
    console.error(
      "Student assignments error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   SUBMIT ASSIGNMENT
   ========================================================= */

export const submitAssignment =
  async (req, res) => {
    try {
      const {
        assignmentId,
      } = req.params;

      const studentId =
        req.user._id;

      const {
        content,
        fileUrl,
      } = req.body;

      const assignment =
        await Assignment.findById(
          assignmentId
        );

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message:
            "Assignment not found",
        });
      }

      if (
        assignment.status !==
        "Active"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Assignment is not active",
        });
      }

      const isLate =
        new Date() >
        new Date(
          assignment.dueDate
        );

      const existingSubmission =
        assignment.submissions.find(
          (s) =>
            s.student.toString() ===
            studentId.toString()
        );

      if (existingSubmission) {
        return res.status(400).json({
          success: false,
          message:
            "Assignment already submitted",
        });
      }

      assignment.submissions.push({
        student: studentId,
        content,
        fileUrl,
        submittedAt:
          new Date(),
        isLate,
      });

      await assignment.save();

      res.status(200).json({
        success: true,
        data: assignment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/* =========================================================
   RESOURCES
   ========================================================= */

export const getResources = async (
  req,
  res
) => {
  try {
    const {
      branch,
      semester,
      type,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const skip =
      (parseInt(page) - 1) *
      parseInt(limit);

    // IMPORTANT:
    // Do NOT filter by isApproved here.
    // Newly uploaded resources are immediately
    // available to students.

    const query = {};

    if (branch) {
      query.branch = branch;
    }

    if (semester) {
      query.semester =
        Number(semester);
    }

    if (type) {
      query.type = type;
    }

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    const resources =
      await Resource.find(query)
        .populate(
          "uploadedBy",
          "name email"
        )
        .skip(skip)
        .limit(
          parseInt(limit)
        )
        .sort({
          createdAt: -1,
        });

    const total =
      await Resource.countDocuments(
        query
      );

    return res.status(200).json({
      success: true,
      data: resources,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(
          total /
            parseInt(limit)
        ),
      },
    });
  } catch (error) {
    console.error(
      "Get resources error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch resources.",
    });
  }
};

/* =========================================================
   UPLOAD RESOURCE
   ========================================================= */

export const uploadResource = async (
  req,
  res
) => {
  try {
    // -----------------------------------------
    // CHECK FILE
    // -----------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a resource file.",
      });
    }

    // -----------------------------------------
    // GET FORM DATA
    // -----------------------------------------

    const {
      title,
      description,
      subject,
      branch,
      semester,
      type,
    } = req.body;

    // -----------------------------------------
    // VALIDATION
    // -----------------------------------------

    if (
      !title ||
      !subject ||
      !type
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, subject and type are required.",
      });
    }

    // -----------------------------------------
    // VALID RESOURCE TYPES
    // -----------------------------------------

    const allowedTypes = [
      "Notes",
      "Question Papers",
      "Lab Manuals",
      "Important Questions",
    ];

    if (
      !allowedTypes.includes(type)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid resource type.",
      });
    }

    // -----------------------------------------
    // CHECK USER
    // -----------------------------------------

    if (
      !req.user ||
      !req.user._id
    ) {
      return res.status(401).json({
        success: false,
        message:
          "User authentication required.",
      });
    }

    // -----------------------------------------
    // FILE URL
    // -----------------------------------------

    const fileUrl =
      `/uploads/resources/${req.file.filename}`;

    // -----------------------------------------
    // CREATE RESOURCE
    // -----------------------------------------

    const resource =
      await Resource.create({
        title:
          title.trim(),

        description:
          description?.trim() ||
          "",

        type,

        subject:
          subject.trim(),

        branch:
          branch || "",

        semester:
          semester
            ? Number(semester)
            : undefined,

        uploadedBy:
          req.user._id,

        fileUrl,

        fileSize:
          req.file.size,

        downloadCount: 0,

        // IMPORTANT:
        // Make uploaded resources
        // immediately visible.
        isApproved: true,
      });

    console.log(
      "RESOURCE SAVED SUCCESSFULLY:",
      resource
    );

    // -----------------------------------------
    // RESPONSE
    // -----------------------------------------

    return res.status(201).json({
      success: true,
      message:
        "Resource uploaded successfully.",
      data: resource,
    });
  } catch (error) {
    console.error(
      "Resource upload error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to upload resource.",
    });
  }
};

/* =========================================================
   MARKETPLACE
   ========================================================= */

export const getMarketplace =
  async (req, res) => {
    try {
      const {
        category,
        type,
        search,
        page = 1,
        limit = 20,
      } = req.query;

      const skip =
        (parseInt(page) - 1) *
        parseInt(limit);

      const query = {
        status: "Available",
      };

      if (category) {
        query.category =
          category;
      }

      if (type) {
        query.type =
          type;
      }

      if (search) {
        query.title = {
          $regex: search,
          $options: "i",
        };
      }

      const items =
        await MarketplaceItem.find(
          query
        )
          .populate(
            "seller",
            "name email"
          )
          .skip(skip)
          .limit(
            parseInt(limit)
          )
          .sort({
            createdAt: -1,
          });

      const total =
        await MarketplaceItem.countDocuments(
          query
        );

      res.status(200).json({
        success: true,
        data: items,
        pagination: {
          total,
          page:
            parseInt(page),
          pages: Math.ceil(
            total /
              parseInt(limit)
          ),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const createListing =
  async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        type,
        price,
        condition,
      } = req.body;

      /*
       * ==========================================
       * VALIDATION
       * ==========================================
       */

      if (!title?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Item title is required.",
        });
      }

      const allowedCategories = [
        "Books",
        "Notes",
        "Calculators",
        "Lab Items",
        "Tools",
        "Question Papers",
        "Electronics",
      ];

      if (
        !allowedCategories.includes(
          category
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid marketplace category.",
        });
      }

      const normalizedType =
        String(type || "")
          .toLowerCase()
          .trim();

      if (
        !["sell", "donate"].includes(
          normalizedType
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Listing type must be sell or donate.",
        });
      }

      const allowedConditions = [
        "New",
        "Like New",
        "Good",
        "Fair",
      ];

      if (
        !allowedConditions.includes(
          condition
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid item condition.",
        });
      }

      /*
       * ==========================================
       * PRICE
       * ==========================================
       */

      let finalPrice = 0;

      if (normalizedType === "sell") {
        finalPrice = Number(price);

        if (
          Number.isNaN(finalPrice) ||
          finalPrice < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Please enter a valid price.",
          });
        }
      }

      /*
       * ==========================================
       * IMAGES
       * ==========================================
       */

      const images =
        req.files?.map(
          (file) =>
            `/uploads/marketplace/${file.filename}`
        ) || [];

      /*
       * ==========================================
       * CREATE ITEM
       * ==========================================
       */

      const item =
        await MarketplaceItem.create({
          title: title.trim(),

          description:
            description?.trim() || "",

          category,

          type: normalizedType,

          price: finalPrice,

          condition,

          images,

          seller: req.user._id,

          status: "Available",

          wishlistedBy: [],
        });

      /*
       * Populate seller before
       * returning the response.
       */

      await item.populate(
        "seller",
        "name email"
      );

      return res.status(201).json({
        success: true,

        message:
          "Marketplace listing created successfully.",

        data: item,
      });

    } catch (error) {
      console.error(
        "Create marketplace listing error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to create marketplace listing.",
      });
    }
  };
export const toggleWishlist =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const studentId =
        req.user._id;

      const item =
        await MarketplaceItem.findById(
          id
        );

      if (!item) {
        return res.status(404).json({
          success: false,
          message:
            "Item not found",
        });
      }

      const isWishlisted =
        item.wishlistedBy.includes(
          studentId
        );

      if (isWishlisted) {
        item.wishlistedBy =
          item.wishlistedBy.filter(
            (id) =>
              id.toString() !==
              studentId.toString()
          );
      } else {
        item.wishlistedBy.push(
          studentId
        );
      }

      await item.save();

      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/* =========================================================
   EVENTS
   ========================================================= */

export const getEvents =
  async (req, res) => {
    try {
      const {
        category,
        status,
      } = req.query;

      const studentId =
        req.user._id;

      const query = {};

      if (category) {
        query.category =
          category;
      }

      if (status) {
        query.status =
          status;
      }

      const events =
        await Event.find(
          query
        ).sort({
          date: 1,
        });

      const result =
        events.map((event) => ({
          ...event.toObject(),
          isRegistered:
            event.registeredStudents.includes(
              studentId
            ),
        }));

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const registerForEvent =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const studentId =
        req.user._id;

      const event =
        await Event.findById(
          id
        );

      if (!event) {
        return res.status(404).json({
          success: false,
          message:
            "Event not found",
        });
      }

      if (
        event.registeredStudents.includes(
          studentId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Already registered",
        });
      }

      if (
        event.maxParticipants &&
        event.registeredStudents
          .length >=
          event.maxParticipants
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Event is full",
        });
      }

      event.registeredStudents.push(
        studentId
      );

      await event.save();

      res.status(200).json({
        success: true,
        data: event,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/* =========================================================
   ANNOUNCEMENTS
   ========================================================= */

export const getAnnouncements =
  async (req, res) => {
    try {
      const userBranch =
        req.user.branch;

      const query = {
        $or: [
          {
            targetAudience:
              "All",
          },
          {
            targetAudience:
              userBranch,
          },
        ],
      };

      const announcements =
        await Announcement.find(
          query
        ).sort({
          isPinned: -1,
          date: -1,
        });

      res.status(200).json({
        success: true,
        data: announcements,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/* =========================================================
   COMPLAINTS
   ========================================================= */

export const createComplaint =
  async (req, res) => {
    try {
      const ticketId =
        `TKT-${Math.floor(
          100000 +
            Math.random() *
              900000
        )}`;

      const complaintData = {
        ...req.body,
        student:
          req.user._id,
        ticketId,
      };

      const complaint =
        await Complaint.create(
          complaintData
        );

      res.status(201).json({
        success: true,
        data: complaint,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const getComplaints =
  async (req, res) => {
    try {
      const complaints =
        await Complaint.find({
          student:
            req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        data: complaints,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/* =========================================================
   LEAVE
   ========================================================= */

export const applyLeave =
  async (req, res) => {
    try {
      const leaveData = {
        ...req.body,
        student:
          req.user._id,
        status:
          "Pending",
      };

      const leave =
        await LeaveRequest.create(
          leaveData
        );

      res.status(201).json({
        success: true,
        data: leave,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const getLeaveRequests =
  async (req, res) => {
    try {
      const leaves =
        await LeaveRequest.find({
          student:
            req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        data: leaves,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/* =========================================================
   LOST & FOUND
   ========================================================= */

export const reportLostFound =
  async (req, res) => {
    try {
      const itemData = {
        ...req.body,
        reportedBy:
          req.user._id,
      };

      const item =
        await LostFound.create(
          itemData
        );

      res.status(201).json({
        success: true,
        data: item,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const getLostFound =
  async (req, res) => {
    try {
      const items =
        await LostFound.find()
          .populate(
            "reportedBy",
            "name"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/* =========================================================
   MARKS
   ========================================================= */

export const getMarks =
  async (req, res) => {
    try {
      const studentId =
        req.user._id;

      const student =
        await User.findById(
          studentId
        ).select(
          "branch semester"
        );

      if (!student) {
        return res.status(404).json({
          success: false,
          message:
            "Student not found",
        });
      }

      const courses =
        await getStudentCourses(
          student
        );

      const courseIds =
        courses.map(
          (course) =>
            course._id
        );

      const marks =
        await Marks.find({
          course: {
            $in: courseIds,
          },
          "entries.student":
            studentId,
        }).populate(
          "course",
          "name code"
        );

      const formattedMarks =
        marks.map(
          (markDocument) => {
            const studentEntry =
              markDocument.entries.find(
                (entry) =>
                  entry.student.toString() ===
                  studentId.toString()
              );

            return {
              course:
                markDocument.course,

              assessmentType:
                markDocument.assessmentType,

              maxMarks:
                markDocument.maxMarks,

              marksObtained:
                studentEntry
                  ? studentEntry.marks
                  : null,

              grade:
                studentEntry
                  ? studentEntry.grade
                  : null,
            };
          }
        );

      return res.status(200).json({
        success: true,
        data: formattedMarks,
      });
    } catch (error) {
      console.error(
        "Student marks error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };