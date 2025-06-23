import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: {
        type:mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    reciever: {
        type:mongoose.Types.ObjectId,
        ref:"User",
        required: true
    },
    text: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    }
},{timestamps: true});

export const Message = mongoose.model("Message",messageSchema);