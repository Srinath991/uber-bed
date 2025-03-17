import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken"
import blackListTokenModel from "../models/blackListTokenModel.js";
export const authUser = async (req, res, next) => {
    const token = req.cookies.token;
    console.log(token)
    if (!token)
        return res.status(401).json({ message: 'unauthorized' })
    const blackListToken= await blackListTokenModel.findOne({token})
    if(blackListToken)
        return res.status(401).json({ message: 'unauthorized' })
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await UserModel.findById(decoded._id)
        req.user = user
        return next()
    }
    catch (err) {
        return res.status(401).json({ message: 'unauthorized' })
    }


}