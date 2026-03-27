"use client";

import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { login, logout, me, signup } from "@/lib/api";
import { User } from "@/lib/types";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string;
  setError: (error: string) => void;
  setUser: (user: User | null) => void;
  refresh: () => Promise<void>;
  handleSignup: (payload: { email: string; full_name: string; password: string }) => Promise<User>;
  handleLogin: (payload: { email: string; password: string }) => Promise<User>;
  handleLogout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await me();
      setUser(currentUser);
    } catch {
      setError("Unable to load your session.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleSignup(payload: { email: string; full_name: string; password: string }) {
    setError("");
    const response = await signup(payload);
    setUser(response.user);
    return response.user;
  }

  async function handleLogin(payload: { email: string; password: string }) {
    setError("");
    const response = await login(payload);
    setUser(response.user);
    return response.user;
  }

  async function handleLogout() {
    await logout();
    setUser(null);
    router.push("/");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setError,
        setUser,
        refresh,
        handleSignup,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
