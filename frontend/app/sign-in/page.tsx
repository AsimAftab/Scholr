"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import { SiteShell } from "@/components/site-shell";
import { useAuthContext } from "@/lib/auth-context";

export default function SignInPage() {
  const router = useRouter();
  const { user, handleLogin, handleLogout } = useAuthContext();
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
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-2xl border border-slate-900/6 bg-zinc-950 p-8 text-white shadow-md">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Welcome Back</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight">Pick up where you left off.</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Check your latest match scores, review new scholarship opportunities, and keep working on your application drafts.
            </p>
            <div className="mt-8 space-y-4">
              <PanelPoint title="Instant Fit Scores" copy="Stop guessing. See exactly how well you match with every scholarship." />
              <PanelPoint title="Your Academic Profile" copy="Update your GPA and IELTS scores to uncover new opportunities." />
              <PanelPoint title="AI Drafting" copy="Generate tailored essays and statements of purpose instantly." />
            </div>
          </aside>

          <AuthForm
            mode="sign-in"
            loading={loading}
            error={error}
            onSubmit={async (payload) => {
              setLoading(true);
              setError("");
              try {
                await handleLogin({ email: payload.email, password: payload.password });
                router.push("/dashboard");
              } catch (authError) {
                setError(authError instanceof Error ? authError.message : "Unable to sign in.");
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

function PanelPoint({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-300">{copy}</p>
    </div>
  );
}
