const { User } = require("../models/User");

const getEmployeeData = async (req, res) => {
  try {
    const employee = await User.findById(req.userId).select("-password");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in fetching employee data", error: err.message });
  }
};

module.exports = { getEmployeeData };
