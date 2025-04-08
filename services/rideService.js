import RideModel from "../models/RideModel.js";
import { getDistanceTimeMatrix } from "./mapsServices.js";
import { randomInt } from "crypto"

export const generateOtp = (num) => {
    if (num <= 0) {
        throw new Error('OTP length must be a positive integer.');
    }

    const min = Math.pow(10, num - 1);
    const max = Math.pow(10, num) - 1;
    const otp = randomInt(min, max + 1);

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
        auto: Math.round(baseFare.auto + (distanceInKm * perKmRate.auto) + (durationInMinutes * perMinuteRate.auto)),
        car: Math.round(baseFare.car + (distanceInKm * perKmRate.car) + (durationInMinutes * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + (distanceInKm * perKmRate.moto) + (durationInMinutes * perMinuteRate.moto)),
    };

    return fare;
};

export const createRide_ = async (user, pickUp, destination, vehicleType) => {
    if (!user || !pickUp || !destination || !vehicleType)
        throw new Error('all fields are required')
    const fare = await getFare(pickUp, destination)
    const ride = RideModel.create({
        user,
        pickUp,
        destination,
        fare: fare[vehicleType],
        otp: generateOtp(6)

    })
    return ride
}
export const confirmRideService = async (rideId, captain) => {
    if (!rideId || !captain) {
        throw new Error('rideId and captain are required');
    }

    const ride = await RideModel.findByIdAndUpdate(
        rideId,
        {
            captain,
            status: 'accepted',
        },
        {
            new: true,       // return the updated document
            runValidators: true // ensure schema validations are run on update
        }
    ).populate('captain').populate('user').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;
}

export const startRideService = async (rideId, otp, captain) => {
    if (!rideId || !otp || !captain) {
        throw new Error('rideId, otp, and captain are required');
    }


    const ride = await RideModel.findOne({ _id: rideId, otp, captain }).
        populate('user').populate('captain');

    if (!ride) {
        throw new Error('Ride not found or invalid OTP');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride must be in accepted state to start');
    }

    ride.status = 'ongoing';
    return await ride.save();

};
export const endRideService = async (rideId, captain) => {
    if (!rideId || !captain) {
        throw new Error('rideId and captain are required');
    }


    const ride = await RideModel.findOne({ _id: rideId, captain }).
        populate('user').populate('captain');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride must be in ongoing state to end');
    }

    ride.status = 'completed';
    return await ride.save();

};


