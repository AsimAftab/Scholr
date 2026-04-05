"use client";

import { useEffect, useMemo, useState } from "react";
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
  const matchOrder = useMemo(
    () => new Map(matches.map((match, index) => [match.scholarship_id, index])),
    [matches]
  );

  const rankedScholarships = useMemo(
    () =>
      isAdminView
        ? scholarships
        : [...scholarships]
            .filter((s) => matchOrder.has(s.id))
            .sort(
              (a, b) =>
                (matchOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
                (matchOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER)
            ),
    [isAdminView, scholarships, matchOrder]
  );

  const filteredScholarships = useMemo(
    () =>
      countryFilter
        ? rankedScholarships.filter(
            (s) => s.country.toLowerCase() === countryFilter.toLowerCase()
          )
        : rankedScholarships,
    [countryFilter, rankedScholarships]
  );

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/sign-in");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setError("");

    if (user.role === "admin") {
      setMatches([]);
      setLoadingMatches(true);
      getScholarships()
        .then(setScholarships)
        .catch((loadError) => {
          setScholarships([]);
          setError(loadError instanceof Error ? loadError.message : "Unable to load scholarships.");
        })
        .finally(() => setLoadingMatches(false));
      return;
    }

    if (!user.profile) {
      setScholarships([]);
      setMatches([]);
      setError("");
      return;
    }

    setLoadingMatches(true);
    Promise.all([getScholarships(), getMatches()])
      .then(([nextScholarships, response]) => {
        setScholarships(nextScholarships);
        setMatches(response.matches);
      })
      .catch((loadError) => {
        setScholarships([]);
        setMatches([]);
        setError(loadError instanceof Error ? loadError.message : "Unable to load scholarship matches.");
      })
      .finally(() => setLoadingMatches(false));
  }, [user]);

  if (loading || (!isAdminView && !!user?.profile && loadingMatches)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-5">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
          <div className="text-sm font-medium text-zinc-600">
            {isAdminView ? "Loading scholarships..." : "Ranking scholarships for you..."}
          </div>
        </div>
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
        getMatches(true),
      ]);
      setScholarships(nextScholarships);
      setMatches(response.matches);
    } catch (personalizeError) {
      setError(personalizeError instanceof Error ? personalizeError.message : "Unable to personalize scholarships right now.");
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
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-red-600">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-red-800">Issue loading data</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : null}

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
