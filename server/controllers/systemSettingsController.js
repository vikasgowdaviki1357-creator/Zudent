import SystemSetting from "../models/SystemSettings.js";

// GET /api/admin/settings
export const getSystemSettings = async (req, res, next) => {
  try {
    let settings = await SystemSetting.findOne().lean();

    // Create default settings if none exist
    if (!settings) {
      const newSettings = await SystemSetting.create({
        updatedBy: req.user?._id || null,
      });

      settings = newSettings.toObject();
    }

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/settings
export const updateSystemSettings = async (req, res, next) => {
  try {
    const {
      institutionName,
      institutionCode,
      academicYear,
      timezone,
      maintenanceMode,
      allowStudentRegistration,
      allowFacultyRegistration,
      emailNotifications,
      pushNotifications,
      securityAlerts,
      sessionTimeout,
    } = req.body;

    if (!institutionName || !institutionCode || !academicYear) {
      return res.status(400).json({
        success: false,
        message:
          "Institution name, institution code and academic year are required.",
      });
    }

    if (
      sessionTimeout !== undefined &&
      (Number(sessionTimeout) < 5 || Number.isNaN(Number(sessionTimeout)))
    ) {
      return res.status(400).json({
        success: false,
        message: "Session timeout must be at least 5 minutes.",
      });
    }

    let settings = await SystemSetting.findOne();

    if (!settings) {
      settings = new SystemSetting();
    }

    settings.institutionName = institutionName.trim();
    settings.institutionCode = institutionCode.trim().toUpperCase();
    settings.academicYear = academicYear.trim();
    settings.timezone = timezone || "Asia/Kolkata";

    settings.maintenanceMode = Boolean(maintenanceMode);
    settings.allowStudentRegistration =
      Boolean(allowStudentRegistration);
    settings.allowFacultyRegistration =
      Boolean(allowFacultyRegistration);

    settings.emailNotifications =
      Boolean(emailNotifications);

    settings.pushNotifications =
      Boolean(pushNotifications);

    settings.securityAlerts =
      Boolean(securityAlerts);

    settings.sessionTimeout =
      Number(sessionTimeout) || 60;

    settings.updatedBy = req.user?._id || null;

    await settings.save();

    const updatedSettings = await SystemSetting.findById(
      settings._id
    )
      .populate("updatedBy", "name email role")
      .lean();

    res.json({
      success: true,
      message: "System settings updated successfully.",
      data: updatedSettings,
    });
  } catch (error) {
    next(error);
  }
};