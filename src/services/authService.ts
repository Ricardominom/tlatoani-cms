import api from "./api";

const TOKEN_KEY = "tlatoani_cms_token";

export async function login(email: string, password: string) {
    const response = await api.post("/v1/auth/login", { email, password });
    const { user, token } = response.data.data;
    localStorage.setItem(TOKEN_KEY, token);
    return { user, token };
}

export async function logout(token: string) {
    try {
        await api.post(
            "/v1/auth/logout",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch { }
    localStorage.removeItem(TOKEN_KEY);
}

export function getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}