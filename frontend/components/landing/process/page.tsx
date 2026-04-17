const processSteps = [
  {
    number: "01",
    title: "Create your profile",
    description: "Enter your GPA, degree level, target country, and IELTS score. One time only.",
  },
  {
    number: "02",
    title: "Get your matches",
    description: "See scholarships ranked 0–100% by fit, with eligibility requirements decoded for you.",
  },
  {
    number: "03",
    title: "Apply smarter",
    description: "Generate scholarship-specific SOPs and LORs tailored to your profile in minutes.",
  },
];

export default function ProcessSection() {
  return (
    <section className="overflow-hidden border-t border-zinc-200 bg-zinc-50 px-5 py-14 md:px-10 md:py-16" id="process">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            How it works
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl lg:text-[40px] lg:leading-[1.15]">
            Three steps from signup to matched.
          </h2>
          <p className="mt-4 text-base text-zinc-600 md:text-lg leading-relaxed">
            Set up your profile once. Get ranked matches instantly. Apply with AI-drafted essays.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {processSteps.map((step) => (
            <article
              key={step.title}
              className="flex min-w-0 flex-col rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm transition hover:border-zinc-300 hover:shadow-md"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-sm font-semibold text-white">
                {step.number}
              </span>
              <h3 className="mt-6 text-lg font-semibold tracking-tight text-zinc-950">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
