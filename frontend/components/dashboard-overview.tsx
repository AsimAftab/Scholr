"use client";

import { 
  HiOutlineSparkles, 
  HiOutlineBolt, 
  HiOutlineMagnifyingGlass,
  HiOutlineCheckBadge,
  HiOutlineGlobeAlt,
  HiOutlineCalendarDays
} from "react-icons/hi2";

import { isProfileReady } from "@/lib/profile";
import { Match, Scholarship, User } from "@/lib/types";

type DashboardOverviewProps = {
  user: User;
  scholarships: Scholarship[];
  matches: Match[];
};

export function DashboardOverview({ user, scholarships, matches }: DashboardOverviewProps) {
  const profileReady = isProfileReady(user.profile);

  return (
    <div className="space-y-10">
      {/* Header section - Formal & Institutional */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200/50 pb-8">
        <div>
           <div className="flex items-center gap-2 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Operational Intelligence</p>
           </div>
           <h1 className="text-4xl font-bold tracking-tight text-zinc-950">
             {profileReady ? `Institutional Overview: ${user.full_name?.split(" ")[0]}` : `Strategic Onboarding: ${user.full_name?.split(" ")[0]}`}
           </h1>
           <p className="mt-4 max-w-2xl text-[13px] font-medium leading-relaxed text-zinc-500">
             Aggregating global scholarship opportunities with real-time strategic alignment across 4,200+ verified academic institutions.
           </p>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-300">
           <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
              Network Online
           </div>
           <div className="hidden sm:block opacity-30">|</div>
           <div className="hidden sm:block">Update: Just Now</div>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        <StatCard 
          value={String(matches.length)} 
          label="Strategic Alignments" 
          icon={HiOutlineBolt}
          trend="Qualified Matches"
        />
        <StatCard 
          value={`${matches[0]?.match_score ?? "--"}%`} 
          label="Core Compatibility" 
          icon={HiOutlineSparkles}
          trend="Institutional Logic"
        />
        <StatCard 
          value={String(scholarships.length)} 
          label="Global Indexing" 
          icon={HiOutlineMagnifyingGlass}
          trend="Data Breadth"
        />
      </section>

      {/* Pulse Section - Formalized Monitoring */}
      <div className="rounded-[2.5rem] border border-zinc-200/50 bg-white/40 p-10 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.04)] backdrop-blur-3xl">
        <div className="flex items-center justify-between mb-10">
           <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-sm bg-zinc-950"></div>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Application Pipeline Monitor</p>
           </div>
           {profileReady && (
             <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Efficiency: 100%</span>
                <div className="flex h-1.5 w-24 rounded-full bg-zinc-100 overflow-hidden">
                   <div className="h-full w-full bg-zinc-950 rounded-full"></div>
                </div>
             </div>
           )}
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          <PulseItem 
             title="Strategy Status" 
             value={profileReady ? "Optimized & Ready" : "Awaiting Parameters"} 
             icon={HiOutlineCheckBadge}
             color={profileReady ? "text-zinc-950" : "text-zinc-400"}
          />
          <PulseItem 
             title="Target Jurisdiction" 
             value={matches[0]?.country ?? "System Standby"} 
             icon={HiOutlineGlobeAlt}
          />
          <PulseItem 
             title="Upcoming Deadline" 
             value={matches[0]?.deadline ?? "No Action Required"} 
             icon={HiOutlineCalendarDays}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, icon: Icon, trend }: { value: string; label: string; icon: any; trend: string }) {
  return (
    <div className="group rounded-[2.5rem] border border-zinc-200/50 bg-white p-8 transition-all duration-500 hover:border-zinc-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="flex items-start justify-between mb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-zinc-50 text-zinc-950 group-hover:bg-zinc-950 group-hover:text-white transition-all duration-500 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
           <Icon className="h-7 w-7" />
        </div>
        <p className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.25em]">{trend}</p>
      </div>
      <p className="text-4xl font-bold text-zinc-950 tracking-tight mb-3">{value}</p>
      <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em]">{label}</p>
    </div>
  );
}

function PulseItem({ title, value, icon: Icon, color = "text-zinc-900" }: { title: string; value: string; icon: any; color?: string }) {
  return (
    <div className="flex items-center gap-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100/50 text-zinc-950 border border-white">
         <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1.5">{title}</p>
        <p className={`text-[14px] font-bold tracking-tight ${color}`}>{value}</p>
      </div>
    </div>
  );
}
