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
        // Validate input errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        // Extract email and password from request body
        const { email, password } = req.body;

        // Find the user by email, including the password field
        const user = await UserModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await user.comparePassword(password); 
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a token for the user
        const token = user.generateAuthToken();

        // Set the token in a cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevent client-side JavaScript access
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Prevent CSRF attacks
        });

        // Send the token and user information
        res.status(200).json({ token, user });
    } catch (err) {
        // Handle unexpected errors
        console.error(err.message);
        res.status(500).json({ message: 'Internal Server Error' });
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