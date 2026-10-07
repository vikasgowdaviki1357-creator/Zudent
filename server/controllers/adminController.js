import User from "../models/User.js";
import Announcement from "../models/Announcement.js";
import SecurityLog from "../models/SecurityLog.js";

/* =========================================================
   HELPER
========================================================= */

const sanitizeUser = (user) => {
  const safeUser =
    typeof user.toObject === "function"
      ? user.toObject()
      : { ...user };

  delete safeUser.password;

  return safeUser;
};

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

export const getDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalFaculty,
      totalHods,
      totalAdmins,
      activeUsers,
      inactiveUsers,
      departments,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        role: "student",
      }),

      User.countDocuments({
        role: "faculty",
      }),

      User.countDocuments({
        role: "hod",
      }),

      User.countDocuments({
        role: "admin",
      }),

      User.countDocuments({
        isActive: true,
      }),

      User.countDocuments({
        isActive: false,
      }),

      User.distinct("department", {
        department: {
          $exists: true,
          $nin: ["", null],
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalFaculty,
        totalHods,
        totalAdmins,
        activeUsers,
        inactiveUsers,
        departmentsCount: departments.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   GET USERS
========================================================= */

export const getUsers = async (req, res, next) => {
  try {
    const {
      role,
      department,
      search,
      status,
    } = req.query;

    const filter = {};

    /* Role filter */
    if (role && role !== "all") {
      filter.role = role.toLowerCase();
    }

    /* Department filter */
    if (department && department !== "all") {
      filter.department = department;
    }

    /* Status filter */
    if (status !== undefined && status !== "all") {
      filter.isActive = status === "true";
    }

    /* Search */
    if (search && search.trim()) {
      const searchValue = search.trim();

      filter.$or = [
        {
          name: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          email: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          usn: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: searchValue,
            $options: "i",
          },
        },
      ];
    }

    const users = await User.find(filter)
      .select(
        "name email usn role department branch semester admissionYear designation phone isActive lastLogin avatar skills createdAt updatedAt"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   GET SINGLE USER
========================================================= */

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name email usn role department branch semester admissionYear designation phone skills avatar isActive lastLogin createdAt updatedAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   CREATE USER
========================================================= */

export const createUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      usn,
      phone,
      branch,
      semester,
      admissionYear,
      designation,
      department,
      skills,
      avatar,
      isActive,
    } = req.body;

    /* Required fields */
    if (
      !name ||
      !email ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, password and role are required.",
      });
    }

    const cleanEmail = email
      .trim()
      .toLowerCase();

    const cleanRole = String(role)
      .trim()
      .toLowerCase();

    const allowedRoles = [
      "student",
      "faculty",
      "hod",
      "admin",
    ];

    if (!allowedRoles.includes(cleanRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role.",
      });
    }

    /* Check email */
    const existingUser =
      await User.findOne({
        email: cleanEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "A user with this email already exists.",
      });
    }

    /* Check USN */
    let cleanUSN;

    if (usn && usn.trim()) {
      cleanUSN = usn
        .trim()
        .toUpperCase();

      const existingUSN =
        await User.findOne({
          usn: cleanUSN,
        });

      if (existingUSN) {
        return res.status(409).json({
          success: false,
          message:
            "A user with this USN already exists.",
        });
      }
    }

    /* Create */
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: cleanRole,
      usn: cleanUSN,
      phone,
      branch,
      semester,
      admissionYear,
      designation,
      department,
      skills,
      avatar,
      isActive:
        typeof isActive === "boolean"
          ? isActive
          : true,
    });

    const safeUser =
      sanitizeUser(user);

    /* Security log */
    try {
      await SecurityLog.create({
        user: user._id,
        action: "User Created",
        description: `Admin created a new ${user.role} account`,
        type: "User Management",
        status: "Success",
        metadata: {
          role: user.role,
          email: user.email,
        },
        ipAddress:
          req.headers["x-forwarded-for"] ||
          req.socket?.remoteAddress ||
          "",
        userAgent:
          req.headers["user-agent"] || "",
      });
    } catch (logError) {
      console.error(
        "Security log error:",
        logError.message
      );
    }

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   UPDATE USER
========================================================= */

