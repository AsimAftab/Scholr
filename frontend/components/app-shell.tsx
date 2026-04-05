"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { User } from "@/lib/types";
import { ConfirmDialog } from "@/components/confirm-dialog";

type AppShellProps = {
  user: User;
  title: string;
  subtitle: string;
  onLogout: () => Promise<void>;
  children: React.ReactNode;
  compact?: boolean;
  /**
   * Locks the viewport to screen height on large screens.
   * When enabled, children must implement their own scroll containers.
   */
  lockViewport?: boolean;
};

export function AppShell({ user, title, subtitle, onLogout, children, compact = false, lockViewport = false }: AppShellProps) {
  const pathname = usePathname();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const navItems =
    user.role === "admin"
      ? [
          { href: "/dashboard", label: "Dashboard", meta: "Overview" },
          { href: "/scholarships", label: "All Scholarships", meta: "Catalog" },
          { href: "/sources", label: "Sources", meta: "Crawlers" },
          { href: "/admin", label: "Operations", meta: "Ingestion" },
          { href: "/settings", label: "Settings", meta: "Account" },
        ]
      : [
          { href: "/dashboard", label: "Dashboard", meta: "Overview" },
          { href: "/scholarships", label: "Scholarships", meta: "Matches" },
          { href: "/profile", label: "Profile Setup", meta: "Academic info" },
          { href: "/settings", label: "Settings", meta: "Account" },
        ];

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLogoutDialogOpen(false);
    await onLogout();
  };

  const handleLogoutCancel = () => {
    setIsLogoutDialogOpen(false);
  };

  return (
    <div className={`min-h-screen lg:grid lg:grid-cols-[280px_1fr] ${lockViewport ? "lg:h-screen lg:overflow-hidden" : ""}`}>
      <aside className="lg:sticky lg:top-0 lg:h-screen border-r border-zinc-900/8 bg-zinc-950 px-6 py-8 text-white lg:overflow-y-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-white">SCHOLR.</span>
        </div>

        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-300">Account</p>
          <p className="mt-3 text-lg font-semibold text-white">{user.full_name}</p>
          <p className="mt-1 text-sm text-zinc-200">{user.email}</p>
          <p className="mt-3 inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-100">
            {user.role}
          </p>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 transition ${
                  active ? "bg-zinc-900 text-white" : "bg-white/5 text-zinc-100 hover:bg-white/10"
                }`}
              >
                <span className="font-semibold">{item.label}</span>
                <span className={`text-xs ${active ? "text-zinc-50" : "text-zinc-300"}`}>{item.meta}</span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogoutClick}
          className="mt-8 w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Log out
        </button>
      </aside>

      <div className={`min-w-0 ${lockViewport ? "lg:flex lg:h-screen lg:flex-col lg:overflow-hidden" : ""}`}>
        <header className={`border-b border-zinc-900/8 bg-white/75 backdrop-blur-xl ${compact ? "px-6 py-4 md:px-8" : "px-6 py-6 md:px-10"}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-zinc-500">Scholr app</p>
          <h1 className={`mt-3 font-extrabold tracking-tight text-zinc-900 ${compact ? "text-3xl" : "text-4xl"}`}>{title}</h1>
          <p className={`mt-3 max-w-3xl text-zinc-600 ${compact ? "text-sm leading-6" : "text-base leading-7"}`}>{subtitle}</p>
        </header>

        <main className={`${compact ? "px-6 py-5 md:px-8" : "px-6 py-8 md:px-10"} ${lockViewport ? "flex-1 lg:overflow-hidden" : ""}`}>{children}</main>
      </div>

      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        title="Log out"
        message="Are you sure you want to log out?"
        confirmLabel="Log out"
        cancelLabel="Cancel"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </div>
  );
}
