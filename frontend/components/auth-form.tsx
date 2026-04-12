"use client";

import Link from "next/link";
import { useState } from "react";
import { ZodError } from "zod";

import { 
  HiOutlineEnvelope, 
  HiOutlineLockClosed, 
  HiOutlineUserCircle,
  HiOutlineEye,
  HiOutlineEyeSlash
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

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-[2.5rem] border border-zinc-200/60 bg-white p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-950">
            {isSignup ? "Begin Your Journey" : "Welcome back"}
          </h1>
          <p className="mt-4 text-sm font-medium text-zinc-500 leading-relaxed">
            {isSignup
              ? "Unlock global opportunities with strategic AI matching."
              : "Securely access your personalized scholarship strategy."}
          </p>
        </div>

        <form
          className="mt-10 space-y-5"
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
              <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
              <div className="relative">
                <HiOutlineUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
                <input
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/30 pl-11 pr-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:bg-white focus:ring-1 focus:ring-zinc-950/10 placeholder:text-zinc-300"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                />
              </div>
              {fieldErrors.full_name ? <p className="mt-1 text-xs text-red-600">{fieldErrors.full_name}</p> : null}
            </div>
          ) : null}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
            <div className="relative">
              <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
              <input
                type="email"
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/30 pl-11 pr-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:bg-white focus:ring-1 focus:ring-zinc-950/10 placeholder:text-zinc-300"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            {fieldErrors.email ? <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p> : null}
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Password</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/30 pl-11 pr-12 py-3 text-sm outline-none transition focus:border-zinc-950 focus:bg-white focus:ring-1 focus:ring-zinc-950/10 placeholder:text-zinc-300"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <HiOutlineEye className="h-5 w-5" />
                ) : (
                  <HiOutlineEyeSlash className="h-5 w-5" />
                )}
              </button>
            </div>
            {fieldErrors.password ? <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p> : null}
          </div>

          {error ? (
            <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-2xl bg-zinc-950 px-5 py-4 text-sm font-bold text-white transition hover:bg-zinc-800 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 shadow-lg"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-1000 group-hover:translate-x-full" />
            
            <span className="relative z-10">
              {loading ? "Security check..." : isSignup ? "Create account" : "Sign in"}
            </span>
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-zinc-500 font-medium">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link href={isSignup ? "/sign-in" : "/sign-up"} className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
            {isSignup ? "Sign in" : "Create account"}
          </Link>
        </p>

        {/* Security Badge */}
        <div className="mt-10 flex items-center justify-center gap-2 border-t border-zinc-100 pt-8 opacity-60">
          <HiOutlineLockClosed className="h-3.5 w-3.5 text-zinc-400" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Secure & Encrypted</span>
        </div>
      </div>
    </div>
  );
}
