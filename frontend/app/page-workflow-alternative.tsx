{/* ALTERNATIVE VERSION C: Workflow/How It Works Section */}
{/* Replace lines 182-274 in page.tsx with this code if you prefer this version */}

      {/* How It Works - Workflow */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-10">
        <div className="rounded-3xl bg-gradient-to-br from-zinc-50 to-zinc-100 p-8 md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">
              Find your perfect scholarship in 3 simple steps
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              From profile to matches in minutes. No more manual research, no more guessing.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {/* Step 1 */}
            <div className="relative">
              <div className="rounded-2xl border-2 border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-2xl font-black text-white shadow-lg">
                  1
                </div>

                {/* Icon */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-zinc-900">Create Your Profile</h3>
                <p className="mt-3 text-zinc-600">
                  Enter your academic details once—GPA, degree level, target country, and IELTS score. Takes less than 2 minutes.
                </p>

                {/* Micro-benefits */}
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center gap-2 text-sm text-zinc-600">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    One-time setup
                  </li>
                  <li className="flex items-center gap-2 text-sm text-zinc-600">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Secure & private
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="rounded-2xl border-2 border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-2xl font-black text-white shadow-lg">
                  2
                </div>

                {/* Icon */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-zinc-900">Get Your Matches</h3>
                <p className="mt-3 text-zinc-600">
                  Instantly see scholarships ranked by your fit score. Understand exactly what you qualify for and what's missing.
                </p>

                {/* Micro-benefits */}
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center gap-2 text-sm text-zinc-600">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    0-100% match score
                  </li>
                  <li className="flex items-center gap-2 text-sm text-zinc-600">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Clear requirements
                  </li>
                </ul>
              </div>

              {/* Connection Arrow */}
              <div className="absolute -right-4 top-1/2 hidden lg:block">
                <svg className="h-8 w-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="rounded-2xl border-2 border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-2xl font-black text-white shadow-lg">
                  3
                </div>

                {/* Icon */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100">
                  <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-zinc-900">Apply Smarter</h3>
                <p className="mt-3 text-zinc-600">
                  Generate AI-powered SOPs and LORs tailored to each scholarship. Apply with confidence, not guesswork.
                </p>

                {/* Micro-benefits */}
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center gap-2 text-sm text-zinc-600">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Scholarship-specific drafts
                  </li>
                  <li className="flex items-center gap-2 text-sm text-zinc-600">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Ready to submit
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <p className="text-lg font-medium text-zinc-700">
              Ready to find your scholarship match?
            </p>
            <Link
              href="/sign-up"
              className="mt-4 inline-flex items-center justify-center rounded-md bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-zinc-800 hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Started for Free
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
