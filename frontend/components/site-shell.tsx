"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  { href: "/#features", label: "Features" },
  { href: "/#process", label: "Process" },
  { href: "/#about", label: "About" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteShell({ user, onLogout }: SiteShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

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

  useEffect(() => {
    if (!isLanding) return;

    const sectionIds = ["about", "features", "process", "faq"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      if (window.scrollY < 120) setActiveSection("");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLanding]);

  const hashOf = (href: string) => href.match(/^\/?#(.+)$/)?.[1] ?? null;
  const isActive = (href: string) => {
    if (user) return pathname === href;
    if (!isLanding) return false;
    const hash = hashOf(href);
    if (hash === null) return href === "/" && activeSection === "";
    return activeSection === hash;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight text-zinc-950">SCHOLR.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((item) => {
            const active = isActive(item.href);
            const linkClass = `relative text-sm transition-colors ${
              active
                ? "font-semibold text-zinc-950 after:absolute after:left-0 after:-bottom-[18px] after:h-[2px] after:w-full after:bg-zinc-950"
                : "font-medium text-zinc-600 hover:text-zinc-950"
            }`;

            if (isLanding && item.href.startsWith("/#")) {
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    scrollToSection(item.href);
                  }}
                  className={linkClass}
                >
                  {item.label}
                </button>
              );
            }

            return (
              <Link key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <div className="text-right">
                <p className="text-sm font-semibold text-zinc-950">{user.full_name}</p>
                <p className="text-xs text-zinc-500">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={() => void onLogout?.()}
                className="rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="inline-flex items-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center rounded-lg bg-zinc-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:ring-offset-2"
              >
                Start free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <HiXMark className="h-5 w-5" />
          ) : (
            <HiBars3 className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-900/5 bg-white/95 p-5 shadow-sm backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((item) => {
              const active = isActive(item.href);
              const mobileClass = `rounded-lg px-2 py-1 text-left text-lg font-semibold transition ${
                active ? "bg-zinc-100 text-zinc-950" : "text-zinc-900 hover:bg-slate-100"
              }`;

              if (isLanding && item.href.startsWith("/#")) {
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      scrollToSection(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className={mobileClass}
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
                  className={mobileClass}
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
