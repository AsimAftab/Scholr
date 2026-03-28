import { z } from "zod";

import { COUNTRIES } from "@/lib/countries";

const countrySet = new Set(COUNTRIES);

export const signupSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  full_name: z.string().trim().min(2, "Full name must be at least 2 characters."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(128, "Password must be 128 characters or fewer."),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(128, "Password must be 128 characters or fewer."),
});

export const profileSchema = z.object({
  country: z
    .string()
    .trim()
    .min(2, "Country is required.")
    .refine((value) => countrySet.has(value as (typeof COUNTRIES)[number]), "Select a valid country from the list."),
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
  gpa: z.number().min(0, "GPA must be at least 0.").max(4, "GPA must be 4.0 or below."),
  ielts_score: z.number().min(0, "IELTS score must be at least 0.").max(9, "IELTS score must be 9.0 or below."),
  gender: z.string().optional(),
  date_of_birth: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), "Invalid date.")
    .optional(),
  resume_url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
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
