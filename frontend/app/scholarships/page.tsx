"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { ScholarshipList } from "@/components/scholarship-list";
import { useAuthContext } from "@/lib/auth-context";
import { getMatches, getScholarships } from "@/lib/api";
import { Match, Scholarship } from "@/lib/types";

export default function ScholarshipsPage() {
  const router = useRouter();
  const { user, loading, handleLogout } = useAuthContext();
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
      title="Scholarships"
      subtitle="Browse the indexed scholarship set, compare fit scores, and inspect missing requirements before you apply."
    >
      <div className="space-y-6">

          {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}

          <ScholarshipList
            scholarships={scholarships}
            matches={matches}
            profile={user.profile}
            title="Structured Dataset"
            emptyMessage="Finish your profile in the dashboard to unlock personalized scholarship rankings."
          />
      </div>
    </AppShell>
  );
}
