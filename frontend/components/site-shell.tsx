"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiBars3, HiXMark } from "react-icons/hi2";

import { User } from "@/lib/types";

type SiteShellProps = {
  user: User | null;
  onLogout?: () => Promise<void>;
};

const appLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/scholarships", label: "Scholarships" },
];

const landingLinks = [
  { href: "/#about", label: "About" },
  { href: "/#features", label: "Features" },
  { href: "/#process", label: "Process" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteShell({ user, onLogout }: SiteShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = user ? appLinks : landingLinks;
  const isLanding = pathname === "/";
  const scrollToSection = (href: string) => {
    const hash = href.match(/^\/?#(.+)$/)?.[1] ?? href.match(/^\/#(.+)$/)?.[1];

    if (!hash || !isLanding) {
      return false;
    }

    const el = document.getElementById(hash);
    if (!el) {
      return false;
    }

    el.scrollIntoView({ behavior: "smooth" });
    window.history.pushState(null, "", `/#${hash}`);
    return true;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-900/5 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-zinc-950">SCHOLR.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 rounded-full border border-slate-900/5 bg-white/70 p-1 shadow-sm md:flex">
          {links.map((item) => {
            const active = user && pathname === item.href;

            if (isLanding && item.href.startsWith("/#")) {
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    scrollToSection(item.href);
                  }}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-zinc-950"
                >
                  {item.label}
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-zinc-950 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-zinc-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-6 md:flex">
          {user ? (
            <>
              <div className="text-right">
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
              <Link href="/sign-in" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white/70 hover:text-zinc-950">
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
              >
                Start free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-zinc-950 shadow-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <HiXMark className="h-6 w-6" />
          ) : (
            <HiBars3 className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-900/5 bg-white/95 p-5 shadow-sm backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((item) => {
              if (isLanding && item.href.startsWith("/#")) {
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      scrollToSection(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className="rounded-lg px-2 py-1 text-left text-lg font-semibold text-zinc-900 transition hover:bg-slate-100"
                  >
                    {item.label}
                  </button>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg px-2 py-1 text-lg font-semibold text-zinc-900 transition hover:bg-slate-100"
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="my-2 h-px bg-zinc-100" />
            {user ? (
              <button
                type="button"
                onClick={() => {
                  void onLogout?.();
                  setIsMobileMenuOpen(false);
                }}
                className="rounded-lg px-2 py-1 text-left text-lg font-semibold text-red-600 transition hover:bg-red-50"
              >
                Log out
              </button>
            ) : (
              <>
                <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)} className="rounded-lg px-2 py-1 text-lg font-semibold text-zinc-900 transition hover:bg-slate-100">
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-full bg-zinc-950 px-4 py-3 text-center text-lg font-semibold text-white"
                >
                  Start free
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
