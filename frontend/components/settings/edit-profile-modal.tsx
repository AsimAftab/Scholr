import React, { useState } from "react";
import { HiOutlineCheck, HiOutlineXMark } from "react-icons/hi2";
import { COUNTRIES } from "@/lib/countries";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSave: (data: { fullName: string; gender: string; dateOfBirth: string; country: string }) => Promise<void>;
}

export function EditProfileModal({ isOpen, onClose, user, onSave }: EditProfileModalProps) {
  const [fullName, setFullName] = useState(user.full_name || "");
  const [gender, setGender] = useState(user.profile?.gender || "");
  const [dateOfBirth, setDateOfBirth] = useState(user.profile?.date_of_birth || "");
  const [country, setCountry] = useState(user.profile?.country || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2) return setError("Name too short.");
    setSaving(true);
    try {
      await onSave({ fullName, gender, dateOfBirth, country });
      onClose();
    } catch (err: any) {
      setError(err.message);
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
              <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold focus:border-[#202224] focus:ring-4 focus:ring-slate-100 outline-none transition-all"
                placeholder="Name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold focus:border-[#202224] focus:ring-4 focus:ring-slate-100 outline-none transition-all appearance-none bg-white"
              >
                <option value="">Unspecified</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold focus:border-[#202224] focus:ring-4 focus:ring-slate-100 outline-none transition-all"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Primary Residence</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold focus:border-[#202224] focus:ring-4 focus:ring-slate-100 outline-none transition-all appearance-none bg-white"
              >
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
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
