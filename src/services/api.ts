import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../config/env";

const TOKEN_KEY = "tlatoani_cms_token";
const USER_KEY = "tlatoani_cms_user";

export class ApiError extends Error {
    statusCode: number;
    errors?: Record<string, string[]>;

    constructor(message: string, statusCode: number, errors?: Record<string, string[]>) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

const STATUS_MESSAGES: Record<number, string> = {
    400: "Solicitud inválida.",
    403: "No tienes permiso para realizar esta acción.",
    404: "Recurso no encontrado.",
    422: "Los datos enviados no son válidos.",
    429: "Demasiados intentos. Espera un momento.",
    500: "Error en el servidor. Intenta más tarde.",
};

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (err: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
        if (!err.response) {
            throw new ApiError("Sin conexión. Verifica tu red e intenta de nuevo.", 0);
        }

        const { status, data } = err.response;

        if (status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            window.location.href = "/login";
        }

        const message = data?.message ?? STATUS_MESSAGES[status] ?? "Ocurrió un error inesperado.";

        throw new ApiError(message, status, data?.errors);
    }
);

export default api;