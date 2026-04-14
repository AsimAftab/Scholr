"use client";

import { useEffect, useState } from "react";

import { createAdminRematchJob, getAdminOverview } from "@/lib/api";
import { AdminOverview } from "@/lib/types";

const HEALTH_TONES = {
  emerald: "bg-emerald-500/12 text-emerald-200 ring-1 ring-emerald-400/20",
  amber: "bg-amber-400/12 text-amber-100 ring-1 ring-amber-300/20",
  rose: "bg-rose-500/12 text-rose-100 ring-1 ring-rose-300/20",
  zinc: "bg-white/8 text-zinc-200 ring-1 ring-white/10",
} as const;

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
      await fetchOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start rematch job");
    } finally {
      setActionLoading(false);
    }
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

  const activeSourceRate = overview.total_sources > 0 ? Math.round((overview.enabled_sources / overview.total_sources) * 100) : 0;
  const completionRate = overview.total_jobs > 0 ? Math.round((overview.completed_jobs / overview.total_jobs) * 100) : 0;
  const failureRate = overview.total_jobs > 0 ? Math.round((overview.failed_jobs / overview.total_jobs) * 100) : 0;
  const liveJobs = overview.running_jobs + overview.pending_jobs;

  const ingestionLabel = formatLastIngestion(overview.last_ingestion_at);
  const ingestionTone = getIngestionTone(overview.last_ingestion_at);
  const pipelineTone = liveJobs > 0 ? "amber" : overview.failed_jobs > 0 ? "rose" : "emerald";
  const pipelineLabel =
    liveJobs > 0
      ? `${liveJobs} live job${liveJobs === 1 ? "" : "s"} in queue`
      : overview.failed_jobs > 0
        ? `${overview.failed_jobs} failed job${overview.failed_jobs === 1 ? "" : "s"} need review`
        : "Pipeline operating normally";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Platform Overview</h2>
          <p className="mt-1 text-sm text-zinc-600">Monitor system health, content growth, and operator workload from one surface.</p>
        </div>
        <button
          onClick={fetchOverview}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-zinc-900/10 transition hover:bg-zinc-50 disabled:opacity-50"
        >
          <svg className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-zinc-900/8 bg-zinc-950 p-6 text-white shadow-xl shadow-zinc-900/10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.18),_transparent_30%)]" />
          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-zinc-400">Statistics</p>
                <h3 className="mt-4 text-3xl font-black tracking-tight text-white md:text-[2.1rem]">Operational analytics with cleaner decision signals.</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  The dashboard now surfaces platform volume, ingestion freshness, and job pressure in a tighter executive-style summary.
                </p>
              </div>
              <div className={`inline-flex items-center rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] ${HEALTH_TONES[pipelineTone]}`}>
                {pipelineLabel}
              </div>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              <StatCard
                value={compactNumber(overview.total_scholarships)}
                label="Scholarships indexed"
                detail={`${compactNumber(overview.total_users)} active users tracked`}
              />
              <StatCard
                value={`${overview.enabled_sources}/${overview.total_sources}`}
                label="Live source coverage"
                detail={`${activeSourceRate}% of sources enabled`}
              />
              <StatCard value={ingestionLabel.primary} label="Latest ingestion" detail={ingestionLabel.secondary} />
            </div>

            <div className="mt-6 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
              <MiniMetric label="Job completion" value={`${completionRate}%`} tone="emerald" />
              <MiniMetric label="Failure pressure" value={`${failureRate}%`} tone={failureRate > 15 ? "rose" : "zinc"} />
              <MiniMetric label="Match snapshots" value={compactNumber(overview.total_match_snapshots)} tone="amber" />
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-zinc-900/8 bg-white/95 p-5 shadow-lg shadow-zinc-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Health Monitor</p>
              <p className="mt-2 text-sm text-zinc-600">Key signals that operators usually check first.</p>
            </div>
            <span className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] ${HEALTH_TONES[ingestionTone]}`}>
              {ingestionTone === "emerald" ? "Fresh" : ingestionTone === "amber" ? "Watch" : ingestionTone === "rose" ? "Delayed" : "Idle"}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <SignalRow title="Source availability" value={`${overview.enabled_sources} enabled`} progress={activeSourceRate} accent="bg-emerald-500" />
            <SignalRow title="Running jobs" value={String(overview.running_jobs)} progress={normalizeProgress(overview.running_jobs, overview.total_jobs)} accent="bg-sky-500" />
            <SignalRow title="Pending backlog" value={String(overview.pending_jobs)} progress={normalizeProgress(overview.pending_jobs, overview.total_jobs)} accent="bg-amber-500" />
            <SignalRow title="Failed jobs" value={String(overview.failed_jobs)} progress={normalizeProgress(overview.failed_jobs, overview.total_jobs)} accent="bg-rose-500" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricPanel
          eyebrow="Catalog"
          title="Scholarship inventory"
          value={compactNumber(overview.total_scholarships)}
          description="Total opportunity records currently available to matching and discovery flows."
        />
        <MetricPanel
          eyebrow="Users"
          title="User coverage"
          value={compactNumber(overview.total_users)}
          description={`${compactNumber(overview.total_match_snapshots)} recommendation snapshots are stored for retrieval.`}
        />
        <MetricPanel
          eyebrow="Jobs"
          title="Processing throughput"
          value={compactNumber(overview.total_jobs)}
          description={`${overview.completed_jobs} completed, ${overview.running_jobs} running, ${overview.pending_jobs} pending.`}
        />
        <MetricPanel
          eyebrow="Freshness"
          title="Ingestion recency"
          value={ingestionLabel.badge}
          description={ingestionLabel.secondary}
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-zinc-900/8 bg-white/95 p-5 shadow-lg shadow-zinc-900/5 backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Operations</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <PulseRow title="Active sources" value={`${overview.enabled_sources}/${overview.total_sources}`} tone="emerald" />
            <PulseRow title="Queue status" value={`${overview.running_jobs} running • ${overview.pending_jobs} pending`} tone="amber" />
            <PulseRow title="Recent outcome" value={`${overview.completed_jobs} completed • ${overview.failed_jobs} failed`} tone={overview.failed_jobs > 0 ? "rose" : "emerald"} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-zinc-900/8 bg-white/95 p-5 shadow-lg shadow-zinc-900/5 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Quick Actions</p>
              <p className="mt-2 text-sm text-zinc-600">Run global ranking refreshes or move into the full operations workspace.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleRematchAllUsers}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
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
      </div>
    </div>
  );
}

function StatCard({ value, label, detail }: { value: string; label: string; detail: string }) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
      <p className="text-[1.85rem] font-black tracking-tight text-white">{value}</p>
      <p className="mt-1 text-sm font-medium text-zinc-100">{label}</p>
      <p className="mt-2 text-xs leading-5 text-zinc-400">{detail}</p>
    </div>
  );
}

function MiniMetric({ label, value, tone }: { label: string; value: string; tone: keyof typeof HEALTH_TONES }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">{label}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-lg font-bold text-white">{value}</p>
        <span className={`h-2.5 w-2.5 rounded-full ${tone === "emerald" ? "bg-emerald-400" : tone === "amber" ? "bg-amber-300" : tone === "rose" ? "bg-rose-400" : "bg-zinc-400"}`} />
      </div>
    </div>
  );
}

function SignalRow({
  title,
  value,
  progress,
  accent,
}: {
  title: string;
  value: string;
  progress: number;
  accent: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-zinc-200/90 bg-zinc-50/80 p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-zinc-900">{title}</p>
        <p className="text-sm font-semibold text-zinc-500">{value}</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200">
        <div className={`h-full rounded-full ${accent}`} style={{ width: `${Math.max(progress, 6)}%` }} />
      </div>
    </div>
  );
}

function MetricPanel({
  eyebrow,
  title,
  value,
  description,
}: {
  eyebrow: string;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.8rem] border border-zinc-900/8 bg-white/95 p-5 shadow-lg shadow-zinc-900/5 backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">{eyebrow}</p>
      <p className="mt-4 text-lg font-semibold tracking-tight text-zinc-950">{title}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-zinc-950">{value}</p>
      <p className="mt-3 text-sm leading-6 text-zinc-600">{description}</p>
    </div>
  );
}

function PulseRow({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: "emerald" | "amber" | "rose";
}) {
  const dotClass = tone === "emerald" ? "bg-emerald-500" : tone === "amber" ? "bg-amber-500" : "bg-rose-500";

  return (
    <div className="rounded-[1.5rem] border border-zinc-900/8 bg-zinc-50 p-4">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">{title}</p>
      </div>
      <p className="mt-2.5 text-base font-semibold text-zinc-950">{value}</p>
    </div>
  );
}

function compactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
}

function normalizeProgress(value: number, total: number) {
  if (total <= 0) {
    return value > 0 ? 100 : 0;
  }

  return Math.min(Math.round((value / total) * 100), 100);
}

function getIngestionTone(date: string | null): keyof typeof HEALTH_TONES {
  if (!date) return "zinc";

  const diffHours = getDiffHours(date);
  if (diffHours <= 24) return "emerald";
  if (diffHours <= 72) return "amber";
  return "rose";
}

function formatLastIngestion(date: string | null) {
  if (!date) {
    return {
      primary: "No runs yet",
      secondary: "No ingestion timestamp is available.",
      badge: "Never",
    };
  }

  const ingestionDate = new Date(date);
  const diffHours = getDiffHours(date);
  const diffDays = Math.floor(diffHours / 24);

  const fullTimestamp = ingestionDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (diffHours < 1) {
    return {
      primary: "Moments ago",
      secondary: `Updated ${fullTimestamp}`,
      badge: "<1h",
    };
  }

  if (diffHours < 24) {
    return {
      primary: `${diffHours}h ago`,
      secondary: `Updated ${fullTimestamp}`,
      badge: `${diffHours}h`,
    };
  }

  return {
    primary: `${diffDays}d ago`,
    secondary: `Updated ${fullTimestamp}`,
    badge: `${diffDays}d`,
  };
}

function getDiffHours(date: string) {
  const ingestionDate = new Date(date);
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - ingestionDate.getTime()) / (1000 * 60 * 60)));
}
