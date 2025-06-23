import { v2 as cloudinary} from 'cloudinary';
import { ApiError } from './ApiError.js';
import fs from 'fs';
// console.log(process.env.CLOUDINARY_API_KEY);
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_SECRET
})

const uploadOnCloudinary = async(localFilePath) => {
    try {
        const profilePic = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        });
        if(!profilePic) {
            throw new ApiError(407, "The profile pic could not be uploaded to the cloudinary. Try Again!!");
        }
        fs.unlinkSync(localFilePath);
        return profilePic;
    }
    catch (error) {
        fs.unlinkSync(localFilePath);
        throw new ApiError(406, error.message || "Something is wrong in the upload on cloudinary file ");
        return null;
    }
}

export {uploadOnCloudinary};