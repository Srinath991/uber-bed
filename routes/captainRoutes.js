import Router from 'express'
import { body } from 'express-validator';
import { registerCaptain ,logincaptain,getCaptaionProfile, logoutCaptain} from '../controllers/captainController.js';
import { authCaptain } from '../middlewares/authMiddleware.js';

const router=Router();

router.post('/register', [
    body("fullName.firstName")
        .isLength({ min: 3 })
        .withMessage("First name must be at least 3 characters long"),
    body("fullName.lastName")
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
    body('vehicle.color').isLength({min:3}).withMessage('color must be atleat 3 charcters'),
    body('vehicle.plate').isLength({min:3}).withMessage('plate must be atleat 3 charcters'),
    body('vehicle.capacity').isLength({min:1}).withMessage('capacity must be atleat 1'),
    body('vehicle.vehicleType').isIn(['car','motorcycle','auto']).withMessage('invalid vehicle type'),
],registerCaptain)

router.post('/login', [
    body('email').isEmail().withMessage('invalid email'),
    body('password').isLength({ min: 6 }).withMessage('incorrect password')
],logincaptain)

router.get('/profile',authCaptain,getCaptaionProfile)
router.post('/logout',authCaptain,logoutCaptain)

export default router





