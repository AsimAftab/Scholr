import React from "react";
import { HiOutlineSparkles, HiOutlineCursorArrowRays, HiOutlineUserCircle } from "react-icons/hi2";

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

export default function ProcessSection() {
  return (
    <section className="border-t border-zinc-200 bg-zinc-50 px-5 py-20 pb-32 md:px-10" id="process">
      <div className="mx-auto max-w-7xl">
        <div>
        <div className="max-w-4xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">How it works</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl lg:leading-[1.1]">
            Three simple steps to your scholarship
          </h2>
          <p className="mt-8 text-lg text-zinc-500 leading-relaxed max-w-2xl">
            We use AI to analyze thousands of scholarships and match them to your unique profile. Instead of spending hours searching, you get a personalized list of opportunities ranked by fit.
          </p>
        </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {processSteps.map((step) => (
            <div key={step.title} className="relative group">
              {/* Step Number */}
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-2xl font-black text-white shadow-lg ring-4 ring-zinc-50 mx-auto">
                {step.number}
              </div>

              {/* Content Card */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                {/* Icon */}
                <div className="mb-4 flex justify-center">
                  {step.icon === 'user' && <HiOutlineUserCircle className="h-10 w-10 text-blue-600" />}
                  {step.icon === 'target' && <HiOutlineCursorArrowRays className="h-10 w-10 text-green-600" />}
                  {step.icon === 'sparkles' && <HiOutlineSparkles className="h-10 w-10 text-purple-600" />}
                </div>

                <h3 className="text-center text-xl font-bold tracking-tight text-zinc-950">{step.title}</h3>
                <p className="mt-3 text-center text-zinc-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
