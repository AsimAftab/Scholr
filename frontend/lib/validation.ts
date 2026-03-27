import { z } from "zod";

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
  country: z.string().trim().min(2, "Country is required."),
  target_country: z.string().trim().min(2, "Target country is required."),
  degree: z.string().trim().min(2, "Degree is required."),
  major: z.string().trim().min(2, "Major is required.").optional().or(z.literal("")),
  passout_year: z.number().int().min(1900, "Invalid year.").max(2100, "Invalid year.").optional().or(z.nan()),
  gpa: z.number().min(0, "GPA must be at least 0.").max(4, "GPA must be 4.0 or below."),
  ielts_score: z.number().min(0, "IELTS score must be at least 0.").max(9, "IELTS score must be 9.0 or below."),
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
