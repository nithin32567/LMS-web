import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { api, setUnauthorizedHandler } from "@/api/axiosInstance";

interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
  name: string;
  email: string;
  avatar: string;
}

interface User {
  id: string;
  role: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  logout: () => void;
  loading: boolean;
  setAuthData: (token: string, userData: DecodedToken) => void;
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
        setUser({
          id: decoded.sub,
          role: decoded.role,
          name: decoded.name,
          email: decoded.email,
          avatar: decoded.avatar,
        });
        setLoading(false);
      } else {
        setAccessToken(null);
        setUser(null);
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

    const handleUnauthorized = () => {
      setAccessToken(null);
      setUser(null);
      setLoading(false);
    };

    setUnauthorizedHandler(handleUnauthorized);

    return () => {
      setUnauthorizedHandler(null);
    };
  }, []);

  const setAuthData = useCallback((token: string, userData: DecodedToken) => {
    setAccessToken(token);
    setUser({
      id: userData.sub,
      role: userData.role,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar,
    });
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
      setAccessToken(null);
      setUser(null);
      setLoading(false);
    } catch (error) {
      console.log("error in logout", error);
      setAccessToken(null);
      setUser(null);
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ user, accessToken, logout, loading, setAuthData }),
    [user, accessToken, logout, loading, setAuthData]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
