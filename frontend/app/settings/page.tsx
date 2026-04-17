"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ZodError } from "zod";
import {
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlineUserCircle,
  HiOutlineAcademicCap,
  HiOutlineCalendar,
  HiOutlineCheck,
  HiOutlineChevronDown,
  HiOutlineXMark,
} from "react-icons/hi2";

import { AppShell } from "@/components/app-shell";
import { updateAccountSettings, createProfile } from "@/lib/api";
import { useAuthContext } from "@/lib/auth-context";
import { Profile } from "@/lib/types";
import { COUNTRIES } from "@/lib/countries";
import { editProfileSchema, changePasswordSchema, zodErrors } from "@/lib/validation";

import { InfoBlock } from "@/components/settings/info-block";
import { useToast } from "@/components/toast";

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading, handleLogout, setUser } = useAuthContext();
  const { showToast } = useToast();

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [country, setCountry] = useState("");
  const [gpa, setGpa] = useState<number | "">(0);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Password edit state
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const securityCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/sign-in");
  }, [loading, user, router]);

  if (loading || !user)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-600" />
      </div>
    );

  const initProfileForm = () => {
    setFullName(user.full_name ?? "");
    setGender(user.profile?.gender ?? "");
    setDateOfBirth(user.profile?.date_of_birth ?? "");
    setCountry(user.profile?.country ?? "");
    setGpa(user.profile?.gpa ?? 0);
    setProfileError("");

  };

  const handleEditProfile = () => {
    initProfileForm();
    setEditingProfile(true);
  };

  const handleCancelProfile = () => {
    setEditingProfile(false);
    setProfileError("");

  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user.profile) {
      setProfileError("Complete your academic profile first to enable settings updates.");
      showToast("Please finish your profile setup first.");
      router.push("/profile");
      return;
    }

    try {
      editProfileSchema.parse({ fullName, gender, dateOfBirth, country, gpa: gpa === "" ? 0 : Number(gpa) });
      setProfileError("");
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors = zodErrors(err);
        setProfileError(fieldErrors.fullName ?? fieldErrors.country ?? fieldErrors.dateOfBirth ?? "Invalid profile data.");
        return;
      }
      throw err;
    }

    setProfileSaving(true);
    try {
      const profilePayload: Partial<Profile> = { ...(user.profile || {}) };
      if (gender) profilePayload.gender = gender;
      if (dateOfBirth) profilePayload.date_of_birth = dateOfBirth;
      if (country) profilePayload.country = country;
      if (gpa !== undefined && gpa !== null) profilePayload.gpa = gpa === "" ? 0 : Number(gpa);

      const [, updatedProfile] = await Promise.all([
        updateAccountSettings({ full_name: fullName.trim() }),
        createProfile(profilePayload as Profile),
      ]);

      setUser({ ...user, full_name: fullName.trim(), profile: updatedProfile });
      setEditingProfile(false);
      showToast("Profile updated successfully.");
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleEditPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");

    setEditingPassword(true);
    setTimeout(() => {
      securityCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleCancelPassword = () => {
    setEditingPassword(false);
    setPasswordError("");

  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      changePasswordSchema.parse({ currentPassword, newPassword, confirmPassword });
      setPasswordError("");
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors = zodErrors(err);
        setPasswordError(fieldErrors.currentPassword ?? fieldErrors.newPassword ?? fieldErrors.confirmPassword ?? "Invalid password.");
        return;
      }
      throw err;
    }

    setPasswordSaving(true);
    try {
      await updateAccountSettings({ current_password: currentPassword, new_password: newPassword });
      setEditingPassword(false);
      showToast("Password updated successfully.");
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-zinc-900 focus:border-zinc-900 hover:border-slate-300 outline-none transition-all shadow-sm";
  const labelClass = "text-[10px] font-black uppercase text-slate-400 px-1 tracking-[0.15em]";

  return (
    <AppShell
      user={user}
      onLogout={handleLogout}
      title="Account Settings"
      subtitle="Manage your profile and security preferences."
    >
      <div className="mx-auto w-full max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Personal Information Card */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mt-6">
          {/* Header */}
          <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-100 rounded-xl flex flex-shrink-0 items-center justify-center">
                <HiOutlineUser className="w-5 h-5 text-zinc-950" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Personal Information</h2>
            </div>
            {!editingProfile ? (
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-950 text-white text-sm font-semibold shadow-sm transition-all hover:bg-zinc-800 active:scale-95"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleCancelProfile}
                type="button"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-200 bg-white text-zinc-700 text-sm font-semibold shadow-sm transition-all hover:bg-zinc-50 active:scale-95"
              >
                <HiOutlineXMark className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>

          <div className="h-px bg-zinc-100 mx-8" />

          {/* Content */}
          <div className="p-8">
            {!editingProfile ? (
              /* View Mode */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <InfoBlock icon={HiOutlineUser} label="Full Name" value={user.full_name} />
                <InfoBlock icon={HiOutlineEnvelope} label="Email Address" value={user.email} />
                <InfoBlock icon={HiOutlineUserCircle} label="Gender" value={user.profile?.gender} />
                <InfoBlock icon={HiOutlineCalendar} label="Date of Birth" value={user.profile?.date_of_birth} />
                <InfoBlock icon={HiOutlineGlobeAlt} label="Location" value={user.profile?.country} />
                <InfoBlock icon={HiOutlineAcademicCap} label="GPA" value={user.profile?.gpa?.toString()} />
              </div>
            ) : (
              /* Edit Mode */
              <form onSubmit={handleSaveProfile} className="space-y-5">
                {profileError && (
                  <div className="p-3 text-xs font-bold bg-rose-50 text-rose-600 rounded-xl border border-rose-100">{profileError}</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className={labelClass}>Email Address <span className="opacity-50 tracking-normal">(Read-only)</span></label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500 cursor-not-allowed outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className={labelClass}>Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputClass}
                      placeholder="Name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>Gender</label>
                    <div className="relative group">
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className={`${inputClass} pl-4 pr-10 appearance-none cursor-pointer`}
                      >
                        <option value="">Unspecified</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <HiOutlineChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>Date of Birth</label>
                    <div className="relative group">
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className={`${inputClass} pl-10 cursor-pointer custom-date-input`}
                      />
                      <HiOutlineCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
                    </div>
                    <style jsx>{`
                      .custom-date-input::-webkit-calendar-picker-indicator {
                        background: transparent;
                        bottom: 0;
                        color: transparent;
                        cursor: pointer;
                        height: auto;
                        left: 0;
                        position: absolute;
                        right: 0;
                        top: 0;
                        width: auto;
                      }
                    `}</style>
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>Location</label>
                    <div className="relative group">
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className={`${inputClass} pl-4 pr-10 appearance-none cursor-pointer`}
                      >
                        <option value="">Select country</option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <HiOutlineChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>GPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={gpa}
                      onChange={(e) => setGpa(e.target.value ? Number(e.target.value) : "")}
                      className={inputClass}
                      placeholder="e.g. 3.8 or 9.5"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="w-full py-3.5 rounded-xl bg-zinc-950 text-white text-sm font-bold hover:bg-zinc-800 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                >
                  {profileSaving ? (
                    <div className="h-4 w-4 rounded-full border-2 border-zinc-600 border-t-white animate-spin" />
                  ) : (
                    <HiOutlineCheck className="w-4 h-4" />
                  )}
                  {profileSaving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Security Card */}
        <div ref={securityCardRef} className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-100 rounded-xl flex flex-shrink-0 items-center justify-center">
                <HiOutlineLockClosed className="w-5 h-5 text-zinc-950" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Security</h2>
            </div>
            {!editingPassword ? (
              <button
                onClick={handleEditPassword}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-950 text-white text-sm font-semibold shadow-sm transition-all hover:bg-zinc-800 active:scale-95"
              >
                Change Password
              </button>
            ) : (
              <button
                onClick={handleCancelPassword}
                type="button"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-200 bg-white text-zinc-700 text-sm font-semibold shadow-sm transition-all hover:bg-zinc-50 active:scale-95"
              >
                <HiOutlineXMark className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>

          <div className="h-px bg-zinc-100 mx-8" />

          {/* Content */}
          <div className="p-8">
            {!editingPassword ? (
              /* View Mode */
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 shadow-sm">
                  <HiOutlineLockClosed className="h-5 w-5 text-slate-500" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-500 block text-[10px] uppercase tracking-[0.15em] mb-0.5">Password</span>
                  <span className="text-[#202224] font-bold text-sm tracking-tight">••••••••</span>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <form onSubmit={handleSavePassword} className="space-y-5">
                {passwordError && (
                  <div className="p-3 text-xs font-bold bg-rose-50 text-rose-600 rounded-xl border border-rose-100">{passwordError}</div>
                )}

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className={labelClass}>Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={inputClass}
                      placeholder="••••••••"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={inputClass}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={inputClass}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="w-full py-3.5 rounded-xl bg-zinc-950 text-white text-sm font-bold hover:bg-zinc-800 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                >
                  {passwordSaving ? (
                    <div className="h-4 w-4 rounded-full border-2 border-zinc-600 border-t-white animate-spin" />
                  ) : (
                    <HiOutlineCheck className="w-4 h-4" />
                  )}
                  {passwordSaving ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
