import React from "react";

interface InfoBlockProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number | undefined | null | React.ReactNode;
}

export function InfoBlock({ icon: Icon, label, value }: InfoBlockProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 shadow-sm">
        <Icon className="h-5 w-5 text-slate-500" />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-slate-500 block text-[10px] uppercase tracking-[0.15em] mb-0.5">
          {label}
        </span>
        <span className="text-[#202224] font-bold text-sm tracking-tight">
          {value || "N/A"}
        </span>
      </div>
    </div>
  );
}
