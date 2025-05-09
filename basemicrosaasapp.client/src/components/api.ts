import axios from "axios";

const api = axios.create({
    //TODO Change this to the actual URL of your backend, it will be samemachine/api  
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;