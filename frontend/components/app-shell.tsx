"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  HiOutlineHome, 
  HiOutlineAcademicCap, 
  HiOutlineUserCircle, 
  HiOutlineBriefcase, 
  HiOutlineArrowLeftOnRectangle,
  HiOutlineCog6Tooth
} from "react-icons/hi2";

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
          { href: "/dashboard", label: "Dashboard", meta: "Overview", icon: HiOutlineHome },
          { href: "/scholarships", label: "Catalog", meta: "All Scholarships", icon: HiOutlineBriefcase },
          { href: "/sources", label: "Sources", meta: "Crawlers", icon: HiOutlineAcademicCap },
          { href: "/settings", label: "Settings", meta: "Account", icon: HiOutlineCog6Tooth },
        ]
      : [
          { href: "/dashboard", label: "Dashboard", meta: "Overview", icon: HiOutlineHome },
          { href: "/scholarships", label: "Scholarships", meta: "Matches", icon: HiOutlineAcademicCap },
          { href: "/profile", label: "Academic Info", meta: "Profile", icon: HiOutlineUserCircle },
          { href: "/settings", label: "Settings", meta: "Account", icon: HiOutlineCog6Tooth },
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
    <div className={`min-h-screen bg-zinc-50 lg:grid lg:grid-cols-[280px_1fr] ${lockViewport ? "lg:h-screen lg:overflow-hidden" : ""}`}>
      <aside className="lg:sticky lg:top-0 lg:h-screen border-r border-zinc-200/50 bg-[#09090b] px-4 py-8 text-white flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3.5 px-4 mb-10">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 shadow-[0_4px_12px_rgba(255,255,255,0.1)]">
              <span className="text-[14px] font-black text-zinc-950 tracking-tight">S</span>
            </div>
            <span className="text-lg font-extrabold tracking-[-0.03em] text-white">SCHOLR.</span>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-lg px-4 py-2.5 transition-all duration-200 ${
                    active 
                      ? "bg-zinc-800/50 text-white border border-white/5 shadow-sm" 
                      : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`h-5 w-5 transition-colors ${active ? "text-zinc-100" : "text-zinc-600 group-hover:text-zinc-400"}`} />
                    <span className="text-[15px] font-semibold tracking-tight">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={handleLogoutClick}
            className="group flex w-full items-center gap-3.5 rounded-lg px-4 py-2.5 transition-all duration-200 text-zinc-500 hover:bg-white/[0.03] hover:text-red-400"
          >
            <HiOutlineArrowLeftOnRectangle className="h-5 w-5 text-zinc-600 transition-colors group-hover:text-red-500" />
            <span className="text-[15px] font-semibold tracking-tight">Logout</span>
          </button>
        </div>
      </aside>

      <div className={`min-w-0 ${lockViewport ? "lg:flex lg:h-screen lg:flex-col lg:overflow-hidden" : ""}`}>
        <header className={`border-b border-zinc-200/50 bg-white/80 backdrop-blur-3xl px-6 py-6 transition-all duration-300 md:px-12`}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className={`text-4xl font-bold tracking-tight text-zinc-950 leading-tight`}>{title}</h1>
              <p className={`mt-3 max-w-2xl text-base leading-relaxed text-zinc-500 font-medium`}>{subtitle}</p>
            </div>
            
            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-bold text-zinc-900 leading-tight">{user.full_name}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 border border-blue-100 shadow-sm">
                 <div className="flex h-full w-full items-center justify-center rounded-full text-[12px] font-bold text-blue-700 uppercase">
                    {user.full_name?.split(" ").map(n => n[0]).join("") || "U"}
                 </div>
              </div>
            </div>
          </div>
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
