import { Schema, model } from "mongoose";
import { type } from "os";

const rideSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        select: false
    },
    captain: {
        type: Schema.Types.ObjectId,
        ref: 'Captain',
    },
    pickUp: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    fare: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled',],
        default: 'pending'
    },
    duration: {
        type: Number
    },//in seconds
    distance: {
        type: Number
    },//in meters
    paymentId: {
        type: String
    },
    orderId: {
        type: String
    },
    signature: {
        type: String
    },
    otp:{
        type:String,
        select:false,
        required:true
    }
})

export default model('ride', rideSchema)