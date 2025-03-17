import { model, Schema } from "mongoose";

const blackListTokenSchema = new Schema({
    token: {
        type: String,
        require: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }
})

export default model('BlackListToken', blackListTokenSchema)