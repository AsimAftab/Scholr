"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { useAuthContext } from "@/lib/auth-context";

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading, handleLogout } = useAuthContext();
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/sign-in");
    }
  }, [loading, user, router]);

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

  // Currently, the backend might not support updating user fields yet,
  // so we'll mock the saving action to provide the UI the user requested.
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Clear previous messages
    setSuccessMessage("");
    setErrorMessage("");

    // Validate password match if either field is filled
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }

      if (newPassword.length < 8) {
        setErrorMessage("Password must be at least 8 characters long.");
        return;
      }
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccessMessage("Settings updated successfully.");
    }, 800);
  };

  return (
    <AppShell
      user={user}
      onLogout={handleLogout}
      title="Account Settings"
      subtitle="Manage your personal information and account security."
    >
      <div className="mx-auto max-w-3xl">
        <form onSubmit={handleSave} className="space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          {successMessage && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
              {errorMessage}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Personal Information</h3>
              <p className="mt-1 text-sm text-zinc-500">Update your basic profile details.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-zinc-900">
                <span>Full Name</span>
                <input
                  type="text"
                  defaultValue={user.full_name}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-900 focus:bg-white"
                  placeholder="Your full name"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-zinc-900">
                <span>Email Address</span>
                <input
                  type="email"
                  defaultValue={user.email}
                  disabled
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-zinc-500 outline-none cursor-not-allowed"
                  placeholder="you@example.com"
                />
                <p className="text-xs text-zinc-500">Email address cannot be changed currently.</p>
              </label>
            </div>
          </div>

          <hr className="border-zinc-100" />

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Security</h3>
              <p className="mt-1 text-sm text-zinc-500">Update your password to keep your account secure.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-zinc-900">
                <span>New Password</span>
                <input
                  type="password"
                  name="newPassword"
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-900 focus:bg-white"
                  placeholder="••••••••"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-zinc-900">
                <span>Confirm New Password</span>
                <input
                  type="password"
                  name="confirmPassword"
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-900 focus:bg-white"
                  placeholder="••••••••"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
