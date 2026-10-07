import User from "../models/User.js";
import SecurityLog from "../models/SecurityLog.js";
import { generateToken } from "../services/authService.js";

/**
 * Get client IP address
 */
const getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]
      ?.split(",")[0]
      ?.trim() ||
    req.socket?.remoteAddress ||
    req.ip ||
    ""
  );
};

/**
 * Get user agent
 */
const getUserAgent = (req) => {
  return (
    req.headers["user-agent"] || ""
  );
};

/**
 * Create security log safely.
 *
 * Security logging must NEVER
 * break authentication.
 */
const createSecurityLog = async ({
  req,
  user = null,
  action,
  description,
  type = "Authentication",
  status = "Success",
  metadata = {},
}) => {
  try {
    await SecurityLog.create({
      user:
        user?._id ||
        user ||
        null,

      action,
      description,
      type,
      status,

      ipAddress:
        getClientIp(req),

      userAgent:
        getUserAgent(req),

      metadata,
    });
  } catch (error) {
    console.error(
      "Security log error:",
      error.message
    );
  }
};

/**
 * Student email pattern
 *
 * Example:
 * 1JT22CS001@gmail.com
 * 1JT23CS045@gmail.com
 *
 * The part before @ is treated as
 * the student's USN.
 */
const isStudentEmail = (email) => {
  const studentEmailPattern =
    /^[0-9]+jt[0-9]{2}[a-z]{2,}[0-9]+@gmail\.com$/i;

  return studentEmailPattern.test(
    email
  );
};

/**
 * Extract USN from student email
 *
 * Example:
 * 1JT22CS001@gmail.com
 *
 * returns:
 * 1JT22CS001
 */
