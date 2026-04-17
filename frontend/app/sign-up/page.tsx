"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { AuthForm } from "@/components/auth-form";
import { useAuthContext } from "@/lib/auth-context";

export default function SignUpPage() {
  const router = useRouter();
  const { user, handleSignup } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.replace(user.profile ? "/dashboard" : "/profile");
    }
  }, [router, user]);

  return (
    <main className="flex min-h-screen">
      {/* Left Panel: Visual/Branding */}
      <div className="relative hidden lg:block lg:w-[60%]">
        <Image
          src="/auth-bg.png"
          alt="Scholr Registration"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-zinc-950/20 backdrop-brightness-75" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl font-black tracking-tighter">SCHOLR.</span>
          </Link>
          <div className="max-w-md">
            <h2 className="text-4xl font-extrabold tracking-tight">
              Start your journey today.
            </h2>
            <p className="mt-4 text-lg text-zinc-200">
              Join thousands of students finding and securing scholarships with AI. Create your profile, track potential matches, and unlock success.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:w-[40%] lg:px-20 xl:px-32 bg-zinc-100/30">
        <div className="mx-auto w-full max-w-[480px]">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tighter text-zinc-950">SCHOLR.</span>
            </Link>
          </div>
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
                router.push("/profile");
              } catch (authError) {
                setError(authError instanceof Error ? authError.message : "Unable to create your account.");
              } finally {
                setLoading(false);
              }
            }}
          />
        </div>
      </div>
    </main>
  );
}
