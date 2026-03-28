"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { useAuthContext } from "@/lib/auth-context";
import {
  createAdminCrawlJob,
  createAdminRematchJob,
  getAdminJobs,
  getAdminOverview,
  getAdminSources,
} from "@/lib/api";
import { AdminJob, AdminOverview, AdminSource } from "@/lib/types";

const emptyOverview: AdminOverview = {
  total_sources: 0,
  enabled_sources: 0,
  total_jobs: 0,
  pending_jobs: 0,
  running_jobs: 0,
  completed_jobs: 0,
  failed_jobs: 0,
  total_match_snapshots: 0,
};

export default function AdminPage() {
  const router = useRouter();
  const { user, loading, handleLogout } = useAuthContext();
  const [overview, setOverview] = useState<AdminOverview>(emptyOverview);
  const [sources, setSources] = useState<AdminSource[]>([]);
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [countryFilter, setCountryFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [busyAction, setBusyAction] = useState("");
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

    Promise.all([getAdminOverview(), getAdminSources(), getAdminJobs()])
      .then(([nextOverview, nextSources, nextJobs]) => {
        setOverview(nextOverview);
        setSources(nextSources);
        setJobs(nextJobs);
      })
      .catch((adminError) => {
        setError(adminError instanceof Error ? adminError.message : "Unable to load admin data.");
      });
  }, [user]);

  useEffect(() => {
    if (user?.role !== "admin") {
      return;
    }
    const interval = setInterval(() => {
      void refreshAdminData().catch(() => {
        // Keep polling quiet between successful refreshes.
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [user]);

  async function refreshAdminData() {
    const [nextOverview, nextSources, nextJobs] = await Promise.all([
      getAdminOverview(),
      getAdminSources(),
      getAdminJobs(),
    ]);
    setOverview(nextOverview);
    setSources(nextSources);
    setJobs(nextJobs);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="text-zinc-600">Loading admin workspace...</div>
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
      title="Admin Operations"
      subtitle="Control global scholarship ingestion, inspect operational status, and trigger rematch workflows from one place."
    >
      <div className="space-y-8">
        {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            ["Sources", `${overview.enabled_sources}/${overview.total_sources}`],
            ["Jobs", String(overview.total_jobs)],
            ["Pending", String(overview.pending_jobs)],
            ["Running", String(overview.running_jobs)],
            ["Match Snapshots", String(overview.total_match_snapshots)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-zinc-900/8 bg-white/90 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-zinc-500">{label}</p>
              <p className="mt-3 text-3xl font-black tracking-tight text-zinc-950">{value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-zinc-900/8 bg-white/90 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Job Triggers</p>
            <div className="mt-5 space-y-5">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-sm font-semibold text-zinc-900">Global ingestion</p>
                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  Create a crawl job for all enabled sources or narrow it by country and region.
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <input
                    className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900"
                    value={countryFilter}
                    onChange={(event) => setCountryFilter(event.target.value)}
                    placeholder="Country filter"
                  />
                  <input
                    className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900"
                    value={regionFilter}
                    onChange={(event) => setRegionFilter(event.target.value)}
                    placeholder="Region filter"
                  />
                </div>
                <button
                  type="button"
                  disabled={busyAction === "ingest"}
                  onClick={async () => {
                    setBusyAction("ingest");
                    setError("");
                    try {
                      await createAdminCrawlJob({
                        country_filter: countryFilter || undefined,
                        region_filter: regionFilter || undefined,
                      });
                      await refreshAdminData();
                    } catch (adminError) {
                      setError(adminError instanceof Error ? adminError.message : "Unable to create crawl job.");
                    } finally {
                      setBusyAction("");
                    }
                  }}
                  className="mt-4 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
                >
                  {busyAction === "ingest" ? "Creating job..." : "Trigger ingestion job"}
                </button>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-sm font-semibold text-zinc-900">Rematch workflows</p>
                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  Recompute ranking snapshots for one user immediately or refresh all profiled users.
                </p>
                <input
                  className="mt-4 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900"
                  value={targetUserId}
                  onChange={(event) => setTargetUserId(event.target.value)}
                  placeholder="Target user id"
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={busyAction === "one-rematch"}
                    onClick={async () => {
                      setBusyAction("one-rematch");
                      setError("");
                      try {
                        await createAdminRematchJob({
                          user_id: Number(targetUserId),
                          all_users: false,
                        });
                        await refreshAdminData();
                      } catch (adminError) {
                        setError(adminError instanceof Error ? adminError.message : "Unable to create rematch job.");
                      } finally {
                        setBusyAction("");
                      }
                    }}
                    className="rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-900"
                  >
                    {busyAction === "one-rematch" ? "Running..." : "Rematch one user"}
                  </button>

                  <button
                    type="button"
                    disabled={busyAction === "all-rematch"}
                    onClick={async () => {
                      setBusyAction("all-rematch");
                      setError("");
                      try {
                        await createAdminRematchJob({ all_users: true });
                        await refreshAdminData();
                      } catch (adminError) {
                        setError(adminError instanceof Error ? adminError.message : "Unable to create global rematch job.");
                      } finally {
                        setBusyAction("");
                      }
                    }}
                    className="rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400 disabled:opacity-60"
                  >
                    {busyAction === "all-rematch" ? "Running..." : "Rematch all users"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-zinc-900/8 bg-white/90 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Sources</p>
                <span className="text-sm text-zinc-500">{sources.length} registered</span>
              </div>
              <div className="mt-5 max-h-[24rem] space-y-3 overflow-auto pr-2">
                {sources.length > 0 ? (
                  sources.map((source) => (
                    <div key={source.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-zinc-900">{source.source_name}</p>
                          <p className="mt-1 text-sm text-zinc-500">
                            {source.country} • {source.region} • {source.fetcher_kind}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${
                            source.enabled ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-600"
                          }`}
                        >
                          {source.enabled ? "enabled" : "disabled"}
                        </span>
                      </div>
                      <p className="mt-2 break-all text-xs text-zinc-500">{source.base_url}</p>
                      {source.last_success_at ? (
                        <p className="mt-2 text-xs text-zinc-500">
                          Last success {new Date(source.last_success_at).toLocaleString()}
                        </p>
                      ) : null}
                      {source.last_run_id ? (
                        <p className="mt-1 break-all text-xs text-zinc-500">Run {source.last_run_id}</p>
                      ) : null}
                      {source.last_error ? <p className="mt-2 text-sm text-red-700">{source.last_error}</p> : null}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">No source rows have been synced into the database yet.</p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-900/8 bg-white/90 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Recent Jobs</p>
                <span className="text-sm text-zinc-500">{jobs.length} rows</span>
              </div>
              <div className="mt-5 max-h-[24rem] space-y-3 overflow-auto pr-2">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <div key={job.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-zinc-900">{job.job_type}</p>
                          <p className="mt-1 text-sm text-zinc-500">
                            Created {new Date(job.created_at).toLocaleString()}
                          </p>
                        </div>
                        <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                          {job.status}
                        </span>
                      </div>
                      {job.country_filter || job.region_filter || job.source_key ? (
                        <p className="mt-2 text-sm text-zinc-600">
                          {[job.source_key, job.country_filter, job.region_filter].filter(Boolean).join(" • ")}
                        </p>
                      ) : null}
                      <p className="mt-2 text-sm text-zinc-600">
                        Progress {job.processed_items}/{job.total_items} • Success {job.success_count} • Failed{" "}
                        {job.failed_count}
                      </p>
                      {job.log_output ? (
                        <pre className="mt-3 max-h-40 overflow-auto rounded-xl bg-zinc-950 p-3 text-xs leading-6 text-zinc-100 whitespace-pre-wrap">
                          {job.log_output}
                        </pre>
                      ) : null}
                      {job.error_message ? <p className="mt-2 text-sm text-red-700">{job.error_message}</p> : null}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">No jobs have been created yet.</p>
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
