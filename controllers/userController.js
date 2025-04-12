import UserModel from "../models/UserModel.js"
import { createUser } from "../services/userService.js"
import { validationResult } from "express-validator"
import blackListTokenModel from "../models/blackListTokenModel.js";

export const registerUser = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const { fullName, email, password } = req.body;

        // Hash password before saving
        const hashedPassword = await UserModel.hashPassword(password);

        // Create user properly
        const user = await createUser({
            firstName: fullName.firstName,
            lastName: fullName.lastName,
            email,
            password: hashedPassword
        });
        return res.status(201).json({user});
    }
    catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }
};

export const loginUser = async (req, res, next) => {
  try {
    // 🔹 Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { email, password } = req.body;

    // 🔹 Find user and include password
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🔹 Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🔹 Generate token (make sure this method exists on schema)
    const token = user.generateAuthToken();

    // 🔹 Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // 🔹 Respond with token and user info (you may want to exclude password)
    const { password: _, ...userInfo } = user.toObject(); // exclude password
    res.status(200).json({ token, user: userInfo });
  } catch (err) {
    next(err); 
  }
};


export const getUserProfile = async (req, res) => {
    res.json(req.user)
}

export const logoutUser = async (req,res) => {
    const token = req.token;
    res.clearCookie('token')
    await blackListTokenModel.create({token})
    res.status(200).json({'message':'logged out'})
}