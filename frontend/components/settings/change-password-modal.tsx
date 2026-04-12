import React, { useState } from "react";
import { HiOutlineCheck, HiOutlineXMark } from "react-icons/hi2";
import { updateAccountSettings } from "@/lib/api";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) return setError("Password must be 8+ characters.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");

    setSaving(true);
    try {
      await updateAccountSettings({ new_password: newPassword });
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#202224]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-zinc-50/50">
          <h3 className="font-black text-[#202224] text-lg tracking-tight">Change Password</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <HiOutlineXMark className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-7 space-y-5">
          {error && <div className="p-3 text-xs font-bold bg-rose-50 text-rose-600 rounded-xl border border-rose-100">{error}</div>}
          {success && <div className="p-3 text-xs font-bold bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">Synchronized.</div>}
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold focus:border-[#202224] focus:ring-4 focus:ring-slate-100 outline-none transition-all"
              placeholder="••••••••"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold focus:border-[#202224] focus:ring-4 focus:ring-slate-100 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={saving || success}
            className="w-full py-4 rounded-xl bg-[#202224] text-white text-sm font-black hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
          >
            {saving ? <div className="h-4 w-4 rounded-full border-2 border-slate-500 border-t-white animate-spin" /> : <HiOutlineCheck className="w-4 h-4" />}
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
