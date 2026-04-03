"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { updateAccountSettings } from "@/lib/api";
import { useAuthContext } from "@/lib/auth-context";

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading, handleLogout, setUser } = useAuthContext();
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [fullName, setFullName] = useState(user?.full_name || "");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/sign-in");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
    }
  }, [user]);

  useEffect(() => {
    if (!newPassword && !confirmPassword) {
      setPasswordError("");
      return;
    }

    if (newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match.");
      } else if (newPassword.length < 8) {
        setPasswordError("Password must be at least 8 characters long.");
      } else {
        setPasswordError("");
      }
    } else if (confirmPassword && newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
    } else {
      setPasswordError("");
    }
  }, [newPassword, confirmPassword]);

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
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (saving) {
      return;
    }

    // Clear previous messages
    setSuccessMessage("");
    setErrorMessage("");

    // Validate full name if changed
    const fullNameChanged = fullName !== user?.full_name;
    if (fullNameChanged && fullName.trim().length < 2) {
      setErrorMessage("Full name must be at least 2 characters long.");
      return;
    }

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

    // Prepare payload
    const payload: Record<string, unknown> = {};

    // Include full name if changed
    if (fullNameChanged) {
      payload.full_name = fullName.trim();
    }

    // Include password if provided
    if (newPassword) {
      payload.new_password = newPassword;
    }

    if (Object.keys(payload).length === 0) {
      setSuccessMessage("No changes to save.");
      return;
    }

    setSaving(true);
    try {
      const updatedUser = await updateAccountSettings(payload as { full_name?: string; new_password?: string });
      setUser(updatedUser);
      setFullName(updatedUser.full_name);
      setSuccessMessage("Settings updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
    } catch (saveError) {
      setErrorMessage(saveError instanceof Error ? saveError.message : "Unable to update settings.");
    } finally {
      setSaving(false);
    }
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
            <div
              role="status"
              aria-live="polite"
              className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800"
            >
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"
            >
              {errorMessage}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Personal Information</h3>
              <p className="mt-1 text-sm text-zinc-500">Update your basic profile details.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label htmlFor="full-name-input" className="space-y-2 text-sm font-medium text-zinc-900">
                <span>Full Name</span>
                <input
                  id="full-name-input"
                  type="text"
                  name="full_name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  aria-label="Full Name"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-900 focus:bg-white"
                  placeholder="Your full name"
                />
              </label>

              <label htmlFor="email-input" className="space-y-2 text-sm font-medium text-zinc-900">
                <span>Email Address</span>
                <input
                  id="email-input"
                  type="email"
                  name="email"
                  defaultValue={user.email}
                  disabled
                  aria-label="Email Address"
                  aria-describedby="email-help"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-zinc-500 outline-none cursor-not-allowed"
                  placeholder="you@example.com"
                />
                <p id="email-help" className="text-xs text-zinc-500">Email address cannot be changed currently.</p>
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
              <label htmlFor="new-password-input" className="space-y-2 text-sm font-medium text-zinc-900">
                <span>New Password</span>
                <input
                  id="new-password-input"
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  aria-label="New Password"
                  aria-invalid={passwordError ? "true" : "false"}
                  aria-describedby={passwordError ? "password-error" : undefined}
                  className={`w-full rounded-xl border bg-zinc-50 px-4 py-3 outline-none transition focus:bg-white ${
                    passwordError
                      ? "border-red-300 focus:border-red-500"
                      : "border-zinc-200 focus:border-zinc-900"
                  }`}
                  placeholder="••••••••"
                />
              </label>

              <label htmlFor="confirm-password-input" className="space-y-2 text-sm font-medium text-zinc-900">
                <span>Confirm New Password</span>
                <input
                  id="confirm-password-input"
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  aria-label="Confirm New Password"
                  aria-invalid={passwordError ? "true" : "false"}
                  aria-describedby={passwordError ? "password-error" : undefined}
                  className={`w-full rounded-xl border bg-zinc-50 px-4 py-3 outline-none transition focus:bg-white ${
                    passwordError
                      ? "border-red-300 focus:border-red-500"
                      : "border-zinc-200 focus:border-zinc-900"
                  }`}
                  placeholder="••••••••"
                />
                {passwordError && (
                  <p id="password-error" role="alert" aria-live="assertive" className="text-sm text-red-600">
                    {passwordError}
                  </p>
                )}
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
