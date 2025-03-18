import CaptainModel from "../models/CaptainModel.js";

export const createCaptain = async ({
    firstName, lastName, email, password, color, plate,
    capacity, vehicleType
}) => {
    if (!firstName || !email || !password | !color | !plate | !capacity | !vehicleType) {
        throw new Error("All fields are required");
    }

    // Create the user and ensure it's saved as a full Mongoose document
    const user = new CaptainModel({
        fullName: {
            firstName,
            lastName
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        }
    });

    await user.save(); // Ensure it's saved before returning

    return user; // Now it will be a proper Mongoose document with instance methods
};
