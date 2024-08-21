const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const registerUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(18, "password cannot be greater then 18 characters long"),
  role: z
    .string()
    .optional()
    .default("employee")
    .refine((val) => ["employee", "manager"].includes(val), "Invalid role"),
  gender: z.string().optional(),
  hobbies: z.array(z.string()).optional(),
  department: z.string().optional(),
  departmentName: z.string().optional(),
});

const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Define User model (adjust according to your model definition)
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["employee", "manager"], required: true },
  gender: { type: String },
  hobbies: { type: [String] },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" }, // Reference to Department
  departmentName: { type: String }, // Store department name
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if the model already exists
const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = { User, registerUserSchema, loginUserSchema };
