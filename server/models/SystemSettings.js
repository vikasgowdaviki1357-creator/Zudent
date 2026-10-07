import mongoose from "mongoose";

const systemSettingSchema = new mongoose.Schema(
  {
    institutionName: {
      type: String,
      required: true,
      trim: true,
      default: "Jyothy Institute of Technology",
    },

    institutionCode: {
      type: String,
      trim: true,
      default: "JIT",
    },

    academicYear: {
      type: String,
      trim: true,
      default: "2026-27",
    },

    timezone: {
      type: String,
      trim: true,
      default: "Asia/Kolkata",
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    allowStudentRegistration: {
      type: Boolean,
      default: true,
    },

    allowFacultyRegistration: {
      type: Boolean,
      default: true,
    },

    emailNotifications: {
      type: Boolean,
      default: true,
    },

    pushNotifications: {
      type: Boolean,
      default: true,
    },

    securityAlerts: {
      type: Boolean,
      default: true,
    },

    sessionTimeout: {
      type: Number,
      default: 60,
      min: 5,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const SystemSetting = mongoose.model(
  "SystemSetting",
  systemSettingSchema
);

export default SystemSetting;