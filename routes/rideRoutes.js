import { Router } from "express";
import { body } from "express-validator";
import { createRide } from "../controllers/rideController.js";
import { authUser } from "../middlewares/authMiddleware.js";
const router = Router()

router.post('/create', [
    body('pickUp').isString().isLength({ min: 3 }).withMessage('invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('invalid destination address'),
    body('vehicleType').isString().isLength({ min: 3 }).isIn(['auto', 'car', 'moto']).withMessage('invalid vehicleType')
], authUser, createRide)

export default router