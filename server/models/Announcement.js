import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Announcement title is required"],
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: [true, "Announcement description is required"],
      trim: true,
      maxlength: 5000,
    },

    audience: {
      type: String,
      enum: ["All Users", "Students", "Faculty", "HOD"],
      default: "All Users",
    },

    department: {
      type: String,
      trim: true,
      default: "All Departments",
    },

    priority: {
      type: String,
      enum: ["Normal", "Important", "Urgent"],
      default: "Normal",
    },

    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Published",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Announcement = mongoose.model(
  "Announcement",
  announcementSchema
);

export default Announcement;