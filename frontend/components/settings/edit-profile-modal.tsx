import React, { useEffect, useState } from "react";
import { ZodError } from "zod";
import { HiOutlineCheck, HiOutlineXMark, HiOutlineChevronDown, HiOutlineCalendar } from "react-icons/hi2";
import { COUNTRIES } from "@/lib/countries";
import { User } from "@/lib/types";
import { editProfileSchema, zodErrors } from "@/lib/validation";

type EditProfileFormData = {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  country: string;
  gpa: number;
};

function getInitialFormState(user: User): EditProfileFormData {
  return {
    fullName: user.full_name ?? "",
    gender: user.profile?.gender ?? "",
    dateOfBirth: user.profile?.date_of_birth ?? "",
    country: user.profile?.country ?? "",
    gpa: user.profile?.gpa ?? 0,
  };
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (data: EditProfileFormData) => Promise<void>;
}

export function EditProfileModal({ isOpen, onClose, user, onSave }: EditProfileModalProps) {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [country, setCountry] = useState("");
  const [gpa, setGpa] = useState<number | "">(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setError("");
      setSaving(false);
      return;
    }

    const initialState = getInitialFormState(user);
    setFullName(initialState.fullName);
    setGender(initialState.gender);
    setDateOfBirth(initialState.dateOfBirth);
    setCountry(initialState.country);
    setGpa(initialState.gpa);
    setError("");
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let payload: EditProfileFormData;
    try {
      payload = editProfileSchema.parse({ fullName, gender, dateOfBirth, country, gpa: gpa === "" ? 0 : Number(gpa) });
      setError("");
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors = zodErrors(err);
        setError(fieldErrors.fullName ?? fieldErrors.country ?? fieldErrors.dateOfBirth ?? "Invalid profile data.");
        return;
      }

      throw err;
    }

    setSaving(true);
    try {
      await onSave(payload);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#202224]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-zinc-50/50">
          <h3 className="font-black text-[#202224] text-lg tracking-tight">Edit Profile</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <HiOutlineXMark className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          {error && <div className="p-3 text-xs font-bold bg-rose-50 text-rose-600 rounded-xl border border-rose-100">{error}</div>}
          
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2 space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-[0.15em]">Email Address <span className="opacity-50 tracking-normal">(Read-only)</span></label>
              <div className="relative">
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500 cursor-not-allowed outline-none"
                />
              </div>
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-[0.15em]">Full Name</label>
              <div className="relative group">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-zinc-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 outline-none transition-all shadow-sm"
                  placeholder="Name"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-[0.15em]">Gender</label>
              <div className="relative group">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-3 text-sm font-bold text-zinc-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 outline-none transition-all appearance-none shadow-sm cursor-pointer"
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
              <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-[0.15em]">Date of Birth</label>
              <div className="relative group">
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm font-bold text-zinc-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 outline-none transition-all shadow-sm cursor-pointer custom-date-input"
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
              <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-[0.15em]">Location</label>
              <div className="relative group">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-3 text-sm font-bold text-zinc-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 outline-none transition-all appearance-none shadow-sm cursor-pointer"
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <HiOutlineChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-[0.15em]">GPA</label>
              <div className="relative group">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value ? Number(e.target.value) : "")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-zinc-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 outline-none transition-all shadow-sm"
                  placeholder="e.g. 3.8 or 9.5"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 rounded-xl bg-blue-600 text-white text-sm font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
          >
            {saving ? <div className="h-4 w-4 rounded-full border-2 border-blue-400 border-t-white animate-spin" /> : <HiOutlineCheck className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
