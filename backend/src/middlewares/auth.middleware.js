import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';

const verifyJWT = asyncHandler( async(req, _, next) => {
    try {
        const accessTokenExtracted = req.cookies?.AccessToken;
        if(!accessTokenExtracted) {
            throw new ApiError(406, "Unauthorized Request. No token provided.");
        }
        const decodedToken =  jwt.verify(accessTokenExtracted, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id);
        if(!user) {
            throw new ApiError(408, "Invalid User.")
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(406, error.message || "There is something wrong in the verifyJWT file. Please Check.");
    }
})

export {verifyJWT};