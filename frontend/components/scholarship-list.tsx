"use client";

import { Match, Profile, Scholarship } from "@/lib/types";
import { ScholarshipCard } from "@/components/scholarship-card";

type ScholarshipListProps = {
  scholarships: Scholarship[];
  matches: Match[];
  profile: Profile | null;
  title: string;
  emptyMessage: string;
};

export function ScholarshipList({ scholarships, matches, profile, title, emptyMessage }: ScholarshipListProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
      <div className="rounded-xl border border-zinc-900/8 bg-white/90 p-6 shadow-md backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">{title}</p>
        <div className="mt-5 space-y-4">
          {scholarships.map((scholarship) => (
            <div key={scholarship.id} className="rounded-2xl border border-zinc-900/8 bg-zinc-50 p-4">
              <p className="font-semibold text-zinc-900">{scholarship.title}</p>
              <p className="mt-1 text-sm text-zinc-500">
                {scholarship.country} • {scholarship.degree}
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                GPA {scholarship.structured_eligibility.gpa_required ?? "N/A"} • IELTS{" "}
                {scholarship.structured_eligibility.ielts_required ?? "N/A"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {profile && matches.length > 0 ? (
          matches.map((match) => <ScholarshipCard key={match.scholarship_id} match={match} profile={profile} />)
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}
