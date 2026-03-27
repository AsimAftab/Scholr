"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { login, logout, me, signup } from "@/lib/api";
import { User } from "@/lib/types";

export function useAuth(required = false) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await me();
      setUser(currentUser);
      if (required && !currentUser) {
        router.replace("/sign-in");
      }
    } catch {
      setError("Unable to load your session.");
      if (required) {
        router.replace("/sign-in");
      }
    } finally {
      setLoading(false);
    }
  }, [required, router]);

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

  return {
    user,
    loading,
    error,
    setError,
    setUser,
    refresh,
    handleSignup,
    handleLogin,
    handleLogout,
  };
}

