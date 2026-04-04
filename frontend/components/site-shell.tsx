"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
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

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-zinc-950">SCHOLR.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((item) => {
            const active = pathname === item.href || (isLanding && item.href.startsWith("/#"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  active 
                    ? "text-zinc-950" 
                    : "text-zinc-500 hover:text-zinc-950"
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
                <p className="text-xs text-zinc-500">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={() => void onLogout?.()}
                className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors">
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 shadow-sm"
              >
                {user ? "Dashboard" : "Get started"}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-950 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
        <div className="border-t border-zinc-100 bg-white p-5 md:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-semibold text-zinc-900"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-zinc-100" />
            {user ? (
              <button
                type="button"
                onClick={() => {
                  void onLogout?.();
                  setIsMobileMenuOpen(false);
                }}
                className="text-left text-lg font-semibold text-red-600"
              >
                Log out
              </button>
            ) : (
              <>
                <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-semibold text-zinc-900">
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-xl bg-zinc-900 px-4 py-3 text-center text-lg font-semibold text-white"
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
