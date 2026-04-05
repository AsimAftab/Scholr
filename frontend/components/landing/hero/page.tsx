import Link from "next/link";
import React from "react";
import { 
  HiOutlineCheckCircle, 
  HiArrowRight, 
  HiOutlineInformationCircle,
  HiOutlineCheck
} from "react-icons/hi2";

import { User } from "@/lib/types";

interface HeroSectionProps {
  user: User | null;
}

export default function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-12 md:px-10 md:pb-24 md:pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-zinc-50 via-white to-zinc-100"></div>
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] bg-gradient-to-bl from-blue-50/40 via-transparent to-transparent"></div>

      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm">
              <span className="mr-2 flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              AI-Powered Scholarship Matching
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-zinc-950 md:text-6xl lg:text-7xl">
              Find scholarships that match your potential.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 md:text-xl lg:mx-0">
              Stop searching through endless lists. Get matched with scholarships based on your profile, backed by AI-generated application guidance.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href={user ? "/dashboard" : "/sign-up"}
                className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-zinc-800 hover:shadow-xl hover:-translate-y-0.5"
              >
                {user ? "Go to Dashboard" : "Get Your Free Matches"}
                <HiArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="group inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md"
              >
                <HiOutlineInformationCircle className="mr-2 h-5 w-5 text-zinc-500 transition-transform group-hover:translate-y-1" />
                See How It Works
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-zinc-500 lg:justify-start">
              <TrustBadge text="2 min setup" />
              <TrustBadge text="Masters, PhD & Undergraduate" />
              <TrustBadge text="No credit card required" />
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative mt-12 lg:mt-0">
            <div className="relative">
              {/* Main dashboard mock */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white font-bold">
                      JD
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">John Doe</p>
                      <p className="text-xs text-zinc-500">Masters • GPA 3.8</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">95% Match</span>
                </div>

                <div className="space-y-3">
                  <div className="rounded-lg border border-zinc-300 bg-zinc-50 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-zinc-900">Global Graduate Scholarship</p>
                        <p className="text-sm text-zinc-500">Canada • Masters</p>
                      </div>
                      <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">Full Fund</span>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-zinc-600">
                      <span className="flex items-center gap-1">
                        <HiOutlineCheckCircle className="h-4 w-4 text-green-600" />
                        GPA: 3.5+
                      </span>
                      <span className="flex items-center gap-1">
                        <HiOutlineCheckCircle className="h-4 w-4 text-green-600" />
                        IELTS: 7.0+
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-zinc-300 bg-zinc-50 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-zinc-900">Excellence Award Program</p>
                        <p className="text-sm text-zinc-500">Germany • PhD</p>
                      </div>
                      <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">€10K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBadge({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <HiOutlineCheck className="h-5 w-5 text-green-600" />
      <span>{text}</span>
    </div>
  );
}
