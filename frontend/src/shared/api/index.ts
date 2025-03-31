import axios from "axios";

export const Api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
        "Content-Type": "application/json",
        application: "x-www-form-urlencoded"
    },
});

Api.interceptors.request.use((config) => {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`
    return config;
});
