"use client";

import { AuthProvider } from "@/providers/auth-provider";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
