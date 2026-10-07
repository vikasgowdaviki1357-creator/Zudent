import mongoose from "mongoose";

const securityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    action: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "Login",
        "Logout",
        "Authentication",
        "User Management",
        "Department",
        "Announcement",
        "Settings",
        "Security",
        "Other",
      ],
      default: "Other",
    },

    status: {
      type: String,
      enum: ["Success", "Failed", "Warning"],
      default: "Success",
    },

    ipAddress: {
      type: String,
      default: "",
      trim: true,
    },

    userAgent: {
      type: String,
      default: "",
      trim: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const SecurityLog = mongoose.model(
  "SecurityLog",
  securityLogSchema
);

export default SecurityLog;