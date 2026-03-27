"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import { SiteShell } from "@/components/site-shell";
import { useAuthContext } from "@/lib/auth-context";

export default function SignUpPage() {
  const router = useRouter();
  const { user, handleSignup, handleLogout } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [router, user]);

  return (
    <>
      <SiteShell user={user} onLogout={handleLogout} />
      <main className="min-h-[calc(100vh-81px)] px-5 py-10 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <aside className="rounded-2xl border border-slate-900/6 bg-zinc-950 p-8 text-white shadow-md">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Get Started</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight">Find scholarships you actually qualify for.</h2>
            <div className="mt-8 space-y-4">
              <Benefit text="Get instant match scores based on your unique academic profile and background." />
              <Benefit text="Stop wasting time reading dense eligibility criteria. We extract the requirements for you." />
              <Benefit text="Use AI to generate custom essays and statements of purpose tailored to each application." />
            </div>
          </aside>

          <AuthForm
            mode="sign-up"
            loading={loading}
            error={error}
            onSubmit={async (payload) => {
              setLoading(true);
              setError("");
              try {
                await handleSignup({
                  email: payload.email,
                  password: payload.password,
                  full_name: payload.full_name ?? "",
                });
                router.push("/dashboard");
              } catch (authError) {
                setError(authError instanceof Error ? authError.message : "Unable to create your account.");
              } finally {
                setLoading(false);
              }
            }}
          />
        </div>
      </main>
    </>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-200">
      <p>{text}</p>
    </div>
  );
}
