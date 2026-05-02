import { createContext, useContext, useEffect, useState } from "react";
import {
  getStoredToken,
  getStoredUser,
  login as loginService,
  logout as logoutService
} from "../services/authService";

interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({} as AuthState);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = getStoredToken();
    const savedUser = getStoredUser();
    setToken(savedToken);
    setUser(savedUser);
    setIsLoading(false);
  }, []);

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

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
