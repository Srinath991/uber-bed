import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, "The firstname must be at least 3 characters long"]
        },
        lastname: {
            type: String,
            minlength: [1, "The lastname must be at least 1 character long"]
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"]
    },
    password: {
        type: String,
        required: true,
        select: false // This prevents the password from being returned in queries
    },
    socketId: {
        type: String
    }
});

// 🔹 Static method for hashing passwords
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

// 🔹 Instance method to generate JWT token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

// 🔹 Instance method to compare passwords
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// 🔹 Create the model
const UserModel = mongoose.model("User", userSchema);
export default UserModel;
