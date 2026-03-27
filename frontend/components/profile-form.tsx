"use client";

import { useEffect, useState } from "react";
import { ZodError } from "zod";

import { Profile } from "@/lib/types";
import { profileSchema, zodErrors } from "@/lib/validation";

type ProfileFormProps = {
  initialValue: Profile;
  onSubmit: (profile: Profile) => Promise<void>;
  loading: boolean;
};

export function ProfileForm({ initialValue, onSubmit, loading }: ProfileFormProps) {
  const [form, setForm] = useState<Profile>(initialValue);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm(initialValue);
  }, [initialValue]);

  return (
    <form
      className="rounded-xl border border-zinc-900/8 bg-white/90 p-6 shadow-md backdrop-blur"
      onSubmit={async (event) => {
        event.preventDefault();
        try {
          const payload = profileSchema.parse(form);
          setErrors({});
          await onSubmit(payload);
        } catch (error) {
          if (error instanceof ZodError) {
            setErrors(zodErrors(error));
          }
        }
      }}
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-zinc-500">Profile</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900">Build your fit profile</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["country", "Current Country"],
          ["target_country", "Target Country"],
          ["degree", "Degree"],
          ["gpa", "GPA"],
          ["ielts_score", "IELTS Score"],
        ].map(([name, label]) => (
          <label key={name} className="space-y-2 text-sm font-medium text-zinc-900">
            <span>{label}</span>
            <input
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-900 focus:bg-white"
              type={name === "gpa" || name === "ielts_score" || name === "passout_year" ? "number" : "text"}
              step={name === "gpa" || name === "ielts_score" ? "0.1" : undefined}
              value={String(form[name as keyof Profile] ?? "")}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  [name]:
                    name === "gpa" || name === "ielts_score" || name === "passout_year"
                      ? Number(event.target.value)
                      : event.target.value,
                }))
              }
              placeholder={label}
            />
            {errors[name] ? <span className="block text-sm text-red-700">{errors[name]}</span> : null}
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
      >
        {loading ? "Calculating..." : "Save profile and match"}
      </button>
    </form>
  );
}
