"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { DashboardOverview } from "@/components/dashboard-overview";
import { ScholarshipList } from "@/components/scholarship-list";
import { useAuthContext } from "@/lib/auth-context";
import { getMatches, getScholarships } from "@/lib/api";
import { Match, Scholarship } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, error: authError, handleLogout } = useAuthContext();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/sign-in");
    }
  }, [loading, user, router]);

  useEffect(() => {
    getScholarships()
      .then(setScholarships)
      .catch(() => setError("Unable to load scholarships."));
  }, []);

  useEffect(() => {
    if (user?.profile) {
      getMatches(user.profile)
        .then((response) => setMatches(response.matches))
        .catch(() => setError("Unable to load scholarship matches."));
    } else {
      setMatches([]);
    }
  }, [user]);

  if (loading) {
    return <PageState message="Loading your dashboard..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <AppShell
      user={user}
      onLogout={handleLogout}
      title="Dashboard"
      subtitle="Review profile readiness, monitor scholarship fit, and keep your shortlist moving toward application."
    >
      <div className="space-y-8">
          <DashboardOverview user={user} scholarships={scholarships} matches={matches} />

          {error || authError ? <p className="text-sm font-medium text-red-700">{error || authError}</p> : null}

          <section id="profile" className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-xl border border-slate-900/6 bg-white/88 p-6 shadow-md backdrop-blur-xl flex flex-col justify-center items-center text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
                <svg className="h-6 w-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Your Academic Profile</h3>
              <p className="mt-2 text-sm text-zinc-600 mb-6">
                Update your GPA, IELTS score, and study destinations to receive highly accurate match scores.
              </p>
              <Link href="/profile" className="inline-flex rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800">
                {user.profile ? "Edit Profile" : "Build Profile"}
              </Link>
            </div>

            <div className="rounded-xl border border-slate-900/6 bg-white/88 p-6 shadow-md backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500/70">Top recommendations</p>
              <div className="mt-5 space-y-4">
                {matches.slice(0, 3).map((match) => (
                  <div key={match.scholarship_id} className="rounded-2xl border border-slate-900/5 bg-[#fbfaf7] p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-zinc-950">{match.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{match.country}</p>
                      </div>
                      <div className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white">
                        {match.match_score}%
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{match.summary}</p>
                  </div>
                ))}
                {matches.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                    Save your profile to generate ranked scholarship matches.
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <ScholarshipList
            scholarships={scholarships}
            matches={matches}
            profile={user.profile}
            title="Scholarship Index"
            emptyMessage="Complete your profile to unlock ranked scholarships and AI-generated drafts."
          />
      </div>
    </AppShell>
  );
}

function PageState({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="rounded-xl border border-slate-900/6 bg-white/88 px-8 py-6 text-center text-slate-600 shadow-md backdrop-blur-xl">
        {message}
      </div>
    </main>
  );
}
