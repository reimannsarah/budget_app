import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  sendLoginCode,
  verifyLoginCode,
  storeTokens,
  clearTokens,
  getAccessToken,
  storeUserEmail,
  getUserEmail,
} from "@/services/api-client";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  email: string | null;
  sendCode: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  email: null,
  sendCode: async () => {},
  verifyCode: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getAccessToken(), getUserEmail()]).then(([token, storedEmail]) => {
      setIsAuthenticated(!!token);
      setEmail(storedEmail);
      setIsLoading(false);
    });
  }, []);

  const sendCode = useCallback(async (email: string) => {
    await sendLoginCode(email);
  }, []);

  const verifyCode = useCallback(async (email: string, code: string) => {
    const tokens = await verifyLoginCode(email, code);
    await storeTokens(tokens.access, tokens.refresh);
    await storeUserEmail(email);
    setEmail(email);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await clearTokens();
    setEmail(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, email, sendCode, verifyCode, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
