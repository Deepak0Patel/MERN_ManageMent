const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  departmentName: { type: String, required: true },
  categoryName: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number, required: true },
  employeeIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Department", DepartmentSchema);
