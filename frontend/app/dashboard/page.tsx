"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { DashboardOverview } from "@/components/dashboard-overview";
import { AdminDashboard } from "@/components/admin-dashboard";
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
    if (user?.role !== "admin") {
      getScholarships()
        .then(setScholarships)
        .catch(() => setError("Unable to load scholarships."));
    }
  }, [user]);

  useEffect(() => {
    if (user?.role !== "admin" && user?.profile) {
      getMatches()
        .then((response) => setMatches(response.matches))
        .catch(() => setError("Unable to load scholarship matches."));
    } else {
      setMatches([]);
    }
  }, [user]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900" />
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
      title="Dashboard"
      subtitle={user.role === "admin" ? "Platform overview and operational controls" : "Your scholarship matches and recommendations at a glance."}
      compact
      lockViewport
    >
      <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto pr-1">
        {user.role === "admin" ? (
          <AdminDashboard />
        ) : (
          <>
            {(error || authError) && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                {error || authError}
              </div>
            )}
            <DashboardOverview user={user} scholarships={scholarships} matches={matches} />
          </>
        )}
      </div>
    </AppShell>
  );
}
