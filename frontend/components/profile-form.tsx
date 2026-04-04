"use client";

import { useEffect, useState } from "react";
import { ZodError } from "zod";

import { COUNTRIES } from "@/lib/countries";
import { DegreeLevel, Profile } from "@/lib/types";
import { profileSchema, zodErrors } from "@/lib/validation";
import { DatePicker } from "@/components/date-picker";

type ProfileFormProps = {
  initialValue: Profile;
  onSubmit: (profile: Profile) => Promise<void>;
  loading: boolean;
};

type Tab = "basic" | "academic" | "goals" | "documents";
type ProfileFormState = Omit<Profile, "gpa"> & { gpa?: number };

const fieldOfStudyCategories = {
  "STEM & Technology": [
    "Computer Science",
    "Data Science & Analytics",
    "Information Technology",
    "Software Engineering",
    "Cybersecurity",
    "Artificial Intelligence & Machine Learning",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Biomedical Engineering",
    "Aerospace Engineering",
    "Environmental Engineering",
    "Industrial Engineering",
  ],
  "Business & Economics": [
    "Business Administration",
    "Finance & Accounting",
    "Marketing",
    "Management",
    "Economics",
    "Entrepreneurship",
    "International Business",
  ],
  "Health & Medicine": [
    "Medicine (MD/MBBS)",
    "Nursing",
    "Pharmacy",
    "Public Health",
    "Dentistry",
    "Veterinary Medicine",
    "Psychology",
    "Physical Therapy",
    "Medical Research",
  ],
  "Arts & Humanities": [
    "Fine Arts",
    "Design",
    "Literature",
    "History",
    "Philosophy",
    "Languages & Linguistics",
    "Music & Performing Arts",
    "Film & Media Studies",
  ],
  "Social Sciences": [
    "Political Science",
    "Sociology",
    "Anthropology",
    "International Relations",
    "Communication Studies",
    "Social Work",
  ],
  "Education": [
    "Education",
    "Curriculum & Instruction",
    "Educational Leadership",
    "Special Education",
  ],
  "Law": [
    "Law (LLB/JD)",
    "International Law",
    "Criminal Justice",
  ],
  "Sciences": [
    "Biology",
    "Chemistry",
    "Physics",
    "Mathematics",
    "Statistics",
    "Environmental Science",
    "Earth Sciences",
    "Biotechnology",
  ],
  "Agriculture & Natural Resources": [
    "Agriculture",
    "Forestry",
    "Food Science",
    "Horticulture",
  ],
  "Architecture & Design": [
    "Architecture",
    "Urban Planning",
    "Interior Design",
  ],
  "Interdisciplinary & Emerging Fields": [
    "Sustainability Studies",
    "Digital Media",
    "Game Design",
    "UX/UI Design",
    "Blockchain & Web3",
    "Robotics",
  ],
};
const allFieldOfStudyOptions = Object.values(fieldOfStudyCategories).flat();

const fieldTabMap: Record<string, Tab> = {
  country: "basic",
  gender: "basic",
  date_of_birth: "basic",
  passout_year: "academic",
  gpa: "academic",
  ielts_score: "academic",
  target_country: "goals",
  degree_level: "goals",
  field_of_study: "goals",
  resume_url: "documents",
};

