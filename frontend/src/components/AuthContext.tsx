import { useEffect, useState } from "react";
import api, { authStorage } from "../api/axios";
import type { AuthResponse, AuthUser, ShelterRegisterPayload } from "../types/auth";
import { AuthContext } from "./auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authStorage.getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    api.get<AuthUser>("/auth/me/")
      .then((response) => setUser(response.data))
      .catch(() => {
        authStorage.clear();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistAuth = (payload: AuthResponse) => {
    authStorage.setTokens(payload.access, payload.refresh);
    setUser(payload.user);
  };

  const login = async (username: string, password: string) => {
    const response = await api.post<AuthResponse>("/auth/login/", { username, password });
    persistAuth(response.data);
  };

  const register = async (payload: ShelterRegisterPayload) => {
    const response = await api.post<AuthResponse>("/auth/register/", payload);
    persistAuth(response.data);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout/");
    } finally {
      authStorage.clear();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
