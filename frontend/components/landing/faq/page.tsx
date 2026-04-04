"use client";

import React, { useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi2";

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-zinc-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left transition-colors hover:bg-zinc-50 px-4 -mx-4 rounded-lg"
      >
        <span className="text-lg font-semibold text-zinc-900 pr-8">{question}</span>
        <HiOutlineChevronDown
          className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'
          }`}
      >
        <p className="text-zinc-600 leading-relaxed px-4">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const faqs = [
    {
      question: "How accurate are the match scores?",
      answer: "Our AI analyzes both explicit requirements (GPA, degree level) and implicit eligibility clues from scholarship descriptions. Current accuracy is 94% based on user feedback. We show you exactly why you matched or didn't match so you can make informed decisions."
    },
    {
      question: "Do I still need to write my own essays?",
      answer: "The AI-generated SOPs and LORs are tailored to your profile and the specific scholarship, but we recommend reviewing and personalizing them. Think of it as a strong first draft that captures the key points scholarship committees look for."
    },
    {
      question: "How often is the scholarship database updated?",
      answer: "We sync with official university and government sources daily. Deadlines, funding amounts, and new opportunities are updated in real-time. You'll see a 'last updated' timestamp on each scholarship."
    },
    {
      question: "Is this free to use?",
      answer: "Yes! Creating a profile, getting matched, and browsing scholarships is completely free. We're committed to making education accessible to every student."
    },
    {
      question: "Which countries do you cover?",
      answer: "We currently support scholarships in 50+ countries including USA, UK, Canada, Germany, Australia, Netherlands, Sweden, and many more. Our database is constantly expanding."
    },
    {
      question: "What degree levels are supported?",
      answer: "Undergraduate, Masters, PhD, and postdoctoral opportunities. We also have specialized filters for research grants and fellowships."
    }
  ];

  return (
    <section className="border-t border-zinc-200 bg-white pt-24 pb-48 px-5 md:px-10" id="faq">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-12 lg:gap-20">
          {/* Header Content */}
          <div className="lg:col-span-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Frequently Asked Questions</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl lg:leading-[1.1]">
              Common questions about Scholr
            </h2>
            <p className="mt-8 text-lg text-zinc-500 leading-relaxed">
              Everything you need to know about getting started with scholarship matching and application prep.
            </p>

            <div className="mt-12 hidden lg:block">
              <p className="text-sm font-semibold text-zinc-950">Still have questions?</p>
              <p className="mt-1 text-sm text-zinc-500">We respond to every inquiry within 24 hours.</p>
              <a
                href="mailto:support@scholr.com"
                className="mt-4 inline-flex items-center text-sm font-bold text-zinc-900 underline underline-offset-4 hover:text-blue-600 transition-colors"
              >
                Contact our support team
              </a>
            </div>
          </div>

          {/* Accordion Content */}
          <div className="mt-12 lg:col-span-7 lg:mt-0">
            <div className="divide-y divide-zinc-200 rounded-3xl border border-zinc-200 bg-zinc-50/30 px-6 shadow-sm md:px-8">
              {faqs.map((faq) => (
                <FAQItem key={faq.question} {...faq} />
              ))}
            </div>

            {/* Mobile Contact CTA */}
            <div className="mt-10 text-center lg:hidden">
              <p className="text-zinc-600">Still have questions?</p>
              <a
                href="mailto:support@scholr.com"
                className="mt-2 inline-flex items-center text-sm font-semibold text-zinc-900 underline underline-offset-4"
              >
                Contact our support team
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
