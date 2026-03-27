"use client";

import Link from "next/link";
import { useState } from "react";
import { ZodError } from "zod";

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isSignup = mode === "sign-up";

  return (
    <section className="w-full rounded-xl border border-slate-900/6 bg-white/90 p-8 shadow-md backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-zinc-500/70">
        {isSignup ? "Create account" : "Welcome back"}
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-zinc-950">
        {isSignup ? "Create your Scholr workspace" : "Sign in to Scholr"}
      </h1>
      <p className="mt-3 text-base leading-7 text-slate-600">
        {isSignup
          ? "Set up your student profile, track scholarship fit, and unlock AI-guided application workflows."
          : "Access your dashboard, fit analysis, and application-ready scholarship shortlist."}
      </p>

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
          <div>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-[#faf7f2] px-4 py-3 outline-none transition focus:border-[#9a3412] focus:bg-white"
              placeholder="Full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
            {fieldErrors.full_name ? <p className="mt-2 text-sm text-red-700">{fieldErrors.full_name}</p> : null}
          </div>
        ) : null}

        <div>
          <input
            type="email"
            className="w-full rounded-2xl border border-slate-200 bg-[#faf7f2] px-4 py-3 outline-none transition focus:border-[#9a3412] focus:bg-white"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {fieldErrors.email ? <p className="mt-2 text-sm text-red-700">{fieldErrors.email}</p> : null}
        </div>

        <div>
          <input
            type="password"
            className="w-full rounded-2xl border border-slate-200 bg-[#faf7f2] px-4 py-3 outline-none transition focus:border-[#9a3412] focus:bg-white"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {fieldErrors.password ? <p className="mt-2 text-sm text-red-700">{fieldErrors.password}</p> : null}
        </div>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? "Working..." : isSignup ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        {isSignup ? "Already have an account?" : "Need an account?"}{" "}
        <Link href={isSignup ? "/sign-in" : "/sign-up"} className="font-semibold text-zinc-950">
          {isSignup ? "Sign in" : "Create one"}
        </Link>
      </p>
    </section>
  );
}
