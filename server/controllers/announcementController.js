import Announcement from "../models/Announcement.js";

// GET /api/admin/announcements
export const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/announcements/:id
export const getAnnouncementById = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate("createdBy", "name email role")
      .lean();

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    res.json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/announcements
export const createAnnouncement = async (req, res, next) => {
  try {
    const {
      title,
      description,
      audience,
      department,
      priority,
      status,
    } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required.",
      });
    }

    const announcement = await Announcement.create({
      title: title.trim(),
      description: description.trim(),
      audience: audience || "All Users",
      department: department || "All Departments",
      priority: priority || "Normal",
      status: status || "Published",
      createdBy: req.user?._id || null,
    });

    const populatedAnnouncement = await Announcement.findById(
      announcement._id
    )
      .populate("createdBy", "name email role")
      .lean();

    res.status(201).json({
      success: true,
      message: "Announcement created successfully.",
      data: populatedAnnouncement,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/announcements/:id
export const updateAnnouncement = async (req, res, next) => {
  try {
    const {
      title,
      description,
      audience,
      department,
      priority,
      status,
    } = req.body;

    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Announcement title cannot be empty.",
        });
      }

      announcement.title = title.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Announcement description cannot be empty.",
        });
      }

      announcement.description = description.trim();
    }

    if (audience !== undefined) {
      announcement.audience = audience;
    }

    if (department !== undefined) {
      announcement.department = department;
    }

    if (priority !== undefined) {
      announcement.priority = priority;
    }

    if (status !== undefined) {
      announcement.status = status;
    }

    await announcement.save();

    const updatedAnnouncement = await Announcement.findById(
      announcement._id
    )
      .populate("createdBy", "name email role")
      .lean();

    res.json({
      success: true,
      message: "Announcement updated successfully.",
      data: updatedAnnouncement,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/announcements/:id/status
export const updateAnnouncementStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["Published", "Draft"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Published or Draft.",
      });
    }

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("createdBy", "name email role")
      .lean();

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    res.json({
      success: true,
      message: `Announcement marked ${status}.`,
      data: announcement,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/announcements/:id
export const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    await Announcement.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Announcement deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};