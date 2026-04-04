"use client";

import { useEffect, useState } from "react";

import { getAdminOverview, createAdminRematchJob } from "@/lib/api";
import { AdminOverview } from "@/lib/types";

export function AdminDashboard() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminOverview();
      setOverview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleRematchAllUsers = async () => {
    try {
      setActionLoading(true);
      await createAdminRematchJob({ all_users: true });
      await fetchOverview(); // Refresh data after starting job
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start rematch job");
    } finally {
      setActionLoading(false);
    }
  };

  const formatLastIngestion = (date: string | null) => {
    if (!date) return "Never";
    const ingestionDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - ingestionDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    // Format timestamp as "Mon DD, YYYY HH:MM"
    const timestamp = ingestionDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    if (diffDays > 0) return `${timestamp} (${diffDays} day${diffDays > 1 ? "s" : ""} ago)`;
    if (diffHours > 0) return `${timestamp} (${diffHours} hour${diffHours > 1 ? "s" : ""} ago)`;
    return timestamp;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-zinc-200 border-r-zinc-900"></div>
          <p className="mt-4 text-sm text-zinc-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-medium text-red-700">{error}</p>
          <button
            onClick={fetchOverview}
            className="mt-4 inline-flex rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!overview) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Platform Overview</h2>
          <p className="mt-1 text-sm text-zinc-600">Monitor platform statistics and operations</p>
        </div>
        <button
          onClick={fetchOverview}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-zinc-900/10 transition hover:bg-zinc-50 disabled:opacity-50"
        >
          <svg className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Statistics Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Main Statistics Card */}
        <div className="rounded-2xl border border-zinc-900/8 bg-zinc-900 px-6 py-7 text-white shadow-md">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-zinc-500">Platform Statistics</p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <StatCard value={String(overview.total_scholarships)} label="Total scholarships" />
            <StatCard value={String(overview.total_sources)} label="Total sources" />
            <StatCard value={formatLastIngestion(overview.last_ingestion_at)} label="Last ingestion" />
          </div>
        </div>

        {/* Operations Statistics Card */}
        <div className="rounded-2xl border border-zinc-900/8 bg-white/90 p-5 shadow-md backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Operations</p>
          <div className="mt-4 space-y-3">
            <PulseRow
              title="Active sources"
              value={`${overview.enabled_sources}/${overview.total_sources}`}
            />
            <PulseRow
              title="Job status"
              value={`Running: ${overview.running_jobs} | Pending: ${overview.pending_jobs}`}
            />
            <PulseRow
              title="Recent activity"
              value={`${overview.completed_jobs} completed, ${overview.failed_jobs} failed`}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="rounded-2xl border border-zinc-900/8 bg-white/90 p-5 shadow-md backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Quick Actions</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleRematchAllUsers}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {actionLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-r-white"></div>
                Starting...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Rematch All Users
              </>
            )}
          </button>

          <a
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-900/10 transition hover:bg-zinc-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Go to Operations
          </a>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-900/8 bg-white/90 p-5 shadow-md backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Users</p>
          <div className="mt-4">
            <PulseRow title="Total users" value={String(overview.total_users)} />
            <PulseRow title="Match snapshots" value={String(overview.total_match_snapshots)} />
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-900/8 bg-white/90 p-5 shadow-md backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Jobs</p>
          <div className="mt-4">
            <PulseRow title="Total jobs" value={String(overview.total_jobs)} />
            <PulseRow
              title="Completion rate"
              value={
                overview.total_jobs > 0
                  ? `${Math.round((overview.completed_jobs / overview.total_jobs) * 100)}%`
                  : "N/A"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-3.5">
      <p className="text-2xl font-bold lg:text-[1.75rem]">{value}</p>
      <p className="mt-1 text-sm text-slate-300">{label}</p>
    </div>
  );
}

function PulseRow({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-900/8 bg-zinc-50 p-3.5">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">{title}</p>
      <p className="mt-1.5 text-base font-semibold text-zinc-900">{value}</p>
    </div>
  );
}
