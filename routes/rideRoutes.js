import { Router } from "express";
import { body, query } from "express-validator";
import { createRide, getFareForRide, confirmRide, startRide,endRide } from "../controllers/rideController.js";
import { authCaptain, authUser } from "../middlewares/authMiddleware.js";
const router = Router()

router.post('/create', [
    body('pickUp').isString().isLength({ min: 3 }).withMessage('invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('invalid destination address'),
    body('vehicleType').isString().isLength({ min: 3 }).isIn(['auto', 'car', 'moto']).withMessage('invalid vehicleType')
], authUser, createRide)

router.get('/fare', authUser, [
    query('pickUp').isString().isLength({ min: 3 }).withMessage('invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('invalid destination address'),
], getFareForRide)

router.post('/confirm', authCaptain,
    body('rideId').isString().withMessage('invalid ride id'),
    confirmRide)

router.post('/start-ride', authCaptain,
    body('rideId').isString().withMessage('invalid ride id'),
    body('otp').isString().isLength({ min: 3 }).withMessage('invalid otp'),
    startRide)

router.post('/end-ride', authCaptain,
    body('rideId').isString().withMessage('invalid ride id'),
   
    endRide)

export default router