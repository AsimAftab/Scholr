"use client";

import { Match, Profile, Scholarship } from "@/lib/types";
import { ScholarshipCard } from "@/components/scholarship-card";

type ScholarshipListProps = {
  scholarships: Scholarship[];
  matches: Match[];
  profile: Profile | null;
  title: string;
  emptyMessage: string;
  adminView?: boolean;
};

export function ScholarshipList({
  scholarships,
  matches,
  profile,
  title,
  emptyMessage,
  adminView = false,
}: ScholarshipListProps) {
  if (adminView) {
    return (
      <section className="space-y-4">
        <div className="rounded-xl border border-zinc-900/8 bg-white/90 p-6 shadow-md backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">{title}</p>
            <span className="text-sm text-zinc-500">{scholarships.length} scholarship(s)</span>
          </div>
        </div>

        {scholarships.map((scholarship) => (
          <article
            key={scholarship.id}
            className="rounded-xl border border-zinc-900/8 bg-white/90 p-6 shadow-md backdrop-blur-xl"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950">{scholarship.title}</h2>
                <p className="mt-2 text-sm text-zinc-500">
                  {scholarship.country} • {scholarship.degree} • {scholarship.region ?? "Unspecified region"}
                </p>
              </div>
              <div className="text-sm text-zinc-500">
                <p>Source: {scholarship.source_name ?? scholarship.source_key ?? "Unknown"}</p>
                <p>Funding: {scholarship.funding_type ?? "Unspecified"}</p>
                <p>Deadline: {scholarship.deadline ?? "Open / not listed"}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Eligibility</p>
                <p className="mt-3 text-sm leading-6 text-zinc-700">{scholarship.eligibility_text}</p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Requirements</p>
                <p className="mt-3 text-sm text-zinc-700">
                  GPA {scholarship.structured_eligibility.gpa_required ?? "N/A"} • IELTS{" "}
                  {scholarship.structured_eligibility.ielts_required ?? "N/A"}
                </p>
                <p className="mt-2 text-sm text-zinc-700">
                  Documents:{" "}
                  {scholarship.structured_eligibility.documents_required?.join(", ") || "Not specified"}
                </p>
                <p className="mt-2 text-sm text-zinc-700">
                  Degree levels: {scholarship.structured_eligibility.degree_levels?.join(", ") || scholarship.degree}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Coverage</p>
                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  {scholarship.coverage_summary ?? "No coverage summary available."}
                </p>
                <p className="mt-2 text-sm text-zinc-700">
                  Fully funded: {scholarship.is_fully_funded == null ? "Unknown" : scholarship.is_fully_funded ? "Yes" : "No"}
                </p>
                <p className="mt-2 text-sm text-zinc-700">
                  Eligible countries: {scholarship.eligible_countries.join(", ") || "Not restricted / not specified"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {scholarship.field_of_study.map((field) => (
                <span
                  key={field}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700"
                >
                  {field}
                </span>
              ))}
            </div>

            <a
              href={scholarship.source_url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex text-sm font-semibold text-zinc-900 underline decoration-zinc-300 underline-offset-4"
            >
              Open source page
            </a>
          </article>
        ))}
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-zinc-900/8 bg-white/90 p-6 shadow-md backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">{title}</p>
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
