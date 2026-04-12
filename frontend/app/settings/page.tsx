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
  HiOutlineShieldCheck,
  HiOutlineCog6Tooth
} from "react-icons/hi2";

import { AppShell } from "@/components/app-shell";
import { updateAccountSettings, createProfile } from "@/lib/api";
import { useAuthContext } from "@/lib/auth-context";

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

  if (loading || !user) return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-[#202224]"></div></div>;

  const handleSaveProfile = async (data: { fullName: string; gender: string; dateOfBirth: string; country: string }) => {
    await updateAccountSettings({ full_name: data.fullName.trim() });
    const profilePayload: any = {
      ...(user.profile || {}),
      gender: data.gender || undefined,
      date_of_birth: data.dateOfBirth || undefined,
      country: data.country || "Nepal",
      target_country: user.profile?.target_country || "United States",
      degree_level: user.profile?.degree_level || "Bachelors",
      gpa: user.profile?.gpa || 0,
    };
    const updatedProfile = await createProfile(profilePayload);
    setUser({ ...user, full_name: data.fullName.trim(), profile: updatedProfile });
  };

  const name = user.full_name || "Unknown User";
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  const role = user.role.toUpperCase() === "USER" ? "Student Account" : "Platform Moderator";

  return (
    <AppShell 
      user={user} 
      onLogout={handleLogout} 
      title="Account Settings"
      subtitle="Manage your identity and security parameters."
      lockViewport
    >
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 mt-6">
          <div>
            <h1 className="text-2xl font-black text-[#202224] tracking-tight">Account Settings</h1>
            <p className="text-[13px] font-bold text-slate-400 mt-0.5">Manage your identity and security parameters.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-white border-2 border-slate-100 text-[#202224] text-[12px] font-black shadow-sm transition-all hover:border-slate-300 active:scale-95"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#202224] text-white text-[12px] font-black shadow-lg shadow-slate-200 transition-all hover:bg-black active:scale-95"
            >
              <HiOutlineLockClosed className="h-3.5 w-3.5" />
              Security
            </button>
          </div>
        </div>

        {/* Global Identity Card */}
        <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] overflow-hidden">
          {/* Avatar Area */}
          <div className="p-8 flex flex-col sm:flex-row items-center gap-6 bg-slate-50/30">
            <div className="relative flex items-center justify-center">
               <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#202224] to-[#404449] flex items-center justify-center border-[4px] border-white shadow-xl ring-1 ring-slate-100">
                  <span className="text-2xl font-black text-white">{initials}</span>
               </div>
            </div>
            <div className="text-center sm:text-left flex flex-col justify-center">
               <h2 className="text-xl font-black text-[#202224] tracking-tight">{name}</h2>
               <div className="flex items-center gap-1.5 mt-0.5 justify-center sm:justify-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <p className="text-[13px] font-bold text-slate-500">{role}</p>
               </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 mx-8" />

          {/* Detailed Attribution Area */}
          <div className="p-8">
            <div className="flex items-center gap-2.5 mb-8">
               <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                  <HiOutlineUser className="w-4 h-4 text-slate-600" />
               </div>
               <h3 className="text-md font-black text-[#202224] tracking-tight text-lg">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10">
               <InfoBlock icon={HiOutlineEnvelope} label="Email Address" value={user.email} />
               <InfoBlock icon={HiOutlineUserCircle} label="Gender" value={user.profile?.gender} />
               <InfoBlock icon={HiOutlineCalendar} label="Date of Birth" value={user.profile?.date_of_birth} />
               <InfoBlock icon={HiOutlineGlobeAlt} label="Location" value={user.profile?.country} />
               <InfoBlock icon={HiOutlineAcademicCap} label="GPA" value={user.profile?.gpa?.toString()} />
               <InfoBlock icon={HiOutlineShieldCheck} label="Security" value="Standard" />
            </div>
          </div>

          <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">UID: {String(user.id).padStart(8, '0')}</p>
              <p className="text-[9px] font-black text-slate-300 tracking-tight flex items-center gap-1.5">
                <HiOutlineCog6Tooth className="w-3 h-3" />
                V4.5 Protocol Active
              </p>
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
