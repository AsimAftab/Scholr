"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { User } from "@/lib/types";

type SiteShellProps = {
  user: User | null;
  onLogout?: () => Promise<void>;
};

const appLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/scholarships", label: "Scholarships" },
];

export function SiteShell({ user, onLogout }: SiteShellProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-900/5 bg-[#f5f2ec]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-zinc-950">SCHOLR.</span>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-slate-900/5 bg-white/60 p-1 md:flex">
          {(user ? appLinks : []).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active ? "bg-zinc-950 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold text-zinc-950">{user.full_name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={() => void onLogout?.()}
                className="rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-white"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700">
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-500"
              >
                Start free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
