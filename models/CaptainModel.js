import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const captionSchema = new Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,
            minlength: [3, "The firstname must be at least 3 characters long"]
        },
        lasName: {
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
        select: false // Prevents password from being returned in queries
    },
    socketId: {
        type: String
    },
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
            required: true, // Fixed typo from "require" to "required"
            enum: ['car', 'motorcycle', 'auto']
        },
        location: {
            lat: {
                type: Number,
            },
            lng: {
                type: Number,
            }
        }
    }
});

// 🔹 Hash password before saving
captionSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Only hash if password is modified
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// 🔹 Static method for hashing passwords
captionSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

// 🔹 Instance method to generate JWT token
captionSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

// 🔹 Instance method to compare passwords
captionSchema.methods.comparePassword = async function (password) {
    const user = await model('Captain').findById(this._id).select('+password'); // Ensure password is fetched
    return bcrypt.compare(password, user.password);
};

export default model("Captain", captionSchema);
