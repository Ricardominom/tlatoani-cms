import { createContext, useContext, useState } from "react";
import {
  getStoredToken,
  getStoredUser,
  login as loginService,
  logout as logoutService
} from "../services/authService";

const USER_KEY = "tlatoani_cms_user";

interface AuthUser {
    id: string;
    name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
    role: string;
    created_at: string;
    active: boolean;
  }

  interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updated: AuthUser) => void;
  }

const AuthContext = createContext<AuthState>({} as AuthState);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [isLoading] = useState(false);

  async function login(email: string, password: string) {
    const data = await loginService(email, password);
    setToken(data.token);
    setUser(data.user);
  }

  async function logout() {
    await logoutService();
    setToken(null);
    setUser(null);
  }

  function updateUser(updated: AuthUser) {
    setUser(updated);
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
