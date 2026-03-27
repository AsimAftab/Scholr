"use client";

import Link from "next/link";

import { Match, Scholarship, User } from "@/lib/types";

type DashboardOverviewProps = {
  user: User;
  scholarships: Scholarship[];
  matches: Match[];
};

export function DashboardOverview({ user, scholarships, matches }: DashboardOverviewProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-2xl border border-zinc-900/8 bg-zinc-900 px-8 py-10 text-white shadow-md">
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-zinc-500">Dashboard</p>
        <h1 className="mt-4 max-w-2xl text-5xl font-extrabold leading-tight">
          {user.profile ? `Welcome back, ${user.full_name}.` : `Build your profile, ${user.full_name}.`}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
          Review scholarship fit, missing requirements, and AI-guided application support from one operating panel.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard value={String(matches.length)} label="Ranked matches" />
          <StatCard value={`${matches[0]?.match_score ?? "--"}%`} label="Top fit score" />
          <StatCard value={String(scholarships.length)} label="Scholarships indexed" />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-900/8 bg-white/90 p-6 shadow-md backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Application pulse</p>
        <div className="mt-6 space-y-4">
          <PulseRow title="Profile readiness" value={user.profile ? "Ready" : "Incomplete"} />
          <PulseRow title="Best-fit destination" value={matches[0]?.country ?? "Waiting for profile"} />
          <PulseRow title="Next deadline" value={matches[0]?.deadline ?? "No shortlist yet"} />
        </div>
        <Link
          href={user.profile ? "/scholarships" : "#profile"}
          className="mt-8 inline-flex rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          {user.profile ? "Browse scholarships" : "Complete your profile"}
        </Link>
      </div>
    </section>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-slate-300">{label}</p>
    </div>
  );
}

function PulseRow({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-900/8 bg-zinc-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">{title}</p>
      <p className="mt-2 text-lg font-semibold text-zinc-900">{value}</p>
    </div>
  );
}
