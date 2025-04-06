import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import CaptainModel from "../models/CaptainModel.js";
import blackListTokenModel from "../models/blackListTokenModel.js";

// Utility function to extract token
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
};

// Utility function to check if token is blacklisted
const isTokenBlacklisted = async (token) => {
  const blacklisted = await blackListTokenModel.findOne({ token });
  return !!blacklisted;
};

// Middleware for authenticating users
export const authUser = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(403).json({ message: "Unauthorized: No token provided" });
    }

    if (await isTokenBlacklisted(token)) {
      return res.status(401).json({ message: "Unauthorized: Token is blacklisted" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

// Middleware for authenticating captains
export const authCaptain = async (req, res, next) => {

  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(403).json({ message: "Unauthorized: No token provided" });
    }

    if (await isTokenBlacklisted(token)) {
      return res.status(401).json({ message: "Unauthorized: Token is blacklisted" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await CaptainModel.findById(decoded._id);

    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }

    req.captain = captain;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
