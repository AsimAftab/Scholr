import Link from "next/link";
import React from "react";
import { HiArrowRight, HiOutlineBookmark } from "react-icons/hi2";

import { User } from "@/lib/types";

interface HeroSectionProps {
  user: User | null;
}

export default function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-16 sm:py-20 md:px-10 md:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid lg:grid-cols-12 lg:gap-16 lg:items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left lg:col-span-7">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
              <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600"></span>
              AI Scholarship Matching
            </div>

            <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl lg:text-[56px] lg:leading-[1.05]">
              Find scholarships that actually fit your profile.
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-600 sm:text-base md:mt-5 md:text-lg lg:mx-0 leading-relaxed">
              Scholr matches your profile to fully-funded scholarships worth applying to. Plus deadline tracking so you never miss one.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href={user ? "/dashboard" : "/sign-up"}
                className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 active:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:ring-offset-2"
              >
                {user ? "Go to dashboard" : "Get started free"}
                <HiArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Right: Product Preview Card */}
          <div className="relative mt-12 sm:mt-16 lg:mt-0 lg:col-span-5">
            <div className="mx-auto w-full max-w-[440px]">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">United Kingdom</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">Chevening Scholarship</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      Fully-funded one-year master&apos;s in the UK for future leaders with strong academics and work experience.
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    92% match
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Tag>Masters</Tag>
                  <Tag>GPA 3.5+</Tag>
                  <Tag>IELTS 7.0</Tag>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">Deadline</p>
                    <p className="mt-1 text-sm font-medium text-zinc-900">Nov 5, 2026</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Save scholarship"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900"
                  >
                    <HiOutlineBookmark className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700">
      {children}
    </span>
  );
}
