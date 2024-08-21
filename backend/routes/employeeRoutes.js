const express = require("express");
const { getEmployeeData } = require("../controllers/employeeController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/me", protect, getEmployeeData);

module.exports = router;
