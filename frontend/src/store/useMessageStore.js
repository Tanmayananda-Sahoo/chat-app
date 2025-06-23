import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { authStore } from './authStore.js';
const useMessageStore = create((set,get) => ({
    users : [],
    messages : [],
    selectedUser : null,
    isUserLoading : false,
    isMessagesLoading : false,

    loadUser : async () => {
        try {
            set ({isUserLoading : true});
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.message)
        } finally {
            set ({isUserLoading : false});
        }
    },

    loadMessages : async (userId) => {
        try {
            set ({isMessagesLoading : true});
            const res = await axiosInstance.get(`/messages/${userId}`);
            set ({messages : res.data.data});
            // console.log('Messages in loadMessages: ',res.data.data);
            // console.log('Message id type: ', typeof(res.data.data[0].sender));
        } catch (error) {
            toast.error(error.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    
    sendMessage: async(messageData) => {
        try {
            const {selectedUser, messages} = get();
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set( {messages: [...messages, res.data.data]})

            // console.log('Send message inside sendMessage: ',res.data.data);
        } catch (error) {
            toast.error(error.message);
        }
    },

    setSelectedUser : (selectedUser) => {
        set( {selectedUser: selectedUser});
        // console.log('Selected User : ',selectedUser);
        // console.log('Selected User id : ',selectedUser._id);
        // console.log('Selected User id type : ', typeof(selectedUser._id));
    },

    subscribeToMessages: () => {

        const { selectedUser } = get();
        if(!selectedUser) return;
        const socket = authStore.getState().socket;
        socket.on("newMessage", (newMessage) => {
            if(newMessage.sender != selectedUser._id) return;
            set( {messages: [...get().messages, newMessage]} )
        })
    },
    
    unsubcribeFromMessages: () => {
        const socket = authStore.getState().socket;
        socket.off("newMessage");

    }
    
}))

export {useMessageStore}