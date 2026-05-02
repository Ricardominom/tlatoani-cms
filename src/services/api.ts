import axios from "axios";
import { API_BASE_URL } from "../config/env";

const TOKEN_KEY = "tlatoani_cms_token";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    },
    timeout: 10000
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;