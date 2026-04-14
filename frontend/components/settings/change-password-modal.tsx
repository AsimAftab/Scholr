import React, { useEffect, useRef, useState } from "react";
import { ZodError } from "zod";
import { HiOutlineCheck, HiOutlineXMark } from "react-icons/hi2";
import { updateAccountSettings } from "@/lib/api";
import { changePasswordSchema, zodErrors } from "@/lib/validation";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSaving(false);
      setError("");
      setSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  }, []);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      changePasswordSchema.parse({ currentPassword, newPassword, confirmPassword });
      setError("");
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors = zodErrors(err);
        setError(fieldErrors.currentPassword ?? fieldErrors.newPassword ?? fieldErrors.confirmPassword ?? "Invalid password.");
        return;
      }

      throw err;
    }

    setSaving(true);
    try {
      await updateAccountSettings({ current_password: currentPassword, new_password: newPassword });
      setSuccess(true);
      closeTimeoutRef.current = setTimeout(onClose, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update password.");
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
            <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-[0.15em]">Current Password</label>
            <div className="relative group">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-zinc-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 outline-none transition-all shadow-sm"
                placeholder="••••••••"
                autoFocus
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-[0.15em]">New Password</label>
            <div className="relative group">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-zinc-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 outline-none transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-[0.15em]">Confirm Password</label>
            <div className="relative group">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-zinc-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 outline-none transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving || success}
            className="w-full py-4 rounded-xl bg-blue-600 text-white text-sm font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
          >
            {saving ? <div className="h-4 w-4 rounded-full border-2 border-blue-400 border-t-white animate-spin" /> : <HiOutlineCheck className="w-4 h-4" />}
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
