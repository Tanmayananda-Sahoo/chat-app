import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:8000/api/v1" : "/api",
    withCredentials: true
})

export {axiosInstance};