"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  HiOutlineUser, 
  HiOutlineLockClosed, 
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlineUserCircle,
  HiOutlineAcademicCap,
  HiOutlineCalendar,
} from "react-icons/hi2";

import { AppShell } from "@/components/app-shell";
import { updateAccountSettings, createProfile } from "@/lib/api";
import { useAuthContext } from "@/lib/auth-context";
import { Profile } from "@/lib/types";

// Modular Components
import { InfoBlock } from "@/components/settings/info-block";
import { EditProfileModal } from "@/components/settings/edit-profile-modal";
import { ChangePasswordModal } from "@/components/settings/change-password-modal";

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading, handleLogout, setUser } = useAuthContext();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/sign-in");
  }, [loading, user, router]);

  if (loading || !user) return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-blue-500"></div></div>;

  const handleSaveProfile = async (data: { fullName: string; gender: string; dateOfBirth: string; country: string; gpa: number }) => {
    const profilePayload: Partial<Profile> = {
      ...(user.profile || {})
    };
    if (data.gender) profilePayload.gender = data.gender;
    if (data.dateOfBirth) profilePayload.date_of_birth = data.dateOfBirth;
    if (data.country) profilePayload.country = data.country;
    if (data.gpa !== undefined && data.gpa !== null) profilePayload.gpa = data.gpa;

    const [_, updatedProfile] = await Promise.all([
      updateAccountSettings({ full_name: data.fullName.trim() }),
      createProfile(profilePayload as Profile)
    ]);

    setUser({ ...user, full_name: data.fullName.trim(), profile: updatedProfile });
  };

  const name = user.full_name || "Unknown User";

  return (
    <AppShell 
      user={user} 
      onLogout={handleLogout} 
      title="Account Settings"
      subtitle="Manage your profile and security preferences."
      lockViewport
    >
      <div className="mx-auto w-full max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Global Identity Card */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mt-6">
          {/* Header */}
          <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-zinc-100 rounded-xl flex flex-shrink-0 items-center justify-center">
                  <HiOutlineUser className="w-5 h-5 text-zinc-950" />
               </div>
               <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Personal Information</h2>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-zinc-950 text-white text-sm font-semibold shadow-sm transition-all hover:bg-zinc-800 active:scale-95"
            >
              Edit Profile
            </button>
          </div>

          <div className="h-px bg-zinc-100 mx-8" />

          {/* Info Fields */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
               <InfoBlock icon={HiOutlineUser} label="Full Name" value={name} />
               <InfoBlock icon={HiOutlineEnvelope} label="Email Address" value={user.email} />
               <InfoBlock icon={HiOutlineUserCircle} label="Gender" value={user.profile?.gender} />
               <InfoBlock icon={HiOutlineCalendar} label="Date of Birth" value={user.profile?.date_of_birth} />
               <InfoBlock icon={HiOutlineGlobeAlt} label="Location" value={user.profile?.country} />
               <InfoBlock icon={HiOutlineAcademicCap} label="GPA" value={user.profile?.gpa?.toString()} />
            </div>
          </div>

          <div className="h-px bg-zinc-100 mx-8" />

          {/* Change Password */}
          <div className="p-8">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="flex items-center gap-2 text-sm font-semibold text-zinc-900 transition-colors hover:text-zinc-600"
            >
              <HiOutlineLockClosed className="h-4 w-4 text-zinc-500" />
              Change Password
            </button>
          </div>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        user={user} 
        onSave={handleSaveProfile} 
      />
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </AppShell>
  );
}