export const updateUser = async (req, res, next) => {
  try {
    const user =
      await User.findById(
        req.params.id
      ).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const {
      name,
      email,
      password,
      role,
      usn,
      phone,
      branch,
      semester,
      admissionYear,
      designation,
      department,
      skills,
      avatar,
      isActive,
    } = req.body;

    /* =====================================================
       EMAIL
    ===================================================== */

    if (email !== undefined) {
      const cleanEmail = email
        .trim()
        .toLowerCase();

      if (
        cleanEmail !== user.email
      ) {
        const emailExists =
          await User.findOne({
            email: cleanEmail,
            _id: {
              $ne: user._id,
            },
          });

        if (emailExists) {
          return res.status(409).json({
            success: false,
            message:
              "Another user already uses this email.",
          });
        }

        user.email = cleanEmail;
      }
    }

    /* =====================================================
       USN
    ===================================================== */

    if (usn !== undefined) {
      const cleanUSN = usn
        ? usn.trim().toUpperCase()
        : undefined;

      if (
        cleanUSN !== user.usn
      ) {
        if (cleanUSN) {
          const usnExists =
            await User.findOne({
              usn: cleanUSN,
              _id: {
                $ne: user._id,
              },
            });

          if (usnExists) {
            return res.status(409).json({
              success: false,
              message:
                "Another user already uses this USN.",
            });
          }
        }

        user.usn = cleanUSN;
      }
    }

    /* =====================================================
       BASIC FIELDS
    ===================================================== */

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (password) {
      user.password = password;
    }

    if (role !== undefined) {
      const cleanRole = String(role)
        .trim()
        .toLowerCase();

      const allowedRoles = [
        "student",
        "faculty",
        "hod",
        "admin",
      ];

      if (
        !allowedRoles.includes(
          cleanRole
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid user role.",
        });
      }

      user.role = cleanRole;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (branch !== undefined) {
      user.branch = branch;
    }

    if (semester !== undefined) {
      user.semester = semester;
    }

    if (
      admissionYear !== undefined
    ) {
      user.admissionYear =
        admissionYear;
    }

    if (
      designation !== undefined
    ) {
      user.designation =
        designation;
    }

    if (
      department !== undefined
    ) {
      user.department =
        department;
    }

    if (skills !== undefined) {
      user.skills = skills;
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    if (
      typeof isActive ===
      "boolean"
    ) {
      user.isActive = isActive;
    }

    await user.save();

    const safeUser =
      sanitizeUser(user);

    /* Security log */
    try {
      await SecurityLog.create({
        user: user._id,
        action: "User Updated",
        description:
          "Admin updated user account details",
        type: "User Management",
        status: "Success",
        metadata: {
          role: user.role,
          email: user.email,
        },
        ipAddress:
          req.headers["x-forwarded-for"] ||
          req.socket?.remoteAddress ||
          "",
        userAgent:
          req.headers["user-agent"] || "",
      });
    } catch (logError) {
      console.error(
        "Security log error:",
        logError.message
      );
    }

    res.status(200).json({
      success: true,
      message:
        "User updated successfully.",
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   UPDATE USER STATUS
========================================================= */

export const updateUserStatus = async (
  req,
  res,
  next
) => {
  try {
    const { isActive } =
      req.body;

    if (
      typeof isActive !==
      "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "isActive must be a boolean value.",
      });
    }

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    /* Prevent disabling own admin account */
    if (
      req.user &&
      req.user._id.toString() ===
        user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot change your own account status.",
      });
    }

    user.isActive =
      isActive;

    await user.save();

    const safeUser =
      sanitizeUser(user);

    /* Security log */
    try {
      await SecurityLog.create({
        user: user._id,
        action: isActive
          ? "User Activated"
          : "User Deactivated",
        description: isActive
          ? "User account activated by admin"
          : "User account deactivated by admin",
        type: "User Management",
        status: "Success",
        metadata: {
          isActive,
        },
        ipAddress:
          req.headers["x-forwarded-for"] ||
          req.socket?.remoteAddress ||
          "",
        userAgent:
          req.headers["user-agent"] || "",
      });
    } catch (logError) {
      console.error(
        "Security log error:",
        logError.message
      );
    }

    res.status(200).json({
      success: true,
      message: isActive
        ? "User activated successfully."
        : "User deactivated successfully.",
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   DELETE USER
========================================================= */

export const deleteUser = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    /* Prevent deleting own admin */
    if (
      req.user &&
      req.user._id.toString() ===
        user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot delete your own account.",
      });
    }

    await User.findByIdAndDelete(
      req.params.id
    );

    /* Security log */
    try {
      await SecurityLog.create({
        user: null,
        action: "User Deleted",
        description: `Admin deleted user account ${user.email}`,
        type: "User Management",
        status: "Success",
        metadata: {
          deletedUserId:
            user._id.toString(),
          email: user.email,
          role: user.role,
        },
        ipAddress:
          req.headers["x-forwarded-for"] ||
          req.socket?.remoteAddress ||
          "",
        userAgent:
          req.headers["user-agent"] || "",
      });
    } catch (logError) {
      console.error(
        "Security log error:",
        logError.message
      );
    }

    res.status(200).json({
      success: true,
      message:
        "User deleted successfully.",
      data: {
        id: req.params.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   DEPARTMENTS
========================================================= */

export const getDepartments = async (
  req,
  res,
  next
) => {
  try {
    const departments =
      await User.aggregate([
        {
          $match: {
            role: {
              $in: [
                "student",
                "faculty",
                "hod",
              ],
            },
            department: {
              $exists: true,
              $nin: [
                "",
                null,
              ],
            },
          },
        },

        {
          $group: {
            _id: "$department",

            totalUsers: {
              $sum: 1,
            },

            studentCount: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$role",
                      "student",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            facultyCount: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$role",
                      "faculty",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            hodCount: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$role",
                      "hod",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },

        {
          $project: {
            _id: 0,
            department: "$_id",
            totalUsers: 1,
            studentCount: 1,
            facultyCount: 1,
            hodCount: 1,
          },
        },

        {
          $sort: {
            department: 1,
          },
        },
      ]);

    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   GET SYSTEM ANNOUNCEMENTS
========================================================= */

export const getSystemAnnouncements =
  async (req, res, next) => {
    try {
      const announcements =
        await Announcement.find()
          .populate(
            "createdBy",
            "name email role"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        count:
          announcements.length,
        data: announcements,
      });
    } catch (error) {
      next(error);
    }
  };

/* =========================================================
   CREATE SYSTEM ANNOUNCEMENT
========================================================= */

export const createSystemAnnouncement =
  async (req, res, next) => {
    try {
      const {
        title,
        description,
        audience,
        department,
        priority,
        status,
      } = req.body;

      if (
        !title ||
        !description
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Title and description are required.",
        });
      }

      const validAudiences = [
        "All Users",
        "Students",
        "Faculty",
        "HOD",
      ];

      const validPriorities = [
        "Normal",
        "Important",
        "Urgent",
      ];

      const validStatuses = [
        "Published",
        "Draft",
      ];

      const cleanAudience =
        audience &&
        validAudiences.includes(
          audience
        )
          ? audience
          : "All Users";

      const cleanPriority =
        priority &&
        validPriorities.includes(
          priority
        )
          ? priority
          : "Normal";

      const cleanStatus =
        status &&
        validStatuses.includes(
          status
        )
          ? status
          : "Published";

      const announcement =
        await Announcement.create({
          title: title.trim(),
          description:
            description.trim(),
          audience:
            cleanAudience,
          department:
            department ||
            "All Departments",
          priority:
            cleanPriority,
          status:
            cleanStatus,
          createdBy:
            req.user?._id || null,
        });

      const populatedAnnouncement =
        await Announcement.findById(
          announcement._id
        ).populate(
          "createdBy",
          "name email role"
        );

      /* Security log */
      try {
        await SecurityLog.create({
          user:
            req.user?._id ||
            null,
          action:
            "Announcement Created",
          description:
            "Admin created a system announcement",
          type:
            "Announcement",
          status:
            "Success",
          metadata: {
            title:
              announcement.title,
            priority:
              announcement.priority,
          },
          ipAddress:
            req.headers[
              "x-forwarded-for"
            ] ||
            req.socket
              ?.remoteAddress ||
            "",
          userAgent:
            req.headers[
              "user-agent"
            ] || "",
        });
      } catch (logError) {
        console.error(
          "Security log error:",
          logError.message
        );
      }

      res.status(201).json({
        success: true,
        message:
          "Announcement created successfully.",
        data:
          populatedAnnouncement,
      });
    } catch (error) {
      next(error);
    }
  };

/* =========================================================
   ACTIVITY LOG
========================================================= */

export const getActivityLog =
  async (req, res, next) => {
    try {
      const logs =
        await SecurityLog.find()
          .populate(
            "user",
            "name email role"
          )
          .sort({
            createdAt: -1,
          })
          .limit(100);

      res.status(200).json({
        success: true,
        count: logs.length,
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  };