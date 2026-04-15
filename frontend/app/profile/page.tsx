"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { ProfileForm } from "@/components/profile-form";
import { useAuthContext } from "@/lib/auth-context";
import { createProfile } from "@/lib/api";
import { Profile } from "@/lib/types";
import { useToast } from "@/components/toast";

const defaultProfile: Profile = {
  country: "",
  target_country: "",
  degree_level: "Masters",
  field_of_study: "",
  passout_year: undefined,
  gpa: 0,
  ielts_score: 0,
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, error: authError, setUser, handleLogout } = useAuthContext();
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/sign-in");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user?.profile) {
      setProfile(user.profile);
    }
  }, [user]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="text-zinc-600">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppShell
      user={user}
      onLogout={handleLogout}
      title="Profile Setup"
      subtitle="Keep your profile up to date to get the most accurate scholarship match scores."
    >
      <div className="mx-auto max-w-3xl space-y-8">
        {(error || authError) && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
            {error || authError}
          </div>
        )}

        <ProfileForm
          initialValue={profile}
          loading={saving}
          onSubmit={async (nextProfile) => {
            setSaving(true);
            setError("");
            try {
              // Merge with existing profile to preserve fields not in current form state
              const mergedProfile = { ...profile, ...nextProfile };
              const saved = await createProfile(mergedProfile);
              setProfile(saved);
              setUser({ ...user, profile: saved });
              showToast("Profile saved successfully.");
              if (isMounted.current) {
                router.push("/dashboard");
              }
            } catch (saveError) {
              setError(saveError instanceof Error ? saveError.message : "Unable to save your profile.");
            } finally {
              setSaving(false);
            }
          }}
        />
      </div>
    </AppShell>
  );
}
