import { User } from '../models/user.model.js';
import {ApiError} from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import bcrypt from 'bcryptjs';
import {ApiResponse} from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/uploadOnCloudinary.js';


const signup = asyncHandler( async (req,res) => {
        const {fullName, email, password} = req.body;
    try{
        if([fullName, email, password].some((field) => field?.trim() === "")) {
            throw new ApiError(405, "Every field is required. Please fill it !!");
        }
        
        if(password.length < 6) {
            throw new ApiError(403, "Password should be of minimum length of 6.");
        }
        
        const user = await User.findOne({
            $or: [{email}]
        })
        
        if(user) {
            throw new ApiError(403, "User already exists. Please login.");
        }
        
        // const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await new User({
            fullName,
            email,
            password
        })
        console.log(newUser);
        if(newUser) {
            await newUser.save();
            const registeredUser = await User.findById(newUser._id).select("-password");
            console.log(registeredUser);
            newUser.generateAccessToken(res);
            return res
            .status(200)
            .json(new ApiResponse(202, registeredUser , "User registered successfully."));
        } else{
            throw new ApiError(402, "User could not be created. Try again!!");
        }
    }   
    catch (error) {
        throw new ApiError(404, error.message);
    }
    
})


const login = asyncHandler( async(req,res) => {
    try {
        const {email,password} = req.body;
    
        if([email,password].some((field) => {field.trim() === ""})) {
            throw new ApiError(403, "All the fields are required.");
        }
    
        const user = await User.findOne({
            email,
        })
    
        if(!user) {
            throw new ApiError(405, "Invalid Credentials.")
        }
    
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
        if(!isPasswordCorrect) {
            throw new ApiError(403, "Invalid credentials.");
        }
        const loggedInUser = await User.findById(user._id).select("-password");
        user.generateAccessToken(res);
        user.generateRefreshToken(res);
    
        return res.status(200).json(new ApiResponse(202, loggedInUser , "User logged in successfully."));
    } catch (error) {
        throw new ApiError(405, error.message);
    }
    
})


const logout = asyncHandler(async(req,res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
    
        res.clearCookie("AccessToken", {
            secured: true,
            httpOnly: true
        })
        .clearCookie("RefreshToken", {
            secured: true,
            httpOnly: true
        })
        return res.status(200)
        .json(new ApiResponse(202, user, "User logged out successfully."))
    } catch (error) {
        throw new ApiError(403, error.message);
    }
})

const updateProfile = asyncHandler( async(req,res) => {
    try {
        const profileLocalPath = req.file?.path;
        const profileObtained =  await uploadOnCloudinary(profileLocalPath);

        const user = await User.findByIdAndUpdate(req.user._id, {
            profile: profileObtained?.url
        },{
            new:true
        })
        const returnUser = await User.findById(user._id).select("-password");
        return res.status(202)
        .json(new ApiResponse(202, returnUser, "Profile Picture updated successfully."))
    } catch (error) {
        throw new ApiError(406, error.message || "Something is wrong in the update profile controller in the auth controller page.");
    }    
})

const checkAuth = asyncHandler( async(req,res) => {
    try {
        // console.log(typeof(String(req.user._id)));
        return res.status(200).json(new ApiResponse(202, req.user, "User is authenticated"));
    } catch (error) {
        throw new ApiError(403, "User is not authenticated.");
    }
})

export {login, signup, logout, updateProfile, checkAuth};
