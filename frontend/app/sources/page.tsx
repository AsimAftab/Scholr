"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { useAuthContext } from "@/lib/auth-context";
import { getAdminSources } from "@/lib/api";
import { AdminSource } from "@/lib/types";

export default function SourcesPage() {
  const router = useRouter();
  const { user, loading, handleLogout } = useAuthContext();
  const [sources, setSources] = useState<AdminSource[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/sign-in");
      return;
    }
    if (!loading && user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user?.role !== "admin") {
      return;
    }

    getAdminSources()
      .then((nextSources) => {
        setSources(nextSources);
      })
      .catch((sourcesError) => {
        setError(sourcesError instanceof Error ? sourcesError.message : "Unable to load sources.");
      });
  }, [user]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="text-zinc-600">Loading sources...</div>
      </main>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <AppShell
      user={user}
      onLogout={handleLogout}
      title="Crawler Sources"
      subtitle="View all registered scholarship data sources, their status, and recent activity."
    >
      <div className="space-y-6">
        {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}

        <section className="rounded-2xl border border-zinc-900/8 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                Registered Sources
              </p>
              <p className="mt-2 text-sm text-zinc-600">{sources.length} sources configured</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {sources.length > 0 ? (
              sources.map((source) => (
                <div key={source.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-zinc-900">{source.source_name}</h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${
                            source.enabled
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-zinc-200 text-zinc-600"
                          }`}
                        >
                          {source.enabled ? "enabled" : "disabled"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-zinc-600">
                        <span className="font-medium">Country:</span> {source.country} •{" "}
                        <span className="font-medium">Region:</span> {source.region} •{" "}
                        <span className="font-medium">Type:</span> {source.fetcher_kind}
                      </p>
                      <p className="mt-2 break-all text-sm text-zinc-500">
                        <span className="font-medium">Base URL:</span> {source.base_url}
                      </p>
                      {source.source_key ? (
                        <p className="mt-1 text-sm text-zinc-500">
                          <span className="font-medium">Source Key:</span> {source.source_key}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-zinc-200 pt-4">
                    {source.last_success_at ? (
                      <p className="text-sm text-zinc-600">
                        ✓ Last successful crawl: {new Date(source.last_success_at).toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-sm text-zinc-500">No successful crawls recorded yet</p>
                    )}
                    {source.last_run_id ? (
                      <p className="text-sm text-zinc-500">Last job run: {source.last_run_id}</p>
                    ) : null}
                    {source.last_error ? (
                      <p className="text-sm text-red-700">
                        ✗ Last error: {source.last_error}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
                <p className="text-sm text-zinc-500">
                  No sources have been configured yet. Sources are added through the backend database.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
