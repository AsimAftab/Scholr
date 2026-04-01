{/* ALTERNATIVE VERSION: Social Proof Section */}
{/* Replace lines 182-274 in page.tsx with this code if you prefer this version */}

      {/* Social Proof Section */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-10">
        <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 text-white md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Trusted by students targeting top destinations
            </h2>
            <p className="mt-4 text-lg text-zinc-300">
              Join thousands of students who've found their perfect scholarship match.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Stat 1 */}
            <div className="rounded-2xl border border-zinc-700 bg-zinc-800/50 p-6 text-center backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20">
                <svg className="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-white">50+</p>
              <p className="mt-2 text-sm font-medium text-zinc-400">Scholarships Indexed</p>
            </div>

            {/* Stat 2 */}
            <div className="rounded-2xl border border-zinc-700 bg-zinc-800/50 p-6 text-center backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20">
                <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-white">5+</p>
              <p className="mt-2 text-sm font-medium text-zinc-400">Countries Covered</p>
            </div>

            {/* Stat 3 */}
            <div className="rounded-2xl border border-zinc-700 bg-zinc-800/50 p-6 text-center backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/20">
                <svg className="h-8 w-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-white">3</p>
              <p className="mt-2 text-sm font-medium text-zinc-400">Degree Levels</p>
            </div>

            {/* Stat 4 */}
            <div className="rounded-2xl border border-zinc-700 bg-zinc-800/50 p-6 text-center backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20">
                <svg className="h-8 w-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-white">90 sec</p>
              <p className="mt-2 text-sm font-medium text-zinc-400">Avg. Time to Match</p>
            </div>
          </div>

          {/* Country Flags/Names */}
          <div className="mt-12 text-center">
            <p className="text-sm font-medium text-zinc-400">Scholarships from</p>
            <p className="mt-3 text-lg font-semibold text-white">
              USA • UK • Canada • Germany • Australia • Netherlands
            </p>
          </div>
        </div>
      </section>
