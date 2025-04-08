import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "The firstname must be at least 3 characters long"]
    },
    lastName: {
      type: String,
      minlength: [1, "The lastname must be at least 1 character long"]
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    ]
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  socketId: {
    type: String
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [lng, lat]
      default: [0, 0]
    }
  }
}, { timestamps: true });

// Index location field for geospatial queries
userSchema.index({ location: "2dsphere" });

// 🔹 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔹 Static method to hash passwords
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

// 🔹 Generate JWT
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h"
  });
};

// 🔹 Compare Password
userSchema.methods.comparePassword = async function (password) {
  const user = await mongoose.model("User").findById(this._id).select("+password");
  return bcrypt.compare(password, user.password);
};

export default mongoose.model("User", userSchema);
