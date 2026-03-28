import Link from "next/link";

const featureCards = [
  {
    eyebrow: "Scholarship data",
    title: "Scrape and normalize fragmented scholarship pages.",
    copy: "Collect deadlines, eligibility text, destination country, and core application signals from scattered sources.",
  },
  {
    eyebrow: "AI structuring",
    title: "Convert unstructured criteria into decision-ready requirements.",
    copy: "Turn messy text into GPA, IELTS, document, and degree constraints your matching layer can actually use.",
  },
  {
    eyebrow: "Application support",
    title: "Move from shortlist to submission with AI-assisted drafting.",
    copy: "Generate SOP starters, requirement summaries, and scholarship-level guidance without losing context.",
  },
];

const processSteps = [
  "Import and structure scholarship opportunities.",
  "Create a student profile once.",
  "Rank scholarships by fit and missing requirements.",
  "Generate application guidance and drafts.",
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
      <section className="px-5 pb-20 pt-24 text-center md:px-10 md:pb-24 md:pt-32">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">
            <span className="mr-2 flex h-2 w-2 rounded-full bg-zinc-900"></span>
            Your personal scholarship engine.
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-zinc-950 md:text-7xl lg:text-[5rem] lg:leading-[1.1]">
            Discover scholarships with structure.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 md:text-xl">
            Turn raw opportunity data into structured eligibility, ranked fit, and action-ready application guidance. No more spreadsheet chaos.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/sign-up"
              className="rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800"
            >
              Create workspace
            </Link>
            <a
              href="#features"
              className="rounded-md border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-900 shadow-sm transition-all hover:bg-zinc-50"
            >
              Explore features
            </a>
          </div>
        </div>
      </section>

      {/* Value Prop Bento */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-8 md:p-12">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 md:text-3xl">
                Built for students who need clarity before they apply.
              </h2>
              <p className="mt-4 text-lg text-zinc-600">
                Instead of manually comparing pages, copy-pasting requirements, and guessing eligibility, Scholr turns scholarship research into a guided pipeline.
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <HeroSignal value="Match score" label="Prioritized by profile" />
              <HeroSignal value="JSON Rules" label="Extracted from text" />
              <HeroSignal value="AI Drafts" label="Generated in context" />
            </div>
          </div>
          
          <div className="flex flex-col justify-center rounded-2xl border border-zinc-200 bg-zinc-950 p-8 text-white md:p-12">
            <h3 className="text-xl font-bold tracking-tight">What changes</h3>
            <ul className="mt-6 space-y-6 text-zinc-300">
              <li className="flex gap-3">
                <CheckIcon />
                <span>Stop evaluating opportunities from raw, inconsistent page copy.</span>
              </li>
              <li className="flex gap-3">
                <CheckIcon />
                <span>Understand fit before investing time in documents and essays.</span>
              </li>
              <li className="flex gap-3">
                <CheckIcon />
                <span>Generate application support in the context of a real scholarship.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200 bg-zinc-50 px-5 py-20 md:px-10" id="features">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Features</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">
              A sharper workflow from discovery to application prep.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {featureCards.map((card) => (
              <article
                key={card.title}
                className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                  <span className="text-lg font-bold text-zinc-900">{card.eyebrow[0]}</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-zinc-950">{card.title}</h3>
                <p className="mt-3 text-zinc-600 leading-relaxed">{card.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About & Process */}
      <section className="px-5 py-20 md:px-10" id="about">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
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

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 md:p-12" id="process">
            <h3 className="text-2xl font-bold tracking-tight text-zinc-950">A tighter pipeline</h3>
            <p className="mt-2 text-zinc-600">Start to finish scholarship management.</p>
            <div className="mt-8 space-y-4">
              {processSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="font-medium text-zinc-900">{step}</p>
                </div>
              ))}
            </div>
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
