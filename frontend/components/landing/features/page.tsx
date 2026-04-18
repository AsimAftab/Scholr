import { HiOutlineMagnifyingGlass, HiOutlineSparkles, HiOutlineCpuChip } from "react-icons/hi2";

type FeatureCard = {
  eyebrow: string;
  title: string;
  copy: string;
  icon: React.ComponentType<{ className?: string }>;
  footer: React.ReactNode;
};

const featureCards: FeatureCard[] = [
  {
    eyebrow: "Smart discovery",
    title: "Access global scholarships in one place",
    copy: "Browse a curated and growing database of opportunities from the USA, UK, Canada, Australia, and more.",
    icon: HiOutlineMagnifyingGlass,
    footer: (
      <>
        <Chip>USA</Chip>
        <Chip>UK</Chip>
        <Chip>Canada</Chip>
        <Chip muted>+12 more</Chip>
      </>
    ),
  },
  {
    eyebrow: "AI-powered matching",
    title: "See exactly what you qualify for",
    copy: "Get a 0–100% match score based on your GPA, IELTS, and degree level. Know your fit before you apply.",
    icon: HiOutlineCpuChip,
    footer: (
      <>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 px-2.5 py-1 text-[11px] font-semibold text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          92% match
        </span>
        <Chip muted>Fit breakdown</Chip>
      </>
    ),
  },
  {
    eyebrow: "Application assistant",
    title: "Generate winning applications in minutes",
    copy: "Create scholarship-specific SOPs and LORs tailored to your profile. Stop writing generic essays.",
    icon: HiOutlineSparkles,
    footer: (
      <>
        <Chip>SOP</Chip>
        <Chip>LOR</Chip>
        <Chip>Summary</Chip>
      </>
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section className="overflow-hidden border-t border-zinc-200 bg-zinc-50 px-5 py-14 md:px-10 md:py-16" id="features">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            Features
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl lg:text-[40px] lg:leading-[1.15]">
            Find scholarships. See your fit. Apply faster.
          </h2>
          <p className="mt-4 text-base text-zinc-600 md:text-lg leading-relaxed">
            From discovering what fits to drafting your SOP — in one place. No spreadsheets. No guesswork.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="flex min-w-0 flex-col rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm transition hover:border-zinc-300 hover:shadow-md"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  {card.eyebrow}
                </p>
                <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-zinc-950">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {card.copy}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-zinc-200 pt-6">
                  {card.footer}
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}

function Chip({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span
      className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${
        muted
          ? "border-zinc-200 bg-transparent text-zinc-500"
          : "border-zinc-200 bg-zinc-50 text-zinc-700"
      }`}
    >
      {children}
    </span>
  );
}
