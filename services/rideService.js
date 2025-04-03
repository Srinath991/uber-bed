import RideModel from "../models/RideModel.js";
import { getDistanceTimeMatrix } from "./mapsServices.js";
import {randomInt} from "crypto"

export const generateOtp = (num) => {
    if (num <= 0) {
      throw new Error('OTP length must be a positive integer.');
    }
    
    const min = Math.pow(10, num - 1);
    const max = Math.pow(10, num) - 1;
    const otp =randomInt(min, max + 1);
    
    return otp.toString();
  };
export const getFare = async (pickUp, destination) => {
    if (!pickUp || !destination)
        throw new Error('Pickup and destination are required');

    // Fetch distance and time matrix
    const distanceTime = await getDistanceTimeMatrix(pickUp, destination);
    const distanceInKm = distanceTime.distance.value / 1000; // Convert meters to kilometers
    const durationInMinutes = distanceTime.duration.value / 60; // Convert seconds to minutes

    // Base fare for each vehicle type
    const baseFare = {
        auto: 25,
        car: 30,
        moto: 20
    };

    // Per kilometer rate for each vehicle type
    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    // Per minute rate for each vehicle type
    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };

    // Calculate total fare for each vehicle type
    const fare = {
        auto: baseFare.auto + (distanceInKm * perKmRate.auto) + (durationInMinutes * perMinuteRate.auto),
        car: baseFare.car + (distanceInKm * perKmRate.car) + (durationInMinutes * perMinuteRate.car),
        moto: baseFare.moto + (distanceInKm * perKmRate.moto) + (durationInMinutes * perMinuteRate.moto),
    };

    return fare;
};

export const createRide_ = async (user, pickUp, destination, vehicleType) => {
    if (!user || !pickUp || !destination || !vehicleType)
        throw new Error('all fields are required')
    const fare = await getFare(pickUp, destination)
    const ride =  RideModel.create({
        user,
        pickUp,
        destination,
        fare: fare[vehicleType],
        otp:generateOtp(6)
    
    })
    return ride
}
