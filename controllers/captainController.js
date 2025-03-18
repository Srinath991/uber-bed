import CaptainModel from "../models/CaptainModel.js";
import { createCaptain } from "../services/captainService.js";
import { validationResult } from "express-validator"
import blackListTokenModel from "../models/blackListTokenModel.js";

export const registerCaptain = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const { fullName, email, password,vehicle } = req.body;
        const isCaptainExit= await CaptainModel.findOne({email})
        if (isCaptainExit)
            return res.status(400).json({ message:'user already exist'});
        // Hash password before saving
        const hashedPassword = await CaptainModel.hashPassword(password);

        // Create user properly
        const captain = await createCaptain({
            firstName: fullName.firstName,
            lastName: fullName.lastName,
            email,
            password: hashedPassword,
            color:vehicle.color,
            plate:vehicle.plate,
            capacity:vehicle.capacity,
            vehicleType:vehicle.vehicleType 
        });

        // Ensure token is generated from a Mongoose document
        const token = captain.generateAuthToken();

        return res.status(201).json({ token, captain });
    }
    catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }
};

export const logincaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ error: errors.array() });
    const { email, password } = req.body
    const captain = await CaptainModel.findOne({ email }).select('+password')
    if (!captain)
        res.status(401).json({ message: 'invalid user or password' })
    const ismatch = captain.comparePassword(password)
    if (!ismatch)
        res.status(401).json({ message: 'invalid user or password' })
    const token = captain.generateAuthToken()
    res.cookie('token', token)
    res.status(200).json({ token, captain })

}

export const getCaptaionProfile = async (req, res) => {
    res.json(req.captain)
}

export const logoutCaptain = async (req,res) => {
    const token = req.cookies.token;
    res.clearCookie('token')
    await blackListTokenModel.create({token})
    res.status(200).json({'message':'logged out'})
}