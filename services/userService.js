import UserModel from "../models/UserModel.js";

export const createUser = async ({ firstname, lastname, email, password }) => {
    if (!firstname || !email || !password) {
        throw new Error("All fields are required");
    }

    // Create the user and ensure it's saved as a full Mongoose document
    const user = new UserModel({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    });

    await user.save(); // Ensure it's saved before returning

    return user; // Now it will be a proper Mongoose document with instance methods
};
