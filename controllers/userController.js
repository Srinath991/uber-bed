import UserModel from "../models/UserModel.js"
import { createUser } from "../services/userService.js"
import { validationResult } from "express-validator"


export const registerUser = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const { fullname, email, password } = req.body;

        // Hash password before saving
        const hashedPassword = await UserModel.hashPassword(password);

        // Create user properly
        const user = await createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword
        });

        // Ensure token is generated from a Mongoose document
        const token = user.generateAuthToken();

        return res.status(201).json({ token, user });
    }
    catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }
};

export const loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ error: errors.array() });
    const {email,password}=req.body
    const user= await UserModel.findOne({email}).select('+password')
    if(!user)
        res.status(401).json({message:'invalid user or password'})
    const ismatch=user.comparePassword(password)
    if(!ismatch)
        res.status(401).json({message:'invalid user or password'})
    const token=user.generateAuthToken()
    res.status(200).json({token,user})

}
