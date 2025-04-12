import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const captainSchema = new Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "The firstname must be at least 3 characters long"]
    },
    lastName: { // ✅ fixed typo
      type: String,
      minlength: [1, "The lastname must be at least 1 character long"]
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"]
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  socketId: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  },
  vehicle: {
    color: {
      type: String,
      required: true,
      minlength: [3, "The color must be at least 3 characters long"]
    },
    plate: {
      type: String,
      required: true,
      minlength: [3, "The plate must be at least 3 characters long"]
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, "Capacity must be at least 1"]
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ['car', 'motorcycle', 'auto']
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  }
}, { timestamps: true });

// 🔹 Index for location-based queries
captainSchema.index({ location: '2dsphere' });

// 🔹 Generate JWT token
captainSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h"
  });
};

// 🔹 Compare password
captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default model("Captain", captainSchema);
