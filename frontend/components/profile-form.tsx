"use client";

import { useEffect, useMemo, useState } from "react";
import { ZodError } from "zod";

import { COUNTRIES } from "@/lib/countries";
import { DegreeLevel, Education, Profile, WorkExperience } from "@/lib/types";
import { profileSchema, zodErrors } from "@/lib/validation";
import {
  HiOutlineAcademicCap,
  HiOutlineGlobeAlt,
  HiOutlineDocumentCheck,
  HiOutlineChevronDown,
  HiOutlineXMark,
} from "react-icons/hi2";

type ProfileFormProps = {
  initialValue: Profile;
  onSubmit: (profile: Profile) => Promise<void>;
  loading: boolean;
};

type ProfileFormState = Omit<Profile, "gpa"> & { gpa?: number };

const EMPTY_EDUCATION: Education = {
  institution_name: "",
  degree: "",
  field_of_study: "",
  start_year: undefined,
  end_year: undefined,
  gpa: undefined,
  country: "",
  city: "",
  achievements: "",
};

const EMPTY_WORK_EXPERIENCE: WorkExperience = {
  company_name: "",
  job_title: "",
  start_date: "",
  end_date: "",
  is_current: false,
  employment_type: undefined,
  location: "",
  description: "",
};

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

export function ProfileForm({ initialValue, onSubmit, loading }: ProfileFormProps) {
  const [activeTab, setActiveTab] = useState<"history" | "goals" | "documents">("history");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<ProfileFormState>(initialValue);
  const [gpaInput, setGpaInput] = useState(initialValue.gpa?.toString() ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  // Education entries
  const [educations, setEducations] = useState<Education[]>(initialValue.educations ?? []);
  // Work experience entries
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>(initialValue.work_experiences ?? []);

  const selectedFieldOfStudy = useMemo(() => {
    if (allFieldOfStudyOptions.includes(form.field_of_study ?? "")) {
      return form.field_of_study;
    }
    return form.field_of_study ? "Other" : "";
  }, [form.field_of_study]);

  const otherFieldOfStudy = useMemo(() => {
    if (selectedFieldOfStudy === "Other" && form.field_of_study !== "Other") {
      return form.field_of_study ?? "";
    }
    return "";
  }, [selectedFieldOfStudy, form.field_of_study]);

  useEffect(() => {
    setForm(initialValue);
    setGpaInput(initialValue.gpa?.toString() ?? "");
    setEducations(initialValue.educations ?? []);
    setWorkExperiences(initialValue.work_experiences ?? []);
    setFormError("");
    setErrors({});
    setIsEditing(false);
  }, [initialValue]);

  const handleCancel = () => {
    setForm(initialValue);
    setGpaInput(initialValue.gpa?.toString() ?? "");
    setEducations(initialValue.educations ?? []);
    setWorkExperiences(initialValue.work_experiences ?? []);
    setFormError("");
    setErrors({});
    setIsEditing(false);
  };

  const baseInputClass = "w-full rounded-xl border px-4 py-3 text-sm font-bold shadow-sm outline-none transition-all";
  const editInputClass = "border-slate-200 bg-white text-zinc-900 hover:border-slate-300 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/10";
  const readInputClass = "border-slate-100 bg-slate-50 text-slate-600 cursor-not-allowed opacity-100";
  const inputClassName = `${baseInputClass} ${isEditing ? editInputClass : readInputClass}`;
  const selectClassName = `${inputClassName} pr-10 appearance-none`;
  const labelClass = "text-[10px] font-black uppercase text-slate-400 px-1 tracking-[0.15em] transition-colors";

  // Education helpers
  const addEducation = () => setEducations((prev) => [...prev, { ...EMPTY_EDUCATION }]);
  const removeEducation = (index: number) => setEducations((prev) => prev.filter((_, i) => i !== index));
  const updateEducation = (index: number, field: keyof Education, value: string | number | undefined) => {
    setEducations((prev) => prev.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)));
  };

  // Work experience helpers
  const addWorkExperience = () => setWorkExperiences((prev) => [...prev, { ...EMPTY_WORK_EXPERIENCE }]);
  const removeWorkExperience = (index: number) => setWorkExperiences((prev) => prev.filter((_, i) => i !== index));
  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string | boolean | undefined) => {
    setWorkExperiences((prev) => prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)));
  };

  // Tab config
  const goalsFields = ["target_country", "degree_level", "field_of_study"];
  const historyFields = ["passout_year", "gpa", "ielts_score"];
  const docsFields = ["resume_url"];

  return (
    <form
      className="space-y-8 animate-in fade-in duration-500 pb-20"
      onSubmit={async (event) => {
        event.preventDefault();
        try {
          setFormError("");
          const formToValidate = { ...form };

          formToValidate.passout_year = formToValidate.passout_year ?? undefined;
          formToValidate.ielts_score = formToValidate.ielts_score ?? undefined;

          formToValidate.gender = initialValue.gender;
          formToValidate.date_of_birth = initialValue.date_of_birth;
          formToValidate.country = initialValue.country || "";

          const normalizedResumeUrl = (formToValidate.resume_url ?? "").trim();
          formToValidate.resume_url = normalizedResumeUrl === "" ? undefined : normalizedResumeUrl;

          if (formToValidate.field_of_study === "Other") {
            formToValidate.field_of_study = "";
          }

          if (gpaInput.trim() === "") {
            formToValidate.gpa = undefined;
          } else {
            const parsedGpa = Number.parseFloat(gpaInput);
            formToValidate.gpa = Number.isNaN(parsedGpa) ? undefined : parsedGpa;
          }

          // Clean educations: filter out empty entries
          const cleanedEducations = educations.filter((e) => e.institution_name.trim() || e.degree.trim());
          // Clean work experiences: filter out empty entries
          const cleanedWorkExperiences = workExperiences.filter((w) => w.company_name.trim() || w.job_title.trim());

          formToValidate.educations = cleanedEducations;
          formToValidate.work_experiences = cleanedWorkExperiences;

          const payload = profileSchema.parse(formToValidate) as Profile;
          setErrors({});

          await onSubmit(payload);
        } catch (error) {
          if (error instanceof ZodError) {
            const nextErrors = zodErrors(error);
            setErrors(nextErrors);
            setFormError("Profile was not saved. Fix the highlighted field and try again.");
          }
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900">Build your fit profile</h2>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 rounded-xl bg-zinc-950 text-white text-sm font-semibold shadow-sm transition-all hover:bg-zinc-800 active:scale-95"
          >
            Edit Profile
          </button>
        )}
      </div>

      {formError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
          {formError}
        </div>
      ) : null}

      {/* Tab Bar */}
      {(() => {
        const hasHistoryErrors = historyFields.some((f) => errors[f]);
        const hasGoalsErrors = goalsFields.some((f) => errors[f]);
        const hasDocsErrors = docsFields.some((f) => errors[f]);
        return (
          <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "history"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Academic History
              {hasHistoryErrors && activeTab !== "history" && (
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("goals")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "goals"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Goals
              {hasGoalsErrors && activeTab !== "goals" && (
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("documents")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "documents"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Documents
              {hasDocsErrors && activeTab !== "documents" && (
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              )}
            </button>
          </div>
        );
      })()}

      {/* Academic History Tab */}
      {activeTab === "history" && (
      <div className="animate-in fade-in duration-300 space-y-6">
      {/* Academic Details Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex items-center gap-3 bg-zinc-50/50 border-b border-zinc-100">
          <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
             <HiOutlineAcademicCap className="w-5 h-5 text-zinc-950" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Academic Details</h3>
        </div>
        <div className="p-6 md:p-8 grid gap-x-8 gap-y-6 md:grid-cols-2">
          <div className={`space-y-1.5 transition-colors ${isEditing ? 'focus-within:text-zinc-950' : ''}`}>
            <label className={labelClass}>Passout Year</label>
            <input
              className={inputClassName}
              type="number"
              disabled={!isEditing}
              value={form.passout_year ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  passout_year: event.target.value ? Number(event.target.value) : undefined,
                }))
              }
              placeholder="e.g. 2024"
            />
            {errors.passout_year ? <span className="block text-sm text-red-700 font-medium px-1 mt-1">{errors.passout_year}</span> : null}
          </div>

          <div className={`space-y-1.5 transition-colors ${isEditing ? 'focus-within:text-zinc-950' : ''}`}>
            <label className={labelClass}>GPA</label>
            <input
              className={inputClassName}
              type="text"
              inputMode="decimal"
              disabled={!isEditing}
              value={gpaInput}
              onChange={(event) => {
                const nextValue = event.target.value;
                if (nextValue !== "" && !/^\d*\.?\d{0,2}$/.test(nextValue)) return;
                setGpaInput(nextValue);

                if (nextValue === "") {
                  setForm((current) => ({ ...current, gpa: undefined }));
                  return;
                }
                const value = Number.parseFloat(nextValue);
                if (Number.isNaN(value) || !Number.isFinite(value)) return;
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
                const clampedValue = Math.round(Math.min(10, Math.max(0, value)) * 100) / 100;
                setGpaInput(clampedValue.toString());
                setForm((current) => ({ ...current, gpa: clampedValue }));
              }}
              placeholder="e.g. 3.8 or 9.0"
            />
            {errors.gpa ? <span className="block text-sm text-red-700 font-medium px-1 mt-1">{errors.gpa}</span> : null}
          </div>

          <div className={`space-y-1.5 transition-colors ${isEditing ? 'focus-within:text-zinc-950' : ''}`}>
            <label className={labelClass}>IELTS Score</label>
            <div className="relative group">
              <select
                className={selectClassName}
                disabled={!isEditing}
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
                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((b) => (
                  <option key={b} value={b}>Band {b}</option>
                ))}
              </select>
              <HiOutlineChevronDown className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${isEditing ? 'text-slate-400 group-hover:text-slate-600' : 'text-slate-300'}`} />
            </div>
            {errors.ielts_score ? <span className="block text-sm text-red-700 font-medium px-1 mt-1">{errors.ielts_score}</span> : null}
          </div>
        </div>
      </div>

      {/* Previous Education Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex items-center justify-between bg-zinc-50/50 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
              <HiOutlineAcademicCap className="w-5 h-5 text-zinc-950" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Previous Education</h3>
          </div>
          {isEditing && (
            <button
              type="button"
              onClick={addEducation}
              className="px-4 py-2 rounded-lg bg-zinc-950 text-white text-xs font-semibold shadow-sm transition-all hover:bg-zinc-800 active:scale-95"
            >
              + Add Education
            </button>
          )}
        </div>
        <div className="p-6 md:p-8">
          {educations.length === 0 ? (
            <p className="text-sm text-slate-400 font-medium">
              {isEditing ? "Click \"+ Add Education\" to add your previous studies." : "No previous education added yet."}
            </p>
          ) : (
            <div className="space-y-6">
              {educations.map((edu, index) => (
                <div key={index} className="relative border border-zinc-100 rounded-xl p-5 space-y-4">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <HiOutlineXMark className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className={labelClass}>Institution Name</label>
                      <input
                        className={inputClassName}
                        type="text"
                        disabled={!isEditing}
                        value={edu.institution_name}
                        onChange={(e) => updateEducation(index, "institution_name", e.target.value)}
                        placeholder="e.g. University of Oxford"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Degree</label>
                      <div className="relative group">
                        <select
                          className={selectClassName}
                          disabled={!isEditing}
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, "degree", e.target.value)}
                        >
                          <option value="">Select degree</option>
                          <option value="High School">High School</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Associate">Associate</option>
                          <option value="Bachelors">Bachelors</option>
                          <option value="Masters">Masters</option>
                          <option value="PhD">PhD</option>
                          <option value="Postdoctoral">Postdoctoral</option>
                        </select>
                        <HiOutlineChevronDown className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${isEditing ? 'text-slate-400 group-hover:text-slate-600' : 'text-slate-300'}`} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Field of Study</label>
                      <input
                        className={inputClassName}
                        type="text"
                        disabled={!isEditing}
                        value={edu.field_of_study ?? ""}
                        onChange={(e) => updateEducation(index, "field_of_study", e.target.value)}
                        placeholder="e.g. Computer Science"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Start Year</label>
                      <input
                        className={inputClassName}
                        type="number"
                        disabled={!isEditing}
                        value={edu.start_year ?? ""}
                        onChange={(e) => updateEducation(index, "start_year", e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="e.g. 2018"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>End Year</label>
                      <input
                        className={inputClassName}
                        type="number"
                        disabled={!isEditing}
                        value={edu.end_year ?? ""}
                        onChange={(e) => updateEducation(index, "end_year", e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="e.g. 2022"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>GPA</label>
                      <input
                        className={inputClassName}
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        disabled={!isEditing}
                        value={edu.gpa ?? ""}
                        onChange={(e) => updateEducation(index, "gpa", e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="e.g. 3.8"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Country</label>
                      <div className="relative group">
                        <select
                          className={selectClassName}
                          disabled={!isEditing}
                          value={edu.country ?? ""}
                          onChange={(e) => updateEducation(index, "country", e.target.value)}
                        >
                          <option value="">Select country</option>
                          {COUNTRIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <HiOutlineChevronDown className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${isEditing ? 'text-slate-400 group-hover:text-slate-600' : 'text-slate-300'}`} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>City</label>
                      <input
                        className={inputClassName}
                        type="text"
                        disabled={!isEditing}
                        value={edu.city ?? ""}
                        onChange={(e) => updateEducation(index, "city", e.target.value)}
                        placeholder="e.g. Lahore"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className={labelClass}>Achievements / Honors</label>
                      <textarea
                        className={`${inputClassName} resize-none`}
                        rows={2}
                        disabled={!isEditing}
                        value={edu.achievements ?? ""}
                        onChange={(e) => updateEducation(index, "achievements", e.target.value)}
                        placeholder="e.g. Dean's List, Graduated with Honors"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
      )}

      {/* Goals & Aspirations Tab */}
      {activeTab === "goals" && (
      <div className="animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex items-center gap-3 bg-zinc-50/50 border-b border-zinc-100">
          <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
             <HiOutlineGlobeAlt className="w-5 h-5 text-zinc-950" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Goals & Aspirations</h3>
        </div>
        <div className="p-6 md:p-8 grid gap-x-8 gap-y-6 md:grid-cols-2">

          <div className={`space-y-1.5 transition-colors ${isEditing ? 'focus-within:text-zinc-950' : ''}`}>
            <label className={labelClass}>Target Country</label>
            <input
              className={inputClassName}
              type="text"
              list="target-country-options"
              disabled={!isEditing}
              value={String(form.target_country ?? "")}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  target_country: event.target.value,
                }))
              }
              placeholder="e.g. USA"
              autoComplete="off"
            />
            <datalist id="target-country-options">
              {COUNTRIES.map((country) => (
                <option key={country} value={country} />
              ))}
            </datalist>
            {errors.target_country ? <span className="block text-sm text-red-700 font-medium px-1 mt-1">{errors.target_country}</span> : null}
          </div>

          <div className={`space-y-1.5 transition-colors ${isEditing ? 'focus-within:text-zinc-950' : ''}`}>
            <label className={labelClass}>Next Study Level</label>
            <div className="relative group">
              <select
                className={selectClassName}
                disabled={!isEditing}
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
              <HiOutlineChevronDown className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${isEditing ? 'text-slate-400 group-hover:text-slate-600' : 'text-slate-300'}`} />
            </div>
            {errors.degree_level ? <span className="block text-sm text-red-700 font-medium px-1 mt-1">{errors.degree_level}</span> : null}
          </div>

          <div className={`space-y-1.5 transition-colors md:col-span-2 ${isEditing ? 'focus-within:text-zinc-950' : ''}`}>
            <label className={labelClass}>Field of Study / Major</label>
            <div className="relative group">
              <select
                className={selectClassName}
                disabled={!isEditing}
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
              <HiOutlineChevronDown className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${isEditing ? 'text-slate-400 group-hover:text-slate-600' : 'text-slate-300'}`} />
            </div>
            {errors.field_of_study ? <span className="block text-sm text-red-700 font-medium px-1 mt-1">{errors.field_of_study}</span> : null}
          </div>

          {selectedFieldOfStudy === "Other" ? (
            <div className={`space-y-1.5 transition-colors md:col-span-2 ${isEditing ? 'focus-within:text-zinc-950' : ''}`}>
              <label className={labelClass}>Specify Other Field</label>
              <input
                className={inputClassName}
                type="text"
                disabled={!isEditing}
                value={otherFieldOfStudy}
                onChange={(event) => {
                  const value = event.target.value;
                  setForm((current) => ({
                    ...current,
                    field_of_study: value || "Other",
                  }));
                }}
                placeholder="Enter your custom field of study"
              />
            </div>
          ) : null}
        </div>
      </div>
      </div>
      )}

      {/* Documents Tab */}
      {activeTab === "documents" && (
      <div className="animate-in fade-in duration-300 space-y-6">
      {/* Resume Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex items-center gap-3 bg-zinc-50/50 border-b border-zinc-100">
          <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
             <HiOutlineDocumentCheck className="w-5 h-5 text-zinc-950" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Supporting Documents</h3>
        </div>
        <div className="p-6 md:p-8">
          <div className={`space-y-1.5 transition-colors max-w-2xl ${isEditing ? 'focus-within:text-zinc-950' : ''}`}>
            <label className={labelClass}>Resume / CV URL</label>
            <input
              className={inputClassName}
              type="url"
              disabled={!isEditing}
              value={form.resume_url ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  resume_url: event.target.value,
                }))
              }
              placeholder="https://link-to-your-resume.pdf"
            />
            {errors.resume_url ? <span className="block text-sm text-red-700 font-medium px-1 mt-1">{errors.resume_url}</span> : null}
            <p className="px-1 text-xs text-slate-400 font-medium mt-1">Provide a direct link via Google Drive, Dropbox, etc.</p>
          </div>
        </div>
      </div>

      {/* Work Experience Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex items-center justify-between bg-zinc-50/50 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
              <HiOutlineDocumentCheck className="w-5 h-5 text-zinc-950" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Work Experience</h3>
          </div>
          {isEditing && (
            <button
              type="button"
              onClick={addWorkExperience}
              className="px-4 py-2 rounded-lg bg-zinc-950 text-white text-xs font-semibold shadow-sm transition-all hover:bg-zinc-800 active:scale-95"
            >
              + Add Experience
            </button>
          )}
        </div>
        <div className="p-6 md:p-8">
          {workExperiences.length === 0 ? (
            <p className="text-sm text-slate-400 font-medium">
              {isEditing ? "Click \"+ Add Experience\" to add your work experience." : "No work experience added yet."}
            </p>
          ) : (
            <div className="space-y-6">
              {workExperiences.map((exp, index) => (
                <div key={index} className="relative border border-zinc-100 rounded-xl p-5 space-y-4">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeWorkExperience(index)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <HiOutlineXMark className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className={labelClass}>Company Name</label>
                      <input
                        className={inputClassName}
                        type="text"
                        disabled={!isEditing}
                        value={exp.company_name}
                        onChange={(e) => updateWorkExperience(index, "company_name", e.target.value)}
                        placeholder="e.g. Google"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Job Title</label>
                      <input
                        className={inputClassName}
                        type="text"
                        disabled={!isEditing}
                        value={exp.job_title}
                        onChange={(e) => updateWorkExperience(index, "job_title", e.target.value)}
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Employment Type</label>
                      <div className="relative group">
                        <select
                          className={selectClassName}
                          disabled={!isEditing}
                          value={exp.employment_type ?? ""}
                          onChange={(e) => updateWorkExperience(index, "employment_type", e.target.value || undefined)}
                        >
                          <option value="">Select type</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Internship">Internship</option>
                          <option value="Contract">Contract</option>
                        </select>
                        <HiOutlineChevronDown className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${isEditing ? 'text-slate-400 group-hover:text-slate-600' : 'text-slate-300'}`} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Location</label>
                      <input
                        className={inputClassName}
                        type="text"
                        disabled={!isEditing}
                        value={exp.location ?? ""}
                        onChange={(e) => updateWorkExperience(index, "location", e.target.value)}
                        placeholder="e.g. Mountain View, CA"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Start Date</label>
                      <input
                        className={inputClassName}
                        type="month"
                        disabled={!isEditing}
                        value={exp.start_date ?? ""}
                        onChange={(e) => updateWorkExperience(index, "start_date", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>End Date</label>
                      <input
                        className={inputClassName}
                        type="month"
                        disabled={!isEditing || exp.is_current}
                        value={exp.is_current ? "" : (exp.end_date ?? "")}
                        onChange={(e) => updateWorkExperience(index, "end_date", e.target.value)}
                      />
                      {isEditing && (
                        <label className="flex items-center gap-2 px-1 mt-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exp.is_current ?? false}
                            onChange={(e) => {
                              updateWorkExperience(index, "is_current", e.target.checked);
                              if (e.target.checked) updateWorkExperience(index, "end_date", "");
                            }}
                            className="rounded border-slate-300 text-zinc-950 focus:ring-zinc-950/20"
                          />
                          <span className="text-xs font-semibold text-slate-500">Currently working here</span>
                        </label>
                      )}
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className={labelClass}>Description</label>
                      <textarea
                        className={`${inputClassName} resize-none`}
                        rows={3}
                        disabled={!isEditing}
                        value={exp.description ?? ""}
                        onChange={(e) => updateWorkExperience(index, "description", e.target.value)}
                        placeholder="Describe your responsibilities and achievements..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
      )}

      {isEditing && (
        <div className="flex justify-end pt-2 gap-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-6 py-3.5 rounded-xl border border-slate-200 bg-white text-zinc-900 text-sm font-bold shadow-sm transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 rounded-xl bg-zinc-950 text-white text-sm font-black shadow-sm transition-all hover:bg-zinc-800 active:scale-95 disabled:opacity-60 flex items-center justify-center min-w-[160px]"
          >
            {loading ? "Saving Profile..." : "Save Changes"}
          </button>
        </div>
      )}
    </form>
  );
}
