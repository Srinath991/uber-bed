import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/mydatabase"; // Replace with your MongoDB URL

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
