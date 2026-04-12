import Link from "next/link";
import React from "react";
import { 
  HiArrowRight, 
  HiOutlineInformationCircle,
  HiOutlineCheck,
  HiOutlineBookmark,
  HiOutlineSparkles
} from "react-icons/hi2";

import { User } from "@/lib/types";

interface HeroSectionProps {
  user: User | null;
}

export default function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden px-5 pb-32 pt-24 md:px-10 md:pb-40 md:pt-32">
      {/* Background elements - Sophisticated Mesh */}
      <div className="absolute inset-0 -z-10 bg-white"></div>
      <div className="absolute top-0 right-0 -z-10 h-full w-full opacity-[0.3] [background-image:radial-gradient(#e5e7eb_0.8px,transparent_0.8px)] [background-size:32px_32px]"></div>
      
      {/* Subtle colorful aura on the right to fill emptiness */}
      <div className="absolute -top-[20%] -right-[10%] -z-10 h-[1000px] w-[1000px] rounded-full bg-gradient-to-br from-blue-50/50 via-zinc-50/30 to-transparent blur-[120px]"></div>

      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-12 lg:gap-24 lg:items-center">
          {/* Left: Content (Refined Typography) */}
          <div className="text-center lg:text-left lg:col-span-7">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-zinc-100 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 shadow-sm transition-all hover:border-zinc-200">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]"></span>
              Strategic Scholarship Discovery
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-zinc-950 md:text-6xl lg:text-7xl lg:leading-[1.05] xl:text-[84px]">
              Navigate your <br className="hidden md:block" />
              future with <br className="hidden md:block" />
              total <span className="text-zinc-400 font-light italic">clarity.</span>
            </h1>

            <p className="mx-auto mt-12 max-w-xl text-lg text-zinc-500 md:text-xl lg:mx-0 leading-relaxed font-normal">
              Scholr bridges the gap between ambition and opportunity. We decode complex scholarship requirements into clear, actionable matches tailored to your academic profile.
            </p>

            <div className="mt-14 flex flex-col gap-5 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href={user ? "/dashboard" : "/sign-up"}
                className="inline-flex items-center justify-center rounded-2xl bg-zinc-950 px-10 py-4.5 text-sm font-bold text-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all hover:bg-zinc-800 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] hover:-translate-y-1 active:scale-[0.98]"
              >
                {user ? "Go to Dashboard" : "Find Your Opportunities"}
                <HiArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="group inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-10 py-4.5 text-sm font-bold text-zinc-900 transition-all hover:bg-zinc-50 hover:border-zinc-300 active:scale-[0.98]"
              >
                <HiOutlineInformationCircle className="mr-2 h-5 w-5 text-zinc-400 transition-colors group-hover:text-zinc-600" />
                See How It Works
              </a>
            </div>

            {/* Social Proof / Stats */}
            <div className="mt-20 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-300 lg:justify-start">
              <div className="flex items-center gap-3 group transition-colors hover:text-zinc-400">
                <div className="h-px w-8 bg-zinc-200 group-hover:bg-zinc-400 transition-colors" />
                <span>Verified Data</span>
              </div>
              <div className="flex items-center gap-3 group transition-colors hover:text-zinc-400">
                <div className="h-px w-8 bg-zinc-200 group-hover:bg-zinc-400 transition-colors" />
                <span>Global Reach</span>
              </div>
              <div className="flex items-center gap-3 group transition-colors hover:text-zinc-400">
                <div className="h-px w-8 bg-zinc-200 group-hover:bg-zinc-400 transition-colors" />
                <span>Secure AI</span>
              </div>
            </div>
          </div>

          {/* Right: Visual (Layered Premium Elements) */}
          <div className="relative mt-24 lg:mt-0 lg:col-span-5">
            <div className="relative mx-auto w-full max-w-[480px]">
              
              {/* Decorative Glow */}
              <div className="absolute -inset-20 -z-10 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_70%)] blur-3xl"></div>

              {/* Main Card: Scholarship Detail */}
              <div className="relative z-10 translate-x-4 rounded-[32px] border border-white/40 bg-white/80 p-9 shadow-[0_40px_80px_-16px_rgba(0,0,0,0.12)] backdrop-blur-2xl ring-1 ring-black/5 transition-transform hover:scale-[1.02] duration-500">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-zinc-950 text-white shadow-xl rotate-3">
                      <HiOutlineSparkles className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black leading-none text-zinc-400 uppercase tracking-widest mb-1">Strategic Match</p>
                      <p className="text-sm font-black text-zinc-950 uppercase tracking-tight">98.4% Accuracy</p>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-sm">
                    <HiOutlineBookmark className="h-5 w-5 text-zinc-400" />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold text-zinc-950 leading-[1.1] tracking-tight">Global Excellence <br />Masters Grant</h3>
                    <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Toronto, Canada • Fully Funded</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2.5">
                    <Badge text="Masters" />
                    <Badge text="GPA 3.8+" />
                    <Badge text="IELTS 7.5" />
                  </div>
                </div>
              </div>

              {/* Float Item 1: Verification Hook (Top Left) */}
              <div className="absolute -top-10 -left-10 z-20 flex items-center gap-3 rounded-2xl border border-white bg-white/90 p-4 shadow-xl backdrop-blur-md animate-bounce-slow">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <HiOutlineCheck className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Verified Today</span>
              </div>

              {/* Float Item 2: Progress (Bottom Right) */}
              <div className="absolute -bottom-14 -right-4 z-20 w-56 rounded-2xl border border-zinc-100 bg-white p-7 shadow-2xl transition-all hover:-translate-y-2">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Discovery Engine</p>
                  <span className="text-[10px] font-black text-blue-600">Syncing</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-50 overflow-hidden">
                  <div className="h-full w-2/3 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>
                </div>
                <p className="mt-4 text-[10px] font-black text-zinc-950 uppercase tracking-widest">Indexing 4,200+ Institutions</p>
              </div>

              {/* Background Ghost Elements */}
              <div className="absolute top-1/2 left-1/2 -z-20 h-full w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-50/20 blur-[100px]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-xl border border-zinc-100 bg-zinc-50/50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 shadow-sm">
      {text}
    </span>
  );
}
