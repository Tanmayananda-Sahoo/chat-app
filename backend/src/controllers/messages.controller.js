import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from '../models/user.model.js';
import { ApiError } from "../utils/ApiError.js";
import { Message } from "../models/message.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
import { getRecieverId, io } from "../utils/socket.js";

const getUsers = asyncHandler( async(req,res) => {
    try {
        const loggedInUserId = req.user._id;
        if(!loggedInUserId) {
            throw new ApiError(403, "Unauthorized request.");
        }
        const fetchedUsers = await User.find({_id : {$ne: loggedInUserId}}).select("-password");
        if(!fetchedUsers) {
            throw new ApiError(405, "Users could not be fetched. Try again later.");
        }
        return res.status(203).json(fetchedUsers);
    } catch (error) {
        throw new ApiError(403, error.message);
    }
})

const getMessages = asyncHandler( async(req,res) => {
    try {
        const {id: toChatUserId} = req.params;
        const myId = req.user._id;

        const fetchedMessages = await Message.find({
            $or: [
                {reciever: myId, sender: toChatUserId},
                {reciever: toChatUserId, sender: myId}
            ]
        })
        // console.log(typeof(String(fetchedMessages[0].sender)));
        return res.status(203).json(new ApiResponse(203, fetchedMessages, "Messages fetched successfully"));
    } catch (error) {
        throw new ApiError(403, error.message);
    }
})

const sendMessage = asyncHandler( async(req,res) => {
    try {
        const {text} = req.body;
        const imageLocalPath = req.files?.path;

        const {id: reciever} = req.params;
        const sender = req.user._id;
        let imageUpload;
        if(imageLocalPath) {
            imageUpload = uploadOnCloudinary(imageLocalPath);
        }
        const newMessage = new Message({
            sender,
            reciever,
            text,
            image: imageUpload?.url || ""
        })

        if(!newMessage) {
            throw new ApiError(405, "Message could not be created.");
        }
        await newMessage.save();

        const recieverSocketId = getRecieverId(reciever);
        if(recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", newMessage);
        }

        return res.status(200)
        .json(new ApiResponse(202, newMessage, "Message created Successfully."))
    } catch (error) {
        throw new ApiError(403, error.message);
    }
})

export {getUsers, getMessages, sendMessage};