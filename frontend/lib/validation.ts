import { z } from "zod";

import { COUNTRIES } from "@/lib/countries";

const countrySet = new Set(COUNTRIES);

// Dynamic validation bounds
const MAX_PASSOUT_YEAR = new Date().getFullYear() + 10;

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must be 128 characters or fewer.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character.");

export const signupSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  full_name: z.string().trim().min(2, "Full name must be at least 2 characters."),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(128, "Password must be 128 characters or fewer."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }
  });

export const editProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters."),
  gender: z.string().trim(),
  dateOfBirth: z
    .string()
    .trim()
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), "Invalid date."),
  country: z
    .string()
    .trim()
    .min(2, "Country is required.")
    .refine((value) => countrySet.has(value as (typeof COUNTRIES)[number]), "Select a valid country from the list."),
  gpa: z.number().min(0, "GPA must be at least 0.").max(10, "GPA must be 10.0 or below."),
});

export const educationSchema = z.object({
  institution_name: z.string().trim().min(1, "Institution name is required.").max(255),
  degree: z.string().trim().min(1, "Degree is required.").max(120),
  field_of_study: z.string().trim().max(120).optional().or(z.literal("")),
  start_year: z.number().int().min(1900).max(2100).optional(),
  end_year: z.number().int().min(1900).max(2100).optional(),
  gpa: z.number().min(0).max(10).optional(),
  country: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  achievements: z.string().optional().or(z.literal("")),
});

export const workExperienceSchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required.").max(255),
  job_title: z.string().trim().min(1, "Job title is required.").max(255),
  start_date: z.string().trim().max(50).optional().or(z.literal("")),
  end_date: z.string().trim().max(50).optional().or(z.literal("")),
  is_current: z.boolean().optional(),
  employment_type: z.enum(["Full-time", "Part-time", "Internship", "Contract"]).optional().or(z.literal("").transform(() => undefined)),
  location: z.string().trim().max(255).optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

export const profileSchema = z.object({
  country: z
    .string()
    .trim()
    .optional(),
  target_country: z
    .string()
    .trim()
    .min(2, "Target country is required.")
    .refine((value) => countrySet.has(value as (typeof COUNTRIES)[number]), "Select a valid country from the list."),
  degree_level: z.enum(["Bachelors", "Masters", "PhD"], {
    errorMap: (issue) => ({
      message: issue.code === "invalid_enum_value"
        ? "Select a valid degree level."
        : "Degree level is required.",
    }),
  }),
  field_of_study: z.string().trim().min(2, "Field of study is required."),
  passout_year: z
    .number()
    .int()
    .min(1900, "Year must be 1900 or later.")
    .max(MAX_PASSOUT_YEAR, `Year cannot be more than 10 years in the future (${MAX_PASSOUT_YEAR}).`)
    .optional(),
  gpa: z.number().min(0, "GPA must be at least 0.").max(10, "GPA must be 10.0 or below."),
  ielts_score: z.number().min(0, "IELTS score must be at least 0.").max(9, "IELTS score must be 9.0 or below.").optional(),
  gender: z.string().optional(),
  date_of_birth: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), "Invalid date.")
    .optional(),
  resume_url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  educations: z.array(educationSchema).optional(),
  work_experiences: z.array(workExperienceSchema).optional(),
});

export type FieldErrors = Record<string, string>;

export function zodErrors(error: z.ZodError): FieldErrors {
  const flattened = error.flatten().fieldErrors;
  return Object.fromEntries(
    Object.entries(flattened)
      .filter(([, value]) => value && value.length > 0)
      .map(([key, value]) => [key, value?.[0] ?? "Invalid value"])
  );
}
