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
      answer: "We focus on high-fidelity matching based on your explicit transcript data and stated goals. While we've just launched, our internal testing shows strong precision in identifying scholarships where you meet the mandatory criteria, ensuring you don't waste time on dead-end applications."
    },
    {
      question: "Do I still need to write my own essays?",
      answer: "Scholr provides a sophisticated AI-driven drafting engine that creates high-quality first drafts of SOPs and Letters of Recommendation tailored to your unique profile. We strongly encourage you to review and inject your personal voice into these drafts to ensure they resonate authentically with selection committees."
    },
    {
      question: "How often is the scholarship database updated?",
      answer: "We are currently in a high-growth phase and sync our database with major university and global scholarship foundations daily. Our team manually verifies high-value opportunities to ensure that requirements and deadlines are highly accurate before they reach your dashboard."
    },
    {
      question: "Is Scholr free to use?",
      answer: "Yes. Our core mission is to make quality education accessible. All essential features—including profile building, scholarship matching, and AI drafting—are currently free for students as we continue to build and refine our platform."
    },
    {
      question: "Which countries do you currently cover?",
      answer: "Our initial focus is on major international education hubs including the USA, UK, Canada, and Australia. We are rapidly expanding our crawler to include scholarships in Europe and Asia. If you have a specific destination in mind, our system will prioritize finding those matches for you."
    },
    {
      question: "What degree levels are supported?",
      answer: "We currently support Undergraduate and Masters level scholarships. PhD and Postdoctoral opportunities are being integrated into our database and will be available soon."
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
