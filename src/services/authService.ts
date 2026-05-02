import api from "./api";

const TOKEN_KEY = "tlatoani_cms_token";
const USER_KEY = "tlatoani_cms_user";

export async function login(email: string, password: string) {
    const response = await api.post("/v1/auth/login", { email, password });
    const { user, token } = response.data.data;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user)); 
    return { user, token };
}

export async function logout() {
    try {
        await api.post(
            "/v1/auth/logout",
            {},
        );
    } catch { }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY); // nuevo
}

export function getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
}