import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "@/api/axiosInstance";

interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
}

interface User {
  id: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  console.log("accessToken in authcontext", accessToken);
  console.log("user in authcontext", user);

  async function refreshAccessToken() {
    try {
      setLoading(true);
      const res = await api.post("/auth/refresh");
      if (res.data.accessToken) {
        const decoded: DecodedToken = jwtDecode(res.data.accessToken);
        setAccessToken(res.data.accessToken);
        setUser({ id: decoded.sub, role: decoded.role });
        setLoading(false);
      }
    } catch (error) {
      console.log("error in refreshAccessToken", error);
      setAccessToken(null);
      setUser(null);
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshAccessToken();
  }, []);

  function logout() {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      credentials: "include",
    });
    setAccessToken(null);
    setUser(null);
    setLoading(false);
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
