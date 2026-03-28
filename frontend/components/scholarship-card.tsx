"use client";

import { useState } from "react";

import { generateSop } from "@/lib/api";
import { Match, Profile } from "@/lib/types";

type ScholarshipCardProps = {
  match: Match;
  profile: Profile;
};

export function ScholarshipCard({ match, profile }: ScholarshipCardProps) {
  const [sop, setSop] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const deadlineLabel = match.deadline ? new Date(match.deadline).toLocaleDateString() : "Not published";

  return (
    <article className="rounded-xl border border-zinc-900/8 bg-white/90 p-6 shadow-md backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">{match.country}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">{match.title}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{match.summary}</p>
        </div>
        <div className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm">
          {match.match_score}%
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {match.missing_requirements.length > 0 ? (
          match.missing_requirements.map((item) => (
            <span key={item} className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
              {item}
            </span>
          ))
        ) : (
          <span className="rounded-full border border-zinc-500 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
            No critical gaps detected
          </span>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">Deadline: {deadlineLabel}</p>
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
          className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:border-zinc-900 hover:bg-zinc-900 hover:text-white disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate SOP draft"}
        </button>
      </div>

      {sop ? (
        <div className="mt-5 rounded-2xl bg-zinc-950 p-4 text-sm leading-6 text-slate-100">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">SOP Draft</p>
          <p>{sop}</p>
        </div>
      ) : null}
    </article>
  );
}
