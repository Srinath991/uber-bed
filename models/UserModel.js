import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      firstName: {
        type: String,
        required: [true, "First name is required"],
        minlength: [3, "The first name must be at least 3 characters long"],
        trim: true,
      },
      lastName: {
        type: String,
        minlength: [1, "The last name must be at least 1 character long"],
        trim: true,
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // prevents password from being returned in queries
    },
    socketId: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
  },
  { timestamps: true }
);

// Geospatial index for location queries
userSchema.index({ location: "2dsphere" });


userSchema.statics.hashPassword = async function (plainPassword) {
  return await bcrypt.hash(plainPassword, 10);
};


userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};


userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