const getStudentUSN = (email) => {
  if (!isStudentEmail(email)) {
    return null;
  }

  return email
    .split("@")[0]
    .trim()
    .toUpperCase();
};

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      email,
      password,
      role,
      usn,
      branch,
      semester,
      phone,
    } = req.body;

    // -------------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------------

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }

    // -------------------------------------------------------
    // NORMALIZE EMAIL
    // -------------------------------------------------------

    const normalizedEmail =
      email.trim().toLowerCase();

    // -------------------------------------------------------
    // CHECK EMAIL
    // -------------------------------------------------------

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Email already exists",
      });
    }

    // -------------------------------------------------------
    // CHECK USN
    // -------------------------------------------------------

    if (usn) {
      const normalizedUSN =
        usn.trim().toUpperCase();

      const existingUSN =
        await User.findOne({
          usn: normalizedUSN,
        });

      if (existingUSN) {
        return res.status(400).json({
          success: false,
          message:
            "USN already exists",
        });
      }
    }

    // -------------------------------------------------------
    // CREATE USER
    // -------------------------------------------------------

    const user =
      await User.create({
        name: name.trim(),

        email:
          normalizedEmail,

        password,

        role:
          role || "student",

        usn: usn
          ? usn.trim().toUpperCase()
          : undefined,

        branch,
        semester,
        phone,
      });

    // -------------------------------------------------------
    // SECURITY LOG
    // -------------------------------------------------------

    await createSecurityLog({
      req,

      user,

      action:
        "User Created",

      description:
        `New ${user.role} account created`,

      type:
        "User Management",

      status:
        "Success",

      metadata: {
        role: user.role,
      },
    });

    // -------------------------------------------------------
    // TOKEN
    // -------------------------------------------------------

    const token =
      generateToken(user._id);

    // Do not expose password
    user.password =
      undefined;

    // -------------------------------------------------------
    // RESPONSE
    // -------------------------------------------------------

    res.status(201).json({
      success: true,
      token,
      user,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 *
 * LOGIN:
 * Email + Password
 *
 * Student:
 * 1JT22CS001@gmail.com
 *
 * Admin:
 * admin@jit.edu
 *
 * HOD:
 * hod@jit.edu
 *
 * Faculty:
 * faculty@jit.edu
 */
export const login = async (
  req,
  res,
  next
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    const loginEmail =
      String(email || "")
        .trim()
        .toLowerCase();

    if (!loginEmail || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    // -------------------------------------------------------
    // DETECT STUDENT EMAIL
    // -------------------------------------------------------

    const studentEmail =
      isStudentEmail(loginEmail);

    const studentUSN =
      getStudentUSN(loginEmail);

    console.log(
      "LOGIN EMAIL:",
      loginEmail
    );

    console.log(
      "STUDENT EMAIL:",
      studentEmail
    );

    if (studentEmail) {
      console.log(
        "STUDENT USN:",
        studentUSN
      );
    }

    // -------------------------------------------------------
    // FIND USER
    //
    // We still find the actual database
    // account. We NEVER authenticate only
    // because the email looks like a USN.
    // -------------------------------------------------------

    let user =
      await User.findOne({
        email: loginEmail,
      }).select("+password");

    // -------------------------------------------------------
    // STUDENT VERIFICATION
    //
    // If email looks like:
    // 1JT22CS001@gmail.com
    //
    // make sure it belongs to a student
    // and matches the stored USN.
    // -------------------------------------------------------

    if (
      studentEmail &&
      user
    ) {
      const storedUSN =
        String(
          user.usn || ""
        )
          .trim()
          .toUpperCase();

      if (
        user.role !== "student" ||
        (studentUSN &&
          storedUSN !== studentUSN)
      ) {
        await createSecurityLog({
          req,
          user,

          action:
            "Login",

          description:
            "Login failed: student email does not match student account",

          type:
            "Login",

          status:
            "Failed",

          metadata: {
            email: loginEmail,
            detectedRole:
              "student",
          },
        });

        return res.status(401).json({
          success: false,
          message:
            "Invalid student account.",
        });
      }
    }

    // -------------------------------------------------------
    // USER NOT FOUND
    // -------------------------------------------------------

    if (!user) {
      await createSecurityLog({
        req,

        action:
          "Login",

        description:
          "Login failed: user account not found",

        type:
          "Login",

        status:
          "Failed",

        metadata: {
          email: loginEmail,
        },
      });

      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // -------------------------------------------------------
    // CHECK ACTIVE ACCOUNT
    // -------------------------------------------------------

    if (user.isActive === false) {
      await createSecurityLog({
        req,

        user,

        action:
          "Login",

        description:
          "Login failed: account is inactive",

        type:
          "Login",

        status:
          "Failed",
      });

      return res.status(403).json({
        success: false,
        message:
          "Your account is inactive. Please contact the administrator.",
      });
    }

    // -------------------------------------------------------
    // CHECK PASSWORD
    // -------------------------------------------------------

    const isMatch =
      await user.comparePassword(
        password
      );

    if (!isMatch) {
      await createSecurityLog({
        req,

        user,

        action:
          "Login",

        description:
          "Login failed: invalid password",

        type:
          "Login",

        status:
          "Failed",

        metadata: {
          email: loginEmail,
        },
      });

      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // -------------------------------------------------------
    // UPDATE LAST LOGIN
    // -------------------------------------------------------

    user.lastLogin =
      Date.now();

    await user.save({
      validateBeforeSave: false,
    });

    // -------------------------------------------------------
    // SECURITY LOG - SUCCESS
    // -------------------------------------------------------

    await createSecurityLog({
      req,

      user,

      action:
        "Login",

      description:
        "User logged into the portal",

      type:
        "Login",

      status:
        "Success",

      metadata: {
        role:
          user.role,

        loginMethod:
          "email",

        studentLogin:
          studentEmail,
      },
    });

    // -------------------------------------------------------
    // GENERATE TOKEN
    // -------------------------------------------------------

    const token =
      generateToken(user._id);

    // -------------------------------------------------------
    // REMOVE PASSWORD
    // -------------------------------------------------------

    user.password =
      undefined;

    // -------------------------------------------------------
    // RESPONSE
    // -------------------------------------------------------

    res.status(200).json({
      success: true,

      token,

      user,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = async (
  req,
  res,
  next
) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      phone,
      skills,
      designation,
    } = req.body;

    const fieldsToUpdate = {};

    if (name) {
      fieldsToUpdate.name =
        name;
    }

    if (phone) {
      fieldsToUpdate.phone =
        phone;
    }

    if (
      skills &&
      req.user.role ===
        "student"
    ) {
      fieldsToUpdate.skills =
        skills;
    }

    if (
      designation &&
      req.user.role ===
        "faculty"
    ) {
      fieldsToUpdate.designation =
        designation;
    }

    const user =
      await User.findByIdAndUpdate(
        req.user.id,

        fieldsToUpdate,

        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (
  req,
  res,
  next
) => {
  try {
    const {
      oldPassword,
      newPassword,
    } = req.body;

    const user =
      await User.findById(
        req.user.id
      ).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    const isMatch =
      await user.comparePassword(
        oldPassword
      );

    if (!isMatch) {
      await createSecurityLog({
        req,

        user,

        action:
          "Password Change",

        description:
          "Password change failed: invalid current password",

        type:
          "Authentication",

        status:
          "Failed",
      });

      return res.status(401).json({
        success: false,
        message:
          "Invalid old password",
      });
    }

    user.password =
      newPassword;

    await user.save();

    await createSecurityLog({
      req,

      user,

      action:
        "Password Change",

      description:
        "User password changed successfully",

      type:
        "Authentication",

      status:
        "Success",
    });

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully",
    });

  } catch (error) {
    next(error);
  }
};