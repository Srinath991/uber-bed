import { createRide_,confirmRideService,startRideService,endRideService} from "../services/rideService.js";
import { validationResult } from "express-validator";
import { getFare } from "../services/rideService.js";
import { getCaptainsInRadius } from "./mapController.js";
import { getAddressCoordinate } from "../services/mapsServices.js";
import { sendMessageToSocketId } from "../socket.js";

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
        const pickupCoordinates = await getAddressCoordinate(pickUp); // must be done before ride creation
        const captains = await getCaptainsInRadius(
            pickupCoordinates.lat,
            pickupCoordinates.lng,
            2 // 2 miles radius
        );

        const ride = await createRide_(req.user, pickUp, destination, vehicleType);
        ride.otp = ''
        captains.map(async (captain) => {
            sendMessageToSocketId(captain.socketId, 'new-ride', ride)
        })
        res.status(201).json({
            ride,
            availableCaptains: captains,
        });
    } catch (err) {
        next(err);
    }
};

export const getFareForRide = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { pickUp, destination, } = req.query;
    try {
        const fare = await getFare(pickUp, destination)
        res.status(200).json(fare)
    }
    catch (err) {
        next(err)
    }

}

export async function confirmRide(req, res, next){
    const errors=validationResult(req)
    if(!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const {rideId}=req.body
    try{
        const ride=await confirmRideService(rideId,req.captain)
        sendMessageToSocketId(ride.user.socketId,'ride-confirmed',ride)
        return res.status(200).json(ride)
    }
    catch(err){
        next(err)
    }

}

export const startRide=async(req, res, next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const {rideId,otp}=req.body
    try{
        const ride=await startRideService(rideId,otp,req.captain)
        sendMessageToSocketId(ride.user.socketId,'ride-started',ride)
        return res.json(ride)

    }
    catch(err){
        next(err)
    }

}

export const endRide=async(req, res, next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const {rideId}=req.body
    try{
        const ride=await endRideService(rideId,req.captain)
        sendMessageToSocketId(ride.user.socketId,'ride-ended',ride)
        return res.json(ride)

    }
    catch(err){
        next(err)
    }

}