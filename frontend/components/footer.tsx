import Link from "next/link";
import React from "react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-zinc-200 bg-white px-5 py-8 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex flex-col items-center gap-6 md:flex-row md:gap-10">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-black tracking-tighter text-zinc-950">SCHOLR.</span>
          </Link>

          <nav className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            <a href="/#about" className="transition-colors hover:text-zinc-950">About</a>
            <a href="/#features" className="transition-colors hover:text-zinc-950">Features</a>
            <a href="/#process" className="transition-colors hover:text-zinc-950">Process</a>
            <a href="/#faq" className="transition-colors hover:text-zinc-950">FAQ</a>
          </nav>
        </div>

        <div className="flex items-center gap-8">
          <p className="text-[11px] font-medium text-zinc-400">
            © {new Date().getFullYear()} Scholr Intelligence
          </p>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-950 transition-colors hover:text-zinc-600"
          >
            Back to Top
            <svg
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
