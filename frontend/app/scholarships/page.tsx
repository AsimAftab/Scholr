"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { ScholarshipList } from "@/components/scholarship-list";
import { useAuthContext } from "@/lib/auth-context";
import { getMatches, getScholarships } from "@/lib/api";
import { Match, Scholarship } from "@/lib/types";
import { COUNTRIES } from "@/lib/countries";

export default function ScholarshipsPage() {
  const router = useRouter();
  const { user, loading, handleLogout } = useAuthContext();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [countryFilter, setCountryFilter] = useState("");
  const [error, setError] = useState("");
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [personalizing, setPersonalizing] = useState(false);

  const isAdminView = user?.role === "admin";
  const matchOrder = new Map(matches.map((match, index) => [match.scholarship_id, index]));
  const rankedScholarships = isAdminView
    ? scholarships
    : scholarships
        .filter((scholarship) => matchOrder.has(scholarship.id))
        .sort((left, right) => (matchOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) - (matchOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER));
  const filteredScholarships = countryFilter
    ? rankedScholarships.filter((scholarship) => scholarship.country.toLowerCase() === countryFilter.toLowerCase())
    : rankedScholarships;

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/sign-in");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.role === "admin") {
      getScholarships()
        .then(setScholarships)
        .catch(() => setError("Unable to load scholarships."));
      return;
    }

    if (!user.profile) {
      setScholarships([]);
      setMatches([]);
      return;
    }

    setLoadingMatches(true);
    setError("");
    Promise.all([getScholarships(), getMatches(user.profile)])
      .then(([nextScholarships, response]) => {
        setScholarships(nextScholarships);
        setMatches(response.matches);
      })
      .catch(() => setError("Unable to load scholarship matches."))
      .finally(() => setLoadingMatches(false));
  }, [user]);

  if (loading || (!isAdminView && !!user?.profile && loadingMatches)) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="text-zinc-600">{isAdminView ? "Loading scholarships..." : "Ranking scholarships for you..."}</div>
      </main>
    );
  }

  async function handlePersonalize() {
    if (!user?.profile || isAdminView || personalizing) {
      return;
    }

    setPersonalizing(true);
    setError("");
    try {
      const [nextScholarships, response] = await Promise.all([
        getScholarships(),
        getMatches(user.profile, true),
      ]);
      setScholarships(nextScholarships);
      setMatches(response.matches);
    } catch {
      setError("Unable to personalize scholarships right now.");
    } finally {
      setPersonalizing(false);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <AppShell
      user={user}
      onLogout={handleLogout}
      title={isAdminView ? "Scholarship Catalog" : "Scholarships"}
      subtitle={
        isAdminView
          ? "Inspect the full scholarship dataset indexed in the system, including eligibility, funding, and source details."
          : "Browse your ranked scholarship matches, compare fit scores, and inspect missing requirements before you apply."
      }
    >
      <div className="space-y-8">
        {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}

        <div className="rounded-2xl border border-zinc-900/8 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Filter Scholarships</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-zinc-500">
                {filteredScholarships.length} of {rankedScholarships.length} scholarships
              </span>
              {!isAdminView && user.profile ? (
                <button
                  type="button"
                  disabled={personalizing}
                  onClick={() => void handlePersonalize()}
                  className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:border-zinc-900 disabled:opacity-60"
                >
                  {personalizing ? "Personalizing..." : "Personalize"}
                </button>
              ) : null}
            </div>
          </div>
          <div className="mt-4">
            <input
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900"
              type="text"
              list="scholarship-country-options"
              value={countryFilter}
              onChange={(event) => setCountryFilter(event.target.value)}
              placeholder="Filter by country (e.g., Australia, United States, United Kingdom)"
              autoComplete="off"
            />
            <datalist id="scholarship-country-options">
              {COUNTRIES.map((country) => (
                <option key={country} value={country} />
              ))}
            </datalist>
          </div>
        </div>

        <ScholarshipList
          scholarships={filteredScholarships}
          matches={matches}
          profile={user.profile}
          title={isAdminView ? "All Indexed Scholarships" : "Ranked Scholarships"}
          emptyMessage="Finish your profile in the dashboard to unlock personalized scholarship rankings."
          adminView={isAdminView}
        />
      </div>
    </AppShell>
  );
}
