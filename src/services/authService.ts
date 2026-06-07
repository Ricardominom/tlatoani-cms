import api, { ApiError } from "./api";

const TOKEN_KEY = "tlatoani_cms_token";
const USER_KEY = "tlatoani_cms_user";

export async function login(email: string, password: string) {
    const response = await api.post("/v1/auth/login", { email, password });

    const { user, token } = response.data?.data ?? {};

    if (!user || !token) {
        throw new ApiError("La respuesta del servidor no tiene el formato esperado.", 500);
    }

    const normalizedUser = { ...user, id: user.uuid };
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
    return { user: normalizedUser, token };
}

export async function logout() {
    try {
        await api.post("/v1/auth/logout", {});
    } catch { }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
}
export async function forgotPassword(email: string): Promise<void> {
    await api.post("/v1/auth/password/forgot", {email});
}

export async function resetPassword(data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}): Promise<void> {
    await api.post("/v1/auth/password/reset", data);
}

export async function resendVerificationEmail(): Promise<void> {
    await api.post("/v1/auth/email/resend");
}