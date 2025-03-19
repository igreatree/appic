import axios from "axios";

export const Api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
        "Content-Type": "application/json",
        application: "x-www-form-urlencoded",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
});
