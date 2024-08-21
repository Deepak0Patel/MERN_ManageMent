const Department = require("../models/Department");
const { User } = require("../models/User");

// Create a new department
const createDepartment = async (req, res) => {
  const { departmentName, categoryName, location, salary, employeeIDs } =
    req.body;

  // Check if all required fields are provided
  if (!departmentName || !categoryName || !location || !salary) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const department = await Department.create({
      departmentName,
      categoryName,
      location,
      salary,
      employeeIDs,
    });
    // Update employees with the new department ID
    await User.updateMany(
      { _id: { $in: employeeIDs } },
      // { $set: { department: department._id } }
      { $set: { departmentName: department.departmentName } }
    );

    res.status(201).json(department);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in creating department", error: err.message });
  }
};

// Get departments with pagination

const getDepartments = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;

  try {
    // Get total number of departments
    const totalDepartments = await Department.countDocuments();

    // Get departments for the current page
    const departments = await Department.find()
      .populate("employeeIDs", "-password")
      .limit(limit)
      .skip((page - 1) * limit);

    // Calculate total pages
    const totalPages = Math.ceil(totalDepartments / limit);

    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      totalResults: totalDepartments,
      results: departments,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in fetching departments",
      error: err.message,
    });
  }
};

// Update a department by ID
// const updateDepartment = async (req, res) => {
//   const { id } = req.params;
//   const updateData = req.body;

//   // Check if the ID is valid
//   if (!id) {
//     return res.status(400).json({ message: "Department ID is required" });
//   }

//   try {
//     const department = await Department.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });
//     if (!department) {
//       return res.status(404).json({ message: "Department not found" });
//     }
//     // Optionally update employees if employeeIDs were provided
//     if (updateData.employeeIDs) {
//       await User.updateMany(
//         { _id: { $in: updateData.employeeIDs } },
//         { $set: { department: department._id } }
//       );
//     }
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error in updating department", error: err.message });
//   }
// };

// const updateDepartment = async (req, res) => {
//   const { id } = req.params;
//   const updateData = req.body;

//   // Check if the ID is valid
//   if (!id) {
//     return res.status(400).json({ message: "Department ID is required" });
//   }

//   try {
//     // Find the department to be updated
//     const department = await Department.findById(id);

//     if (!department) {
//       return res.status(404).json({ message: "Department not found" });
//     }

//     // Update the department
//     const updatedDepartment = await Department.findByIdAndUpdate(
//       id,
//       updateData,
//       {
//         new: true, // Return the updated document
//         runValidators: true, // Validate the updated data
//       }
//     );

//     // Check if employees need to be updated
//     if (updateData.employeeIDs && updateData.employeeIDs.length > 0) {
//       // Ensure employeeIDs is an array
//       const employeeIDs = Array.isArray(updateData.employeeIDs)
//         ? updateData.employeeIDs
//         : [updateData.employeeIDs];

//       await User.updateMany(
//         { _id: { $in: employeeIDs } },
//         { $set: { departmentName: updatedDepartment.departmentName } }
//       );
//     }

//     res.status(200).json(updatedDepartment);
//   } catch (err) {
//     res.status(500).json({
//       message: "Error in updating department",
//       error: err.message,
//     });
//   }
// };

const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if the ID is valid
  if (!id) {
    return res.status(400).json({ message: "Department ID is required" });
  }

  try {
    // Find the current department details
    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Update the department with new data
    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the updated data
      }
    );

    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department update failed" });
    }

    // Update employees with the new department name
    if (updateData.employeeIDs && updateData.employeeIDs.length > 0) {
      // Ensure employeeIDs is an array
      const employeeIDs = Array.isArray(updateData.employeeIDs)
        ? updateData.employeeIDs
        : [updateData.employeeIDs];

      // Update the departmentName for each employee in the list
      // await User.updateMany(
      //   { _id: { $in: employeeIDs } },
      //   { $set: { departmentName: updatedDepartment.departmentName } }
      // );

      await User.updateMany(
        { _id: { $in: employeeIDs } },
        // { $set: { department: department._id } }
        { $set: { departmentName: updatedDepartment.departmentName } }
      );
    }

    res.status(200).json(updatedDepartment);
  } catch (err) {
    res.status(500).json({
      message: "Error in updating department",
      error: err.message,
    });
  }
};

// Delete a department by ID
const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  // Check if the ID is valid
  if (!id) {
    return res.status(400).json({ message: "Department ID is required" });
  }

  try {
    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in deleting department", error: err.message });
  }
};

const getEmployeesInDepartmentWithLocation = async (req, res) => {
  const { departmentName, locationStartsWith, sortBy } = req.query;

  try {
    // Define query criteria
    const query = {};

    // Check if departmentName is provided and not null/undefined/empty
    if (departmentName && departmentName.trim()) {
      query.departmentName = departmentName;
    }

    // Check if locationStartsWith is provided
    if (locationStartsWith) {
      const locationRegex = new RegExp(`^${locationStartsWith}`, "i"); // Case-insensitive
      query.location = { $regex: locationRegex };
    }

    // Define the sort order
    const sortOrder = sortBy === "desc" ? -1 : 1;

    // Find departments based on the criteria
    const departments = await Department.find(query).populate({
      path: "employeeIDs",
      select: "-password",
      options: {
        sort: { firstName: sortOrder }, // Sort employees by first name
      },
    });

    // Check if any departments were found
    if (departments.length === 0) {
      return res.status(206).json({
        message: "No departments found matching the criteria",
        employees: [],
      });
    }

    // Extract employee data from the found departments
    const employees = departments.flatMap(
      (department) => department.employeeIDs
    );

    res.status(200).json({ employees });
  } catch (err) {
    res.status(500).json({
      message: "Error in fetching employees",
      error: err.message,
      employees: [],
    });
  }
};

const getEmployee = async (req, res) => {
  try {
    // Fetch all users with the role 'employee', excluding their passwords
    const employeeList = await User.find({ role: "employee" }).select(
      "-password"
    );

    res.status(200).json({
      results: employeeList,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in fetching employees",
      error: err.message,
    });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
  getEmployeesInDepartmentWithLocation,
  getEmployee,
};
