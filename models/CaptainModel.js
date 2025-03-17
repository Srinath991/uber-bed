import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const captionSchema = new Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, "The firstname must be at least 3 characters long"]
        },
        lastname: {
            type: String,
            minlength: [1, "The lastname must be at least 1 character long"]
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"]
    },
    password: {
        type: String,
        required: true,
        select: false // This prevents the password from being returned in queries
    },
    socketId: {
        type: String
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive'
    },
    vehicle:{
        color:{
            type:String,
            required:true,
            minlength: [3, "The color must be at least 3 character long"]
        },
        plate:{
            type:String,
            required:true,
            minlength: [3, "The plate must be at least 3 character long"]

        },
        capacity:{
            type:Number,
            required:true,
            min:[1,'capacity must be atleast 1']
        },
        vehicleType:{
            type:String,
            require:true,
            enum:['car','motorcycle','auto']
        },
        location:{
            lat:{
                type:Number,
            },
            lng:{
                type:Number,
            }
        }
    }
})

// 🔹 Static method for hashing passwords
captionSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

// 🔹 Instance method to generate JWT token
captionSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// 🔹 Instance method to compare passwords
captionSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};





export default model('Captain',captionSchema)