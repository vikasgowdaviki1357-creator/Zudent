import SecurityLog from "../models/SecurityLog.js";

// GET /api/admin/security
export const getSecurityLogs = async (req, res, next) => {
  try {
    const {
      search = "",
      type = "All",
      status = "All",
      limit = 100,
    } = req.query;

    const query = {};

    if (search.trim()) {
      const value = search.trim();

      query.$or = [
        { action: { $regex: value, $options: "i" } },
        { description: { $regex: value, $options: "i" } },
        { ipAddress: { $regex: value, $options: "i" } },
      ];
    }

    if (type !== "All") {
      query.type = type;
    }

    if (status !== "All") {
      query.status = status;
    }

    const logs = await SecurityLog.find(query)
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit) || 100, 500))
      .lean();

    const formattedLogs = logs.map((log) => ({
      id: log._id,
      action: log.action,
      description: log.description,
      type: log.type,
      status: log.status,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      user: log.user
        ? {
            id: log.user._id,
            name: log.user.name,
            email: log.user.email,
            role: log.user.role,
          }
        : null,
      metadata: log.metadata,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
    }));

    res.json({
      success: true,
      count: formattedLogs.length,
      data: formattedLogs,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/security/:id
export const getSecurityLogById = async (
  req,
  res,
  next
) => {
  try {
    const log = await SecurityLog.findById(req.params.id)
      .populate("user", "name email role")
      .lean();

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Security log not found.",
      });
    }

    res.json({
      success: true,
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/security
export const createSecurityLog = async (
  req,
  res,
  next
) => {
  try {
    const {
      user,
      action,
      description,
      type,
      status,
      ipAddress,
      userAgent,
      metadata,
    } = req.body;

    if (!action || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Action and description are required.",
      });
    }

    const securityLog = await SecurityLog.create({
      user: user || null,
      action: action.trim(),
      description: description.trim(),
      type: type || "Other",
      status: status || "Success",
      ipAddress: ipAddress || "",
      userAgent: userAgent || "",
      metadata: metadata || {},
    });

    const populatedLog = await SecurityLog.findById(
      securityLog._id
    )
      .populate("user", "name email role")
      .lean();

    res.status(201).json({
      success: true,
      message: "Security log created successfully.",
      data: populatedLog,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/security/:id
export const deleteSecurityLog = async (
  req,
  res,
  next
) => {
  try {
    const log = await SecurityLog.findById(
      req.params.id
    );

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Security log not found.",
      });
    }

    await SecurityLog.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Security log deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/security
export const clearSecurityLogs = async (
  req,
  res,
  next
) => {
  try {
    const result = await SecurityLog.deleteMany({});

    res.json({
      success: true,
      message: `${result.deletedCount} security log(s) deleted successfully.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};