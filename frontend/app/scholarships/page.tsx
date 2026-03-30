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

  // Filter scholarships by country
  const filteredScholarships = countryFilter
    ? scholarships.filter((s) => s.country.toLowerCase() === countryFilter.toLowerCase())
    : scholarships;

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
    if (user?.role !== "admin" && user?.profile) {
      getMatches(user.profile)
        .then((response) => setMatches(response.matches))
        .catch(() => setError("Unable to load scholarship matches."));
    }
  }, [user]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="rounded-xl border border-white/60 bg-white/80 px-8 py-6 text-center text-slate-600 shadow-md backdrop-blur-xl">
          Loading scholarships...
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppShell
      user={user}
      onLogout={handleLogout}
      title={user.role === "admin" ? "Scholarship Catalog" : "Scholarships"}
      subtitle={
        user.role === "admin"
          ? "Inspect the full scholarship dataset indexed in the system, including eligibility, funding, and source details."
          : "Browse the indexed scholarship set, compare fit scores, and inspect missing requirements before you apply."
      }
    >
      <div className="space-y-6">
        {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}

        <div className="rounded-xl border border-zinc-900/8 bg-white/90 p-6 shadow-md backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Filter Scholarships</p>
            <span className="text-sm text-zinc-500">
              {filteredScholarships.length} of {scholarships.length} scholarships
            </span>
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
          title={user.role === "admin" ? "All Indexed Scholarships" : "Structured Dataset"}
          emptyMessage="Finish your profile in the dashboard to unlock personalized scholarship rankings."
          adminView={user.role === "admin"}
        />
      </div>
    </AppShell>
  );
}
