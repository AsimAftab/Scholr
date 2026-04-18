"use client";

import Link from "next/link";
import {
  HiOutlineSparkles,
  HiOutlineAcademicCap,
  HiOutlineGlobeAlt,
  HiOutlineChevronRight,
  HiOutlineCheck,
  HiOutlineBriefcase,
} from "react-icons/hi2";

import { getMissingRequiredProfileFields, isProfileReady } from "@/lib/profile";
import { Match, Scholarship, User } from "@/lib/types";

type DashboardOverviewProps = {
  user: User;
  scholarships: Scholarship[];
  matches: Match[];
};

function formatDeadline(dateStr: string | null): string {
  if (!dateStr) return "Not published";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isDeadlinePast(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

function getNextDeadline(matches: Match[]): string {
  const now = new Date();
  const future = matches
    .filter((m) => m.deadline && new Date(m.deadline) >= now)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());
  if (future.length === 0) return "--";
  return formatDeadline(future[0].deadline);
}

function getTopCountries(matches: Match[]): string[] {
  const counts: Record<string, number> = {};
  for (const m of matches) {
    if (m.country) counts[m.country] = (counts[m.country] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([c]) => c);
}

function getProfileCompleteness(user: User): number {
  const total = 5;
  const missing = getMissingRequiredProfileFields(user.profile).length;
  return Math.round(((total - missing) / total) * 100);
}

export function DashboardOverview({ user, scholarships, matches }: DashboardOverviewProps) {
  const profileReady = isProfileReady(user.profile);
  const missingFields = getMissingRequiredProfileFields(user.profile);
  const bestScore = matches.length > 0 ? Math.max(...matches.map((m) => m.match_score)) : null;
  const fullyFundedCount = scholarships.filter((s) => s.is_fully_funded).length;
  const topCountries = getTopCountries(matches);
  const profilePct = getProfileCompleteness(user);

  return (
    <div className="space-y-6">
      {/* Welcome + Profile Banner */}
      <div>
        <h1 id="dashboard-welcome" className="text-2xl font-bold tracking-tight text-zinc-950">
          Welcome back, {user.full_name?.split(" ")[0] || "there"}
        </h1>
        {!profileReady && (
          <Link
            href="/profile"
            className="mt-3 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3.5 transition-colors hover:bg-amber-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-amber-600 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <span className="text-sm font-medium text-amber-800">
              Complete your profile to get matched — add{" "}
              {missingFields.map((f) => f.replaceAll("_", " ")).join(", ")}
            </span>
            <HiOutlineChevronRight className="ml-auto h-4 w-4 text-amber-400" />
          </Link>
        )}
      </div>

      {/* Stats Row */}
      <div id="dashboard-stats" className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
              <HiOutlineSparkles className="h-5 w-5 text-zinc-950" />
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Matches</span>
          </div>
          <p className="text-3xl font-bold text-zinc-950 tracking-tight">{matches.length}</p>
          <p className="mt-1 text-xs text-zinc-500 font-medium">Scholarship matches</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
              <HiOutlineAcademicCap className="h-5 w-5 text-zinc-950" />
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Best Match</span>
          </div>
          <p className="text-3xl font-bold text-zinc-950 tracking-tight">{bestScore !== null ? `${bestScore}%` : "--"}</p>
          <p className="mt-1 text-xs text-zinc-500 font-medium">Highest match score</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
              <HiOutlineBriefcase className="h-5 w-5 text-zinc-950" />
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Next Deadline</span>
          </div>
          <p className="text-3xl font-bold text-zinc-950 tracking-tight">{getNextDeadline(matches)}</p>
          <p className="mt-1 text-xs text-zinc-500 font-medium">Upcoming application</p>
        </div>
      </div>

      {/* Main Content: Recommendations + Insights */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Top Recommendations */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
            <h2 className="text-sm font-bold text-zinc-900">Top Recommendations</h2>
            {matches.length > 5 && (
              <Link href="/scholarships" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
                View all
              </Link>
            )}
          </div>

          {matches.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <HiOutlineAcademicCap className="mx-auto h-10 w-10 text-zinc-300" />
              <p className="mt-4 text-sm font-semibold text-zinc-500">No matches yet</p>
              <p className="mt-1 text-xs text-zinc-400">
                {profileReady ? "We're working on finding scholarships for you." : "Complete your profile to get personalized matches."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {matches.slice(0, 5).map((match) => (
                <div key={match.scholarship_id} className="px-6 py-5 hover:bg-zinc-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-zinc-900 text-[15px] leading-snug truncate">{match.title}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
                          <HiOutlineGlobeAlt className="h-3 w-3" />
                          {match.country}
                        </span>
                        {match.deadline && (
                          <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                            isDeadlinePast(match.deadline)
                              ? "bg-red-50 text-red-600"
                              : "bg-zinc-100 text-zinc-600"
                          }`}>
                            {isDeadlinePast(match.deadline) ? "Expired" : formatDeadline(match.deadline)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-sm font-bold text-zinc-900">{match.match_score}%</span>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mt-3 flex h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        match.match_score >= 70 ? "bg-emerald-500" : match.match_score >= 40 ? "bg-amber-500" : "bg-red-400"
                      }`}
                      style={{ width: `${match.match_score}%` }}
                    />
                  </div>

                  {/* Summary */}
                  <p className="mt-3 text-xs text-zinc-500 font-medium leading-relaxed line-clamp-2">{match.summary}</p>

                  {/* Missing requirements */}
                  {match.missing_requirements.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {match.missing_requirements.slice(0, 2).map((req, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                          {req}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {matches.length > 0 && (
            <div className="border-t border-zinc-100 px-6 py-4">
              <Link
                href="/scholarships"
                className="flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                View all scholarships
                <HiOutlineChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Quick Insights Sidebar */}
        <div className="space-y-4">
          {/* Profile Completeness */}
          <div id="dashboard-profile-card" className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-4">Profile</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-zinc-900">{profilePct}% Complete</span>
              {profileReady && <HiOutlineCheck className="h-4 w-4 text-emerald-500" />}
            </div>
            <div className="flex h-2 rounded-full bg-zinc-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${profilePct === 100 ? "bg-emerald-500" : "bg-zinc-950"}`}
                style={{ width: `${profilePct}%` }}
              />
            </div>
            {!profileReady && (
              <Link href="/profile" className="mt-3 block text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
                Complete profile &rarr;
              </Link>
            )}
          </div>

          {/* Funding Breakdown */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-4">Funding</h3>
            <div className="flex items-center gap-3">
              <HiOutlineBriefcase className="h-5 w-5 text-zinc-400" />
              <div>
                <p className="text-sm font-semibold text-zinc-900">{fullyFundedCount} fully funded</p>
                <p className="text-xs text-zinc-500">out of {scholarships.length} scholarships</p>
              </div>
            </div>
          </div>

          {/* Top Countries */}
          {topCountries.length > 0 && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-4">Top Countries</h3>
              <div className="space-y-2.5">
                {topCountries.map((country) => (
                  <div key={country} className="flex items-center gap-2.5">
                    <HiOutlineGlobeAlt className="h-4 w-4 text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-700">{country}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
