"use client";

import { useState } from "react";

import { generateSop } from "@/lib/api";
import { Match, Profile, Scholarship } from "@/lib/types";

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
  const matchLookup = new Map(matches.map((match) => [match.scholarship_id, match]));

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-zinc-900/8 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">{title}</p>
          <span className="text-sm text-zinc-500">{scholarships.length} scholarship(s)</span>
        </div>
      </div>

      {!adminView && !profile ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/80 p-6 text-sm text-zinc-600 shadow-sm">
          {emptyMessage}
        </div>
      ) : null}

      {scholarships.map((scholarship) => (
        <ScholarshipListCard
          key={scholarship.id}
          scholarship={scholarship}
          match={matchLookup.get(scholarship.id)}
          profile={profile}
          adminView={adminView}
        />
      ))}

      {scholarships.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/80 p-10 text-center text-zinc-500 shadow-sm">
          No scholarships available right now.
        </div>
      ) : null}
    </section>
  );
}

type ScholarshipListCardProps = {
  scholarship: Scholarship;
  match?: Match;
  profile: Profile | null;
  adminView: boolean;
};

function ScholarshipListCard({ scholarship, match, profile, adminView }: ScholarshipListCardProps) {
  const [sop, setSop] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <article className="rounded-2xl border border-zinc-900/8 bg-white/90 p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950">{scholarship.title}</h2>
          <p className="mt-2 text-sm text-zinc-500">
            {scholarship.country} • {scholarship.degree} • {scholarship.region ?? "Unspecified region"}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 text-sm text-zinc-500 md:items-end">
          {match && !adminView ? (
            <div className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">{match.match_score}% match</div>
          ) : null}
          <div className="space-y-1">
            {adminView ? <p>Source: {scholarship.source_name ?? scholarship.source_key ?? "Unknown"}</p> : null}
            <p>Funding: {scholarship.funding_type ?? "Unspecified"}</p>
            <p>Deadline: {scholarship.deadline ?? "Open / not listed"}</p>
          </div>
        </div>
      </div>

      {match && !adminView ? (
        <>
          <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Personalized Fit</p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">
                  Final {match.match_score}%
                </span>
                {match.rule_score != null ? (
                  <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
                    Rules {match.rule_score}%
                  </span>
                ) : null}
                {match.llm_score != null ? (
                  <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
                    LLM {match.llm_score}%
                  </span>
                ) : null}
                {match.llm_confidence != null ? (
                  <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
                    Confidence {match.llm_confidence}%
                  </span>
                ) : null}
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-700">{match.personalized_reasoning ?? match.summary}</p>
            {match.personalized_reasoning && match.summary !== match.personalized_reasoning ? (
              <p className="mt-3 text-sm leading-6 text-zinc-600">{match.summary}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {match.missing_requirements.length > 0 ? (
                match.missing_requirements.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
                  No critical gaps detected
                </span>
              )}
            </div>
          </div>
        </>
      ) : null}

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
            Documents: {scholarship.structured_eligibility.documents_required?.join(", ") || "Not specified"}
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <a
          href={scholarship.source_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-sm font-semibold text-zinc-900 underline decoration-zinc-300 underline-offset-4"
        >
          Open source page
        </a>

        {!adminView && profile && match ? (
          <button
            type="button"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                setSop(await generateSop(profile, match.scholarship_id));
              } finally {
                setLoading(false);
              }
            }}
            className="rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-900"
          >
            {loading ? "Generating..." : "Generate SOP draft"}
          </button>
        ) : null}
      </div>

      {sop ? (
        <div className="mt-5 rounded-2xl bg-zinc-950 p-4 text-sm leading-6 text-zinc-100">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">SOP Draft</p>
          <p>{sop}</p>
        </div>
      ) : null}
    </article>
  );
}
