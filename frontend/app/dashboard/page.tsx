"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { DashboardOverview } from "@/components/dashboard-overview";
import { AdminDashboard } from "@/components/admin-dashboard";
import { useAuthContext } from "@/lib/auth-context";
import { getMatches, getScholarships } from "@/lib/api";
import { getMissingRequiredProfileFields, isProfileReady } from "@/lib/profile";
import { Match, Scholarship } from "@/lib/types";
import { HiOutlineAcademicCap, HiOutlineSparkles, HiOutlineChevronRight } from "react-icons/hi2";

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
    // Only fetch scholarships for non-admin users
    if (user?.role !== "admin") {
      getScholarships()
        .then(setScholarships)
        .catch(() => setError("Unable to load scholarships."));
    }
  }, [user]);

  useEffect(() => {
    // Only fetch matches for non-admin users with profiles
    if (user?.role !== "admin" && user?.profile) {
      getMatches()
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

  const profileReady = isProfileReady(user.profile);
  const missingProfileFields = getMissingRequiredProfileFields(user.profile);
  const profileCardCopy = profileReady
    ? "Your profile is complete and your scholarship recommendations are personalized."
    : missingProfileFields.length === 0
      ? "Complete your profile to unlock more accurate scholarship ranking."
      : `Complete your profile by adding ${missingProfileFields
          .map((field) => field.replaceAll("_", " "))
          .join(", ")}.`;

  return (
    <AppShell
      user={user}
      onLogout={handleLogout}
      title="Dashboard"
      subtitle={user?.role === "admin" ? "Platform overview and operational controls" : "Review profile readiness, monitor scholarship fit, and keep your shortlist moving toward application."}
      compact
      lockViewport
    >
      <div className="flex h-full flex-col gap-4 lg:gap-5">
          {user?.role === "admin" ? (
            <AdminDashboard />
          ) : (
            <>
              <DashboardOverview user={user} scholarships={scholarships} matches={matches} />

              {error || authError ? <p className="text-sm font-medium text-red-700">{error || authError}</p> : null}

          <section id="profile" className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] flex-1">
            {/* Academic Profile Card */}
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-zinc-200/50 bg-white/40 p-12 text-center shadow-2xl backdrop-blur-3xl transition-all hover:border-zinc-300">
              <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-[28px] bg-zinc-950 text-white shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                <HiOutlineAcademicCap className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-950 tracking-tight">Strategy Profile</h3>
              <p className="mb-10 mt-5 text-[13px] leading-relaxed text-zinc-500 font-medium px-6">
                {profileCardCopy}
              </p>
              <Link 
                href="/profile" 
                className="group inline-flex items-center gap-2 rounded-2xl bg-zinc-950 px-10 py-4 text-[13px] font-black uppercase tracking-widest text-white transition-all hover:bg-zinc-800 hover:shadow-2xl active:scale-[0.98]"
              >
                {profileReady ? "Optimize Strategy" : "Initialize Parameters"}
                <HiOutlineChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Recommendations List */}
            <div className="rounded-[2.5rem] border border-zinc-200/50 bg-white/40 p-12 shadow-2xl backdrop-blur-3xl">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                   <div className="h-2 w-2 rounded-sm bg-zinc-950"></div>
                   <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Institutional Fit Analysis</p>
                </div>
                <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">Priority Tier</span>
              </div>
              
              <div className="space-y-5">
                {matches.slice(0, 3).map((match) => (
                  <div key={match.scholarship_id} className="group rounded-[2.5rem] border border-zinc-100 bg-white p-7 transition-all duration-500 hover:border-zinc-200 hover:shadow-xl">
                    <div className="flex items-start justify-between gap-8">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                           <HiOutlineSparkles className="h-3.5 w-3.5 text-blue-600" />
                           <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">{match.country}</p>
                        </div>
                        <p className="font-bold text-zinc-950 text-xl leading-tight truncate">{match.title}</p>
                      </div>
                      <div className="flex flex-col items-end pt-1">
                        <span className="text-[11px] font-black text-zinc-950 bg-zinc-50 border border-zinc-100 px-4 py-1.5 rounded-full shadow-sm">
                           {match.match_score}% Alignment
                        </span>
                      </div>
                    </div>
                    <p className="mt-5 text-[13px] leading-relaxed text-zinc-500 font-medium line-clamp-2">{match.summary}</p>
                  </div>
                ))}
                {matches.length === 0 ? (
                  <div className="rounded-[2.5rem] border border-zinc-200 border-dashed p-12 text-center bg-zinc-50/50">
                    <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em]">Institutional Discovery Pending</p>
                    <p className="mt-3 text-[13px] text-zinc-500 font-medium">Submit strategy parameters to reveal ranked opportunities.</p>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
            </>
          )}
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
