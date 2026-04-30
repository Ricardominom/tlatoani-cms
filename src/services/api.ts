import axios from "axios";
import { API_BASE_URL } from "../config/env";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    },
    timeout: 10000
});

export default api;