import { createRide_ } from "../services/rideService.js";
import { validationResult } from "express-validator";
import { getFare } from "../services/rideService.js";

export const createRide = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickUp, destination, vehicleType } = req.body;


    if (!pickUp || !destination || !vehicleType) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const ride = await createRide_(req.user, pickUp, destination, vehicleType)
        res.status(201).json(ride)
    }
    catch (err) {
        next(err);
    }

}

export const getFareForRide=async(req,res,next)=>{
    const errors=validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { pickUp, destination,  } = req.query;
    try{
        const fare =await getFare(pickUp,destination)
        res.status(200).json(fare)
    }
    catch(err){
        next(err)
    }

}