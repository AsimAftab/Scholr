import Link from "next/link";

const featureCards = [
  {
    eyebrow: "Smart Discovery",
    title: "Access 50+ Scholarships in One Place",
    copy: "Browse opportunities from USA, UK, Canada, Germany, and more-all updated and verified in real-time.",
    icon: "search",
    color: "blue"
  },
  {
    eyebrow: "AI-Powered Matching",
    title: "See Exactly What You Qualify For",
    copy: "Get a 0-100% match score based on your GPA, IELTS, and degree level. Know your fit before you apply.",
    icon: "target",
    color: "purple"
  },
  {
    eyebrow: "Application Assistant",
    title: "Generate Winning Applications in Minutes",
    copy: "Create scholarship-specific SOPs and LORs tailored to your profile. Stop writing generic essays.",
    icon: "sparkles",
    color: "green"
  },
];

const processSteps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Enter your GPA, degree level, target country, and IELTS score once.",
    icon: "user"
  },
  {
    number: "02",
    title: "Get Your Matches",
    description: "Instantly see scholarships ranked 0-100% by your fit score.",
    icon: "target"
  },
  {
    number: "03",
    title: "Apply Smarter",
    description: "Generate AI-powered SOPs and LORs tailored to each scholarship.",
    icon: "sparkles"
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white selection:bg-zinc-900 selection:text-white">
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-zinc-950">SCHOLR.</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900">Features</a>
            <a href="#about" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900">About</a>
            <a href="#process" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900">Process</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900">
              Sign in
            </Link>
            <Link href="/sign-up" className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
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
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-zinc-800 hover:shadow-xl hover:-translate-y-0.5"
                >
                  Get Your Free Matches
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <a
                  href="#features"
                  className="group inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md"
                >
                  <svg className="mr-2 h-5 w-5 text-zinc-500 transition-transform group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  See How It Works
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-zinc-500 lg:justify-start">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>2 min setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Masters, PhD &amp; Undergraduate</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No credit card required</span>
                </div>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative mt-12 lg:mt-0">
              {/* Floating scholarship cards */}
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
                    <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-zinc-900">Global Graduate Scholarship</p>
                          <p className="text-sm text-zinc-500">Canada • Masters</p>
                        </div>
                        <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">Full Fund</span>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-zinc-600">
                        <span className="flex items-center gap-1">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          GPA: 3.5+ ✓
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          IELTS: 7.0+ ✓
                        </span>
                      </div>
                    </div>

                    <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4">
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

      {/* Before/After Comparison */}
      <section className="bg-white px-5 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">
              Before Scholr vs. After Scholr
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              See how we transform scholarship research from manual chaos to intelligent automation.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* Before Column */}
            <div className="rounded-2xl border-2 border-red-200 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-zinc-900">Before Scholr</h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-zinc-700">20+ hours of manual research</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-zinc-700">Copy-pasting into Excel sheets</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-zinc-700">Guessing eligibility from vague text</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-zinc-700">Writing generic, unfocused SOPs</span>
                </li>
              </ul>
            </div>

            {/* After Column */}
            <div className="rounded-2xl border-2 border-green-200 bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-zinc-900">After Scholr</h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-zinc-900">2 minutes to see your matches</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-zinc-900">Scholarships ranked by fit score</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-zinc-900">Clear eligibility requirements decoded</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-zinc-900">AI-generated, scholarship-specific SOPs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200 bg-zinc-50 px-5 py-20 md:px-10" id="features">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Features</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 md:text-5xl">
              A sharper workflow from discovery to application prep.
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              Stop researching manually. Let AI do the heavy lifting.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {featureCards.map((card) => (
              <article
                key={card.title}
                className="group rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
              >
                {/* Icon */}
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${card.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' :
                  card.color === 'purple' ? 'bg-purple-100 group-hover:bg-purple-200' :
                    'bg-green-100 group-hover:bg-green-200'
                  } transition-colors`}>
                  {card.icon === 'search' && (
                    <svg className="h-7 w-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                  {card.icon === 'target' && (
                    <svg className="h-7 w-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  )}
                  {card.icon === 'sparkles' && (
                    <svg className="h-7 w-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  )}
                </div>

                {/* Eyebrow */}
                <p className={`text-sm font-semibold uppercase tracking-wider ${card.color === 'blue' ? 'text-blue-600' :
                  card.color === 'purple' ? 'text-purple-600' :
                    'text-green-600'
                  }`}>
                  {card.eyebrow}
                </p>

                {/* Title */}
                <h3 className="mt-2 text-xl font-bold tracking-tight text-zinc-950">{card.title}</h3>

                {/* Copy */}
                <p className="mt-3 text-zinc-600 leading-relaxed">{card.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-t border-zinc-200 bg-white px-5 py-20 md:px-10" id="about">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">About Scholr</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">
              Designed as the operational layer for decisions.
            </h2>
            <p className="mt-6 text-lg text-zinc-600">
              Scholr is not just a search surface. It is a structured decision system for applicants who need to know what they qualify for, why they qualify, and what to prepare next.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <InfoPanel title="For students" copy="Understand fit, missing requirements, and next steps before spending hours on essays." />
              <InfoPanel title="For teams" copy="Create a foundation for scholarship ingestion and scalable recommendation workflows." />
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-zinc-200 bg-zinc-50 px-5 py-20 pb-32 md:px-10" id="process">
        <div className="mx-auto max-w-7xl">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">How it works</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 md:text-5xl">
              Three simple steps to your scholarship
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              We use AI to analyze thousands of scholarships and match them to your unique profile. Instead of spending hours searching and comparing requirements, you get a personalized list of opportunities ranked by how well you fit. Then we help you apply faster with AI-generated essays and recommendations tailored to each scholarship.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {processSteps.map((step, index) => (
              <div key={step.title} className="relative group">
                {/* Step Number */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-2xl font-black text-white shadow-lg ring-4 ring-zinc-50 mx-auto">
                  {step.number}
                </div>

                {/* Content Card */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                  {/* Icon */}
                  <div className="mb-4 flex justify-center">
                    {step.icon === 'user' && (
                      <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    {step.icon === 'target' && (
                      <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {step.icon === 'sparkles' && (
                      <svg className="h-10 w-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    )}
                  </div>

                  <h3 className="text-center text-xl font-bold tracking-tight text-zinc-950">{step.title}</h3>
                  <p className="mt-3 text-center text-zinc-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20 md:px-10">
        <div className="mx-auto max-w-7xl rounded-3xl bg-zinc-950 px-8 py-16 text-center text-white md:px-16 md:py-20">
          <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Start building a scholarship pipeline that actually helps you decide.
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/sign-up" className="rounded-md bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100">
              Create free account
            </Link>
            <Link href="/sign-in" className="rounded-md border border-zinc-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200 bg-white px-5 py-10 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tighter text-zinc-950">SCHOLR.</span>
          </div>
          <p className="text-sm text-zinc-500">© {new Date().getFullYear()} Scholr Intelligence Platform.</p>
          <div className="flex gap-6 text-sm font-medium text-zinc-600">
            <a href="#features" className="hover:text-zinc-900">Features</a>
            <a href="#about" className="hover:text-zinc-900">About</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function HeroSignal({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xl font-bold text-zinc-900">{value}</p>
      <p className="mt-2 text-sm text-zinc-600">{label}</p>
    </div>
  );
}

function InfoPanel({ title, copy }: { title: string; copy: string }) {
  return (
    <div>
      <p className="font-bold text-zinc-900">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{copy}</p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
