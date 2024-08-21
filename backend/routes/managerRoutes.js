const express = require("express");
const {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
  getEmployeesInDepartmentWithLocation,
  getEmployee,
} = require("../controllers/managerController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Route to create a new department
router.post("/departments", protect, createDepartment);

// Route to get paginated departments
router.get("/departments", protect, getDepartments);

// Route to update a department by ID
router.put("/departments/:id", protect, updateDepartment);

// Route to delete a department by ID
router.delete("/departments/:id", protect, deleteDepartment);

//  for search and query result by department name and  location

router.get("/departmentsFind", protect, getEmployeesInDepartmentWithLocation);
//  for search and query result by department name and  location

router.get("/employeeList", protect, getEmployee);

module.exports = router;
