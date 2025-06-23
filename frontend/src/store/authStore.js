import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

import {io} from 'socket.io-client';
// import { Socket } from 'socket.io-client';
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8000" : "/"

const authStore = create((set,get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    socket: null,
    onlineUsers: [],
    checkAuth: async() => {
        try {
            const response = await axiosInstance.get("/users/check");
            // console.log('Axios response: ', response);
            set({authUser: response.data.data});
            console.log('Authenticated User: ',response.data.data);
            // console.log('Authenticated User full Name: ',response.data.data.fullName);
            await get().connectSocket();
            console.log(response.data);
        } catch (error) {
            // console.log('Error in check Auth function: ', error);
            set({authUser: null})
        } finally{
            set({isCheckingAuth: false})
        }
    },

    signUp : async (data) => {
        try {
            set({ isSigningUp : true })
            const res = await axiosInstance.post("/users/signup", data);
            set({authUser : res.data});
            toast.success("Account created successfully.");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp : false })
        }
    },
    
    login: async(data) => {
        try {
            set({ isLoggingIn: true })
            const res = await axiosInstance.post("/users/login", data);
            set({ authUser: res.data })
            toast.success("User logged in successfully.")
            await get().connectSocket();
            // console.log(authUser);
        } catch (error) {
            toast.error(error.message);
        } finally{
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/users/logout");
            set({ authUser: null });
            toast.success("User logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async(data) => {
        try {
            console.log('Inside updateProfile data: ',data);
            set({ isUpdatingProfile: true });
            const res = await axiosInstance.patch("/users/update-profile", data, {
                'Content-type': 'multipart/form-data',
            });
            set({ authUser: res.data });
            console.log('Inside updateProfile res.data: ',res.data);
            toast.success("User profile updated successfully.")
        } catch (error) {
            toast.error(error.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    connectSocket: async() => {
        const {authUser} = await get ();
        if(!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL,{
            query: {
                userId : authUser._id
            }
        });
        socket.connect();
        set({socket: socket})

        socket.on("getOnlineUsers", (userIds) => {
            console.log('📲 Client received:', userIds);
            set( {onlineUsers: userIds} )
        })
    },
    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
        // set({socket: socket})
    }
    

}))

export {authStore};