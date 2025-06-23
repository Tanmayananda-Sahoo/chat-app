import mongoose from 'mongoose';

const connectDB = async(req,res) => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Your MongoDb is connected now with connection host as: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`MongoDB connection failed with error: ${error}`);
    }
};

export {connectDB}