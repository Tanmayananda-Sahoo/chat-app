//Imports
import express from 'express';
import router from './routes/user.routes.js';
import messageRouter from './routes/messages.routes.js';
import dotenv from 'dotenv';
import {connectDB} from '../src/db/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server, io } from './utils/socket.js';
import path from 'path';
//Configurations
dotenv.config();
const __dirname = path.resolve();

app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:true, limit:"10mb"}));
app.use(cookieParser());
app.use(cors({
    // origin: process.env.CORS_ORIGIN,
    origin:'http://localhost:5173',
    credentials: true
}))

//Routes
app.use("/api/v1/users", router);
app.use("/api/v1/messages",messageRouter);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../../frontend/dist")))
    app.get("*", (req,res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

connectDB().then(
    server.listen(process.env.PORT, () => {
    console.log(`App is running on port ${process.env.PORT}`);
}));

