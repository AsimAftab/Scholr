import { HiOutlineMagnifyingGlass, HiOutlineSparkles, HiOutlineCpuChip } from "react-icons/hi2";

const featureCards = [
  {
    eyebrow: "Smart Discovery",
    title: "Access Global Scholarships in One Place",
    copy: "Browse a curated and growing database of opportunities from the USA, UK, Canada, Australia, and more.",
    icon: "search",
    color: "blue"
  },
  {
    eyebrow: "AI-Powered Matching",
    title: "See Exactly What You Qualify For",
    copy: "Get a 0-100% match score based on your GPA, IELTS, and degree level. Know your fit before you apply.",
    icon: "ai",
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

export default function FeaturesSection() {
  return (
    <section className="border-t border-zinc-200 bg-zinc-50 px-5 py-20 md:px-10" id="features">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Features</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl lg:text-6xl lg:leading-[1.1]">
              A sharper workflow from discovery to application prep.
            </h2>
            <p className="mt-8 text-lg text-zinc-500 leading-relaxed max-w-2xl">
              Stop researching manually. Let AI do the heavy lifting from matching to final submission.
            </p>
          </div>

          <div className="hidden lg:flex flex-col gap-4 pb-2">
            {/* Featured Institutions */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Featured Institutions</p>
              <div className="mt-4 flex gap-4 opacity-70 grayscale transition-all hover:grayscale-0">
                <span className="text-[10px] font-black text-zinc-900 underline decoration-blue-500 decoration-2 underline-offset-4">OXFORD</span>
                <span className="text-[10px] font-black text-zinc-900 underline decoration-red-500 decoration-2 underline-offset-4">HARVARD</span>
                <span className="text-[10px] font-black text-zinc-900 underline decoration-green-500 decoration-2 underline-offset-4">MCGILL</span>
              </div>
            </div>

            {/* Accuracy Gauge */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative flex h-14 w-14 items-center justify-center">
                  <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-zinc-100" strokeWidth="3" />
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-blue-500" strokeWidth="3" strokeDasharray="100" strokeDashoffset="20" strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-[10px] font-black text-zinc-900">v1.2</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-950 uppercase tracking-tight">Match Accuracy</p>
                  <p className="text-xs text-zinc-500 font-medium">Model v4.2 Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {featureCards.map((card) => (
            <article
              key={card.title}
              className="group flex flex-col rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex-1">
                {/* Icon */}
                <div className={`mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${card.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' :
                  card.color === 'purple' ? 'bg-purple-100 group-hover:bg-purple-200' :
                    'bg-green-100 group-hover:bg-green-200'
                  } transition-colors`}>
                  {card.icon === 'search' && <HiOutlineMagnifyingGlass className="h-7 w-7" />}
                  {card.icon === 'ai' && <HiOutlineCpuChip className="h-7 w-7 text-purple-600" />}
                  {card.icon === 'sparkles' && <HiOutlineSparkles className="h-7 w-7" />}
                </div>

                {/* Eyebrow */}
                <p className={`text-[11px] font-bold uppercase tracking-[0.15em] ${card.color === 'blue' ? 'text-blue-600' :
                  card.color === 'purple' ? 'text-purple-600' :
                    'text-green-600'
                  }`}>
                  {card.eyebrow}
                </p>

                {/* Title */}
                <h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-zinc-950 min-h-[64px]">
                  {card.title}
                </h3>

                {/* Copy */}
                <p className="mt-4 text-zinc-500 leading-relaxed text-[15px]">
                  {card.copy}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
