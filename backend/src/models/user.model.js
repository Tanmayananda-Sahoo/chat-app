import mongoose from 'mongoose';
import {asyncHandler} from '../utils/asyncHandler.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    profile: {
        type: String,
        default: ""
    }

},{timestamps: true});



userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.generateAccessToken = async function(res) {
    const accessToken = jwt.sign(
    {
        _id:this._id    
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
    res.cookie("AccessToken", accessToken, {
        secured: true,
        httpOnly: true
    })
}
userSchema.methods.generateRefreshToken = async function(res) {
    const refreshToken =  jwt.sign(
    {
        _id:this._id    
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
    res.cookie("RefreshToken", refreshToken, {
        secured: true,
        httpOnly: true
    })
}



export const User = mongoose.model("User", userSchema);