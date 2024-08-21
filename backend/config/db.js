const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Ensure you have set the environment variable MONGODB_URI
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined.");
    }

    // Connect to MongoDB without deprecated options
    await mongoose.connect(MONGODB_URI);

    const db = mongoose.connection;

    db.on("error", (err) => {
      console.error("Connection error:", err.message);
    });

    db.once("open", () => {
      console.log("Connected to MongoDB");
    });
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