export function ProfileForm({ initialValue, onSubmit, loading }: ProfileFormProps) {
  const [form, setForm] = useState<ProfileFormState>(initialValue);
  const [gpaInput, setGpaInput] = useState(initialValue.gpa.toString());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const selectedFieldOfStudy = allFieldOfStudyOptions.includes(form.field_of_study ?? "")
    ? form.field_of_study
    : form.field_of_study
      ? "Other"
      : "";
  const otherFieldOfStudy =
    selectedFieldOfStudy === "Other" && !allFieldOfStudyOptions.includes(form.field_of_study ?? "") && form.field_of_study !== "Other"
      ? form.field_of_study ?? ""
      : "";

  useEffect(() => {
    setForm(initialValue);
    setGpaInput(initialValue.gpa.toString());
    setFormError("");
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
          setFormError("");
          // Create a copy of the form data for validation
          const formToValidate = { ...form };

          formToValidate.passout_year = formToValidate.passout_year ?? undefined;
          formToValidate.ielts_score = formToValidate.ielts_score ?? undefined;
          formToValidate.gender = formToValidate.gender ?? undefined;
          formToValidate.date_of_birth = formToValidate.date_of_birth ?? undefined;
          const normalizedResumeUrl = (formToValidate.resume_url ?? "").trim();
          formToValidate.resume_url = normalizedResumeUrl === "" ? undefined : normalizedResumeUrl;

          // If "Other" is selected but no custom value is entered, set to empty string to trigger validation error
          if (formToValidate.field_of_study === "Other") {
            formToValidate.field_of_study = "";
          }

          if (gpaInput.trim() === "") {
            formToValidate.gpa = undefined;
          } else {
            const parsedGpa = Number.parseFloat(gpaInput);
            formToValidate.gpa = Number.isNaN(parsedGpa) ? undefined : parsedGpa;
          }

          const payload = profileSchema.parse(formToValidate);
          setErrors({});
          await onSubmit(payload);
        } catch (error) {
          if (error instanceof ZodError) {
            const nextErrors = zodErrors(error);
            setErrors(nextErrors);
            setFormError("Profile was not saved. Fix the highlighted field and try again.");

            const firstErrorField = Object.keys(nextErrors)[0];
            if (firstErrorField && fieldTabMap[firstErrorField]) {
              setActiveTab(fieldTabMap[firstErrorField]);
            }
          }
        }
      }}
    >
      {formError ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
          {formError}
        </div>
      ) : null}
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
              <span>Country of Residence</span>
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
                placeholder="Country of Residence"
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
                step="0.01"
                min="0"
                max="10"
                value={gpaInput}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setGpaInput(nextValue);

                  if (nextValue === "") {
                    setForm((current) => ({ ...current, gpa: undefined }));
                    return;
                  }

                  const value = Number.parseFloat(nextValue);
                  if (Number.isNaN(value)) {
                    return;
                  }

                  setForm((current) => ({ ...current, gpa: value }));
                }}
                onBlur={(event) => {
                  const rawValue = event.target.value.trim();
                  if (rawValue === "") {
                    setGpaInput("");
                    setForm((current) => ({ ...current, gpa: undefined }));
                    return;
                  }

                  const value = Number.parseFloat(rawValue);
                  if (Number.isNaN(value)) {
                    setGpaInput(form.gpa?.toString() ?? "");
                    return;
                  }

                  const clampedValue = Math.min(10, Math.max(0, value));
                  setGpaInput(clampedValue.toString());
                  setForm((current) => ({ ...current, gpa: clampedValue }));
                }}
                placeholder="GPA (e.g., 3.5 or 8.5)"
              />
              {errors.gpa ? <span className="block text-sm text-red-700">{errors.gpa}</span> : null}
              <p className="text-xs text-zinc-500">Enter your GPA on your institution&apos;s scale (0-4.0 or 0-10.0)</p>
            </label>
            <label className="space-y-2 text-sm font-medium text-zinc-900">
              <span>IELTS Score / Band</span>
              <select
                id="ielts-score"
                aria-label="IELTS Score Band"
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-900 focus:bg-white"
                value={form.ielts_score ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    ielts_score: event.target.value !== "" ? Number(event.target.value) : undefined,
                  }))
                }
              >
                <option value="">Select band</option>
                <option value="0">Band 0 (Not attempted)</option>
                <option value="1">Band 1</option>
                <option value="2">Band 2</option>
                <option value="2.5">Band 2.5</option>
                <option value="3">Band 3</option>
                <option value="3.5">Band 3.5</option>
                <option value="4">Band 4</option>
                <option value="4.5">Band 4.5</option>
                <option value="5">Band 5</option>
                <option value="5.5">Band 5.5</option>
                <option value="6">Band 6</option>
                <option value="6.5">Band 6.5</option>
                <option value="7">Band 7</option>
                <option value="7.5">Band 7.5</option>
                <option value="8">Band 8</option>
                <option value="8.5">Band 8.5</option>
                <option value="9">Band 9</option>
              </select>
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
                onChange={(event) =>
                  setForm((current) => ({ ...current, degree_level: event.target.value as DegreeLevel }))
                }
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
                    field_of_study: event.target.value === "Other" ? "Other" : event.target.value,
                  }))
                }
              >
                <option value="">Select field of study</option>
                {Object.entries(fieldOfStudyCategories).map(([category, options]) => (
                  <optgroup key={category} label={category}>
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <option value="Other">Other</option>
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
                  onChange={(event) => {
                    const value = event.target.value;
                    setForm((current) => ({
                      ...current,
                      field_of_study: value || "Other", // Keep "Other" if cleared, otherwise use typed value
                    }));
                  }}
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
