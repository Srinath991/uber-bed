import express from 'express'
import { body } from "express-validator";
import { registerUser,loginUser } from '../controllers/userController.js';

const router = express.Router()
router.post('/register',  [
    body("fullname.firstname")
        .isLength({ min: 3 })
        .withMessage("First name must be at least 3 characters long"),
    body("fullname.lastname")
        .isLength({ min: 1 })
        .withMessage("Last name must be at least 1 character long"),
    body("email")
        .isEmail()
        .withMessage("Invalid email format"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/\d/)
        .withMessage("Password must contain at least one number")
        .matches(/[@$!%*?&]/)
        .withMessage("Password must contain at least one special character (@$!%*?&)"),
],registerUser)

router.post('/login',[
    body('email').isEmail().withMessage('invalid email'),
    body('password').isLength({min:6}).withMessage('incorrect password')
],loginUser)

export default router