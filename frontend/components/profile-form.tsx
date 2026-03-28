"use client";

import { useEffect, useState } from "react";
import { ZodError } from "zod";

import { COUNTRIES } from "@/lib/countries";
import { Profile } from "@/lib/types";
import { profileSchema, zodErrors } from "@/lib/validation";
import { DatePicker } from "@/components/date-picker";

type ProfileFormProps = {
  initialValue: Profile;
  onSubmit: (profile: Profile) => Promise<void>;
  loading: boolean;
};

type Tab = "basic" | "academic" | "goals" | "documents";

const fieldOfStudyOptions = [
  "Computer Science",
  "Engineering",
  "Business",
  "Medicine",
  "Law",
  "Education",
  "Economics",
  "Data Science",
  "Environmental Science",
  "Arts",
  "Other",
];

export function ProfileForm({ initialValue, onSubmit, loading }: ProfileFormProps) {
  const [form, setForm] = useState<Profile>(initialValue);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const selectedFieldOfStudy = fieldOfStudyOptions.includes(form.field_of_study ?? "")
    ? form.field_of_study
    : form.field_of_study
      ? "Other"
      : "";
  const otherFieldOfStudy =
    selectedFieldOfStudy === "Other" && !fieldOfStudyOptions.includes(form.field_of_study ?? "")
      ? form.field_of_study ?? ""
      : "";

  useEffect(() => {
    setForm(initialValue);
  }, [initialValue]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "basic", label: "Basic Info" },
    { id: "academic", label: "Academic" },
    { id: "goals", label: "Goals" },
    { id: "documents", label: "Documents" },
  ];

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
            // Option to switch to the tab with the first error could be added here
          }
        }
      }}
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-zinc-500">Profile Setup</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900">Build your fit profile</h2>
      </div>

      <div className="mb-6 flex space-x-2 border-b border-zinc-200" role="tablist" aria-label="Profile sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${tab.id}-tab`}
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-zinc-900 text-zinc-900"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {activeTab === "basic" && (
          <div role="tabpanel" id="basic-panel" aria-labelledby="basic-tab">
            <label className="space-y-2 text-sm font-medium text-zinc-900">
              <span>Gender</span>
              <select
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-900 focus:bg-white"
                value={form.gender ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender ? <span className="block text-sm text-red-700">{errors.gender}</span> : null}
            </label>

            <label className="space-y-2 text-sm font-medium text-zinc-900">
              <span>Date of Birth</span>
              <DatePicker
                value={form.date_of_birth ?? ""}
                onChange={(val) => setForm((current) => ({ ...current, date_of_birth: val }))}
                placeholder="Select your date of birth"
                error={!!errors.date_of_birth}
              />
              {errors.date_of_birth ? <span className="block text-sm text-red-700">{errors.date_of_birth}</span> : null}
            </label>

            <label className="space-y-2 text-sm font-medium text-zinc-900">
              <span>Current Country</span>
              <input
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-900 focus:bg-white"
                type="text"
                list="country-options"
                value={String(form.country ?? "")}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    country: event.target.value,
                  }))
                }
                placeholder="Current Country"
                autoComplete="off"
              />
              <datalist id="country-options">
                {COUNTRIES.map((country) => (
                  <option key={country} value={country} />
                ))}
              </datalist>
              {errors.country ? <span className="block text-sm text-red-700">{errors.country}</span> : null}
            </label>
          </div>
        )}

        {activeTab === "academic" && (
          <div role="tabpanel" id="academic-panel" aria-labelledby="academic-tab">
            <label className="space-y-2 text-sm font-medium text-zinc-900">
              <span>Passout Year</span>
              <input
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-900 focus:bg-white"
                type="number"
                value={form.passout_year ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    passout_year: event.target.value ? Number(event.target.value) : undefined,
                  }))
                }
                placeholder="Passout Year"
              />
              {errors.passout_year ? <span className="block text-sm text-red-700">{errors.passout_year}</span> : null}
            </label>
            <label className="space-y-2 text-sm font-medium text-zinc-900">
              <span>GPA</span>
              <input
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-900 focus:bg-white"
                type="number"
                step="0.1"
                value={String(form.gpa ?? "")}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    gpa: event.target.value ? Number(event.target.value) : 0,
                  }))
                }
                placeholder="GPA"
              />
              {errors.gpa ? <span className="block text-sm text-red-700">{errors.gpa}</span> : null}
            </label>
            <label className="space-y-2 text-sm font-medium text-zinc-900">
              <span>IELTS Score</span>
              <input
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-900 focus:bg-white"
                type="number"
                step="0.1"
                value={String(form.ielts_score ?? "")}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    ielts_score: Number(event.target.value),
                  }))
                }
                placeholder="IELTS Score"
              />
              {errors.ielts_score ? <span className="block text-sm text-red-700">{errors.ielts_score}</span> : null}
            </label>
          </div>
        )}

        {activeTab === "goals" && (
          <div role="tabpanel" id="goals-panel" aria-labelledby="goals-tab">
            <label className="space-y-2 text-sm font-medium text-zinc-900">
              <span>Target Country</span>
              <input
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-900 focus:bg-white"
                type="text"
                list="target-country-options"
                value={String(form.target_country ?? "")}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    target_country: event.target.value,
                  }))
                }
                placeholder="Target Country"
                autoComplete="off"
              />
              <datalist id="target-country-options">
                {COUNTRIES.map((country) => (
                  <option key={country} value={country} />
                ))}
              </datalist>
              {errors.target_country ? <span className="block text-sm text-red-700">{errors.target_country}</span> : null}
            </label>

            <label className="space-y-2 text-sm font-medium text-zinc-900">
              <span>Next Study Level</span>
              <select
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-900 focus:bg-white"
                value={form.degree_level ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, degree_level: event.target.value }))}
              >
                <option value="">Select degree level</option>
                <option value="Bachelors">Bachelors</option>
                <option value="Masters">Masters</option>
                <option value="PhD">PhD</option>
              </select>
              {errors.degree_level ? <span className="block text-sm text-red-700">{errors.degree_level}</span> : null}
            </label>

            <label className="space-y-2 text-sm font-medium text-zinc-900">
              <span>Field of Study / Major</span>
              <select
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-900 focus:bg-white"
                value={selectedFieldOfStudy}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    field_of_study: event.target.value === "Other" ? otherFieldOfStudy : event.target.value,
                  }))
                }
              >
                <option value="">Select field of study</option>
                {fieldOfStudyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.field_of_study ? <span className="block text-sm text-red-700">{errors.field_of_study}</span> : null}
            </label>

            {selectedFieldOfStudy === "Other" ? (
              <label className="space-y-2 text-sm font-medium text-zinc-900">
                <span>Other Field of Study</span>
                <input
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-900 focus:bg-white"
                  type="text"
                  value={otherFieldOfStudy}
                  onChange={(event) => setForm((current) => ({ ...current, field_of_study: event.target.value }))}
                  placeholder="Enter your field of study"
                />
              </label>
            ) : null}
          </div>
        )}

        {activeTab === "documents" && (
          <div className="md:col-span-2" role="tabpanel" id="documents-panel" aria-labelledby="documents-tab">
            <label className="space-y-2 text-sm font-medium text-zinc-900">
              <span>Resume/CV URL</span>
              <input
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-900 focus:bg-white"
                type="url"
                value={form.resume_url ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    resume_url: event.target.value,
                  }))
                }
                placeholder="https://link-to-your-resume.pdf"
              />
              {errors.resume_url ? <span className="block text-sm text-red-700">{errors.resume_url}</span> : null}
            </label>
            <p className="mt-2 text-xs text-zinc-500">Provide a direct link to your resume or CV (e.g., Google Drive, Dropbox).</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end pt-4 border-t border-zinc-100">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save profile setup"}
        </button>
      </div>
    </form>
  );
}
