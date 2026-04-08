import React from "react";

export default function AboutSection() {
  return (
    <section className="border-t border-zinc-200 bg-white px-5 py-20 md:px-10" id="about">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-12 lg:gap-20">
          {/* Main Content */}
          <div className="lg:col-span-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">About Scholr</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl lg:leading-[1.1]">
              We started Scholr to solve the scholarship search problem.
            </h2>
            <p className="mt-8 text-lg text-zinc-500 leading-relaxed max-w-2xl">
              Every year, millions of scholarships go unclaimed because students can&apos;t find them or don&apos;t know if they qualify. We use AI to eliminate the guesswork and help you discover opportunities you&apos;d otherwise miss.
            </p>
          </div>

          {/* Info Side */}
          <div className="mt-12 space-y-10 lg:col-span-5 lg:mt-0 lg:pt-14">
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold text-zinc-950 uppercase tracking-[0.2em]">Our mission</h3>
              <p className="text-[15px] leading-relaxed text-zinc-500">
                Make international education accessible by matching every student with scholarships they actually qualify for.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold text-zinc-950 uppercase tracking-[0.2em]">How we&apos;re different</h3>
              <p className="text-[15px] leading-relaxed text-zinc-500">
                Unlike scholarship databases that just list opportunities, we analyze your profile and tell you exactly where you stand.
              </p>
            </div>
          </div>
        </div>

        {/* Why Trust Us Card */}
        <div className="mt-12 rounded-3xl border border-zinc-300 bg-zinc-50/50 py-5 px-8 shadow-sm">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="text-[11px] font-bold text-black-500 uppercase tracking-[0.2em]">Why trust us</h3>
              <p className="mt-4 text-sm text-zinc-500 leading-relaxed">
                We&apos;re committed to data integrity and student privacy in everything we build.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ul className="grid gap-8 sm:grid-cols-2">
                <li className="flex gap-4">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[14px] leading-relaxed text-zinc-500">
                    <span className="font-bold text-zinc-900">AI-powered analysis:</span> Our engine reads 10,000+ scholarship pages daily to extract and verify requirements.
                  </p>
                </li>
                <li className="flex gap-4">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[14px] leading-relaxed text-zinc-500">
                    <span className="font-bold text-zinc-900">Fresh data guarantee:</span> Every scholarship verified within 24 hours of deadline changes.
                  </p>
                </li>
                <li className="flex gap-4">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[14px] leading-relaxed text-zinc-500">
                    <span className="font-bold text-zinc-900">Privacy-first:</span> Your profile data is encrypted and never shared with third parties.
                  </p>
                </li>
                <li className="flex gap-4">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[14px] leading-relaxed text-zinc-500">
                    <span className="font-bold text-zinc-900">Unbiased rankings:</span> We don&apos;t accept payment to promote scholarships. No ads, just matches.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Sources / Trust Indicators */}
        <div className="mt-6 rounded-3xl border border-zinc-300 bg-zinc-50/50 py-5 px-8 shadow-sm">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            <div className="text-center lg:text-left">
              <p className="text-[11px] font-bold text-black-500 uppercase tracking-[0.2em]">Data Sources</p>
              <p className="mt-4 text-sm text-zinc-500 leading-relaxed max-w-xl">
                Aggregated from official university portals, government databases, and trusted scholarship platforms worldwide.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-black text-zinc-500">
              <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 shadow-sm transition-transform hover:scale-105">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="uppercase tracking-widest">Real-time sync</span>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 shadow-sm transition-transform hover:scale-105 uppercase tracking-widest">
                Daily updates
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 shadow-sm transition-transform hover:scale-105 uppercase tracking-widest">
                Verified Search
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
