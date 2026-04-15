"use client";

import { AuthProvider } from "@/providers/auth-provider";
import { ToastProvider } from "@/components/toast";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
}
