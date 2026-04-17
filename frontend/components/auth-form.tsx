"use client";

import Link from "next/link";
import { useState } from "react";
import { ZodError } from "zod";

import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineUserCircle,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowLeft
} from "react-icons/hi2";
import { loginSchema, signupSchema, zodErrors } from "@/lib/validation";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
  loading: boolean;
  error?: string;
  onSubmit: (payload: { email: string; password: string; full_name?: string }) => Promise<void>;
};

export function AuthForm({ mode, loading, error, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isSignup = mode === "sign-up";

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#ffffff_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#18181b]";
  const labelClass = "text-[11px] font-semibold uppercase tracking-wider text-zinc-500";

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 md:p-10 shadow-sm">
        <div className="text-center">
          <h1 className="text-[26px] font-semibold tracking-tight text-zinc-950">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {isSignup
              ? "Find and track scholarships that fit you."
              : "Sign in to continue your scholarship journey."}
          </p>
        </div>

        <form
          className="mt-8 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              if (isSignup) {
                const payload = signupSchema.parse({ email, full_name: fullName, password });
                setFieldErrors({});
                await onSubmit(payload);
              } else {
                const payload = loginSchema.parse({ email, password });
                setFieldErrors({});
                await onSubmit(payload);
              }
            } catch (validationError) {
              if (validationError instanceof ZodError) {
                setFieldErrors(zodErrors(validationError));
              }
            }
          }}
        >
          {isSignup ? (
            <div className="space-y-1.5">
              <label className={labelClass}>Full Name</label>
              <div className="relative">
                <HiOutlineUserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
                <input
                  className={inputClass}
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                />
              </div>
              {fieldErrors.full_name ? <p className="text-xs text-red-600">{fieldErrors.full_name}</p> : null}
            </div>
          ) : null}

          <div className="space-y-1.5">
            <label className={labelClass}>Email Address</label>
            <div className="relative">
              <HiOutlineEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
              <input
                type="email"
                className={inputClass}
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            {fieldErrors.email ? <p className="text-xs text-red-600">{fieldErrors.email}</p> : null}
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Password</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
              <input
                type={showPassword ? "text" : "password"}
                className={`${inputClass} pr-11`}
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <HiOutlineEye className="h-4 w-4" />
                ) : (
                  <HiOutlineEyeSlash className="h-4 w-4" />
                )}
              </button>
            </div>
            {fieldErrors.password ? <p className="text-xs text-red-600">{fieldErrors.password}</p> : null}
          </div>

          {error ? (
            <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 active:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (isSignup ? "Creating account..." : "Signing in...") : isSignup ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link href={isSignup ? "/sign-in" : "/sign-up"} className="font-semibold text-zinc-900 hover:text-zinc-700 transition-colors">
            {isSignup ? "Sign in" : "Create account"}
          </Link>
        </p>

        <div className="mt-4 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <HiOutlineArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
