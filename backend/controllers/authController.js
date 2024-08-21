const jwt = require("jsonwebtoken");
const { User, loginUserSchema, registerUserSchema } = require("../models/User");

// Define route handlers
const registerUser = async (req, res) => {
  try {
    // Validate request body
    const parsedBody = registerUserSchema.parse(req.body);
    const { firstName, lastName, email, password, role, gender, hobbies } =
      parsedBody;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Create a new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      gender,
      hobbies,
    });

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const { password: _, ...userWithoutPassword } = user.toObject();

    // Send response
    res.status(201).json({
      message: "User created successfully",
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.errors });
  }
};

const loginUser = async (req, res) => {
  try {
    // Validate request body
    const parsedBody = loginUserSchema.parse(req.body);

    const { email, password } = parsedBody;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Exclude the password from the user object
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      message: "user login successfully",
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.errors });
  }
};

module.exports = { registerUser, loginUser };
