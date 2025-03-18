import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken"
import blackListTokenModel from "../models/blackListTokenModel.js";
import CaptainModel from "../models/CaptainModel.js";

export const authUser = async (req, res, next) => {
    try {

        // Retrieve token from cookies or Authorization header
        let token = req.cookies.token;
        if (!token) {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(403).json({ message: "Unauthorized" });
            }
            token = authHeader.split(' ')[1];

        }

        // Check if the token is blacklisted
        const blackListToken = await blackListTokenModel.findOne({ token });
        if (blackListToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Attach the user to the request object and proceed
        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};


export const authCaptain = async (req, res, next) => {
    try {
        // Retrieve token from cookies or Authorization header

        let token = req.cookies.token;
        if (!token) {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(403).json({ message: "Unauthorized" });
            }
            token = authHeader.split(' ')[1];
        }

        // Check if the token is blacklisted
        const blackListToken = await blackListTokenModel.findOne({ token });
        if (blackListToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Attach the user to the request object and proceed
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};