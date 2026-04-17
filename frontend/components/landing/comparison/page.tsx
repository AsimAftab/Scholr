import { HiOutlineCheck, HiOutlineXMark } from "react-icons/hi2";

const beforeItems = [
  "20+ hours of manual research",
  "Copy-pasting into Excel sheets",
  "Guessing eligibility from vague text",
  "Writing generic, unfocused SOPs",
];

const afterItems = [
  "2 minutes to see your matches",
  "Scholarships ranked by fit score",
  "Clear eligibility requirements decoded",
  "AI-generated, scholarship-specific SOPs",
];

export default function ComparisonSection() {
  return (
    <section className="overflow-hidden bg-white px-5 py-14 md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            Why Scholr
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl lg:text-[40px] lg:leading-[1.15]">
            Before Scholr vs. After Scholr
          </h2>
          <p className="mt-4 text-base text-zinc-600 md:text-lg leading-relaxed">
            What scholarship hunting looks like with and without Scholr.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="flex min-w-0 flex-col rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Before
            </p>
            <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-zinc-950">
              The manual grind
            </h3>
            <ul className="mt-6 space-y-3.5">
              {beforeItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <HiOutlineXMark className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm leading-relaxed text-zinc-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex min-w-0 flex-col rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              After
            </p>
            <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-zinc-950">
              Matched in minutes
            </h3>
            <ul className="mt-6 space-y-3.5">
              {afterItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                    <HiOutlineCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm leading-relaxed text-zinc-900">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
