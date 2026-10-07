import Department from "../models/Department.js";
import User from "../models/User.js";

// GET /api/admin/departments
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find()
      .populate("hod", "name email designation department")
      .sort({ name: 1 })
      .lean();

    const departmentData = await Promise.all(
      departments.map(async (department) => {
        const departmentName = department.code;

        const [facultyCount, studentCount] = await Promise.all([
          User.countDocuments({
            role: "faculty",
            $or: [
              { branch: departmentName },
              { department: departmentName },
            ],
          }),

          User.countDocuments({
            role: "student",
            $or: [
              { branch: departmentName },
              { department: departmentName },
            ],
          }),
        ]);

        return {
          id: department._id,
          name: department.name,
          code: department.code,
          hod: department.hod
            ? {
                id: department.hod._id,
                name: department.hod.name,
                email: department.hod.email,
                designation: department.hod.designation,
              }
            : null,
          faculty: facultyCount,
          students: studentCount,
          status: department.status,
          createdAt: department.createdAt,
          updatedAt: department.updatedAt,
        };
      })
    );

    res.json({
      success: true,
      data: departmentData,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/departments
export const createDepartment = async (req, res, next) => {
  try {
    const { name, code, hod, status } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Department name and code are required.",
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    const existingDepartment = await Department.findOne({
      code: normalizedCode,
    });

    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: "A department with this code already exists.",
      });
    }

    let hodUser = null;

    if (hod) {
      hodUser = await User.findOne({
        _id: hod,
        role: "hod",
      });

      if (!hodUser) {
        return res.status(400).json({
          success: false,
          message: "Selected HOD was not found.",
        });
      }
    }

    const department = await Department.create({
      name: name.trim(),
      code: normalizedCode,
      hod: hodUser ? hodUser._id : null,
      status: status || "Active",
    });

    const populatedDepartment = await Department.findById(department._id)
      .populate("hod", "name email designation department")
      .lean();

    res.status(201).json({
      success: true,
      message: "Department created successfully.",
      data: populatedDepartment,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/departments/:id
export const updateDepartment = async (req, res, next) => {
  try {
    const { name, code, hod, status } = req.body;

    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    if (code) {
      const normalizedCode = code.trim().toUpperCase();

      const duplicate = await Department.findOne({
        code: normalizedCode,
        _id: { $ne: department._id },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Another department already uses this code.",
        });
      }

      department.code = normalizedCode;
    }

    if (name) {
      department.name = name.trim();
    }

    if (status) {
      if (!["Active", "Inactive"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid department status.",
        });
      }

      department.status = status;
    }

    if (hod !== undefined) {
      if (!hod) {
        department.hod = null;
      } else {
        const hodUser = await User.findOne({
          _id: hod,
          role: "hod",
        });

        if (!hodUser) {
          return res.status(400).json({
            success: false,
            message: "Selected HOD was not found.",
          });
        }

        department.hod = hodUser._id;
      }
    }

    await department.save();

    const updatedDepartment = await Department.findById(department._id)
      .populate("hod", "name email designation department")
      .lean();

    res.json({
      success: true,
      message: "Department updated successfully.",
      data: updatedDepartment,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/departments/:id/status
export const updateDepartmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Active or Inactive.",
      });
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("hod", "name email designation department")
      .lean();

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    res.json({
      success: true,
      message: `Department marked ${status}.`,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/departments/:id
export const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    await Department.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Department deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/departments/hods
export const getDepartmentHods = async (req, res, next) => {
  try {
    const hods = await User.find({
      role: "hod",
      isActive: true,
    })
      .select("name email department designation")
      .sort({ name: 1 })
      .lean();

    res.json({
      success: true,
      data: hods,
    });
  } catch (error) {
    next(error);
  }
};