"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { HiOutlineCheck, HiOutlineXMark } from "react-icons/hi2";

type ToastType = "success" | "error";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-semibold animate-in slide-in-from-bottom-4 fade-in duration-300 ${
              toast.type === "success"
                ? "bg-zinc-950 text-white border-zinc-800"
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            {toast.type === "success" ? (
              <div className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center shrink-0">
                <HiOutlineCheck className="w-3 h-3 text-white" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center shrink-0">
                <HiOutlineXMark className="w-3 h-3 text-white" />
              </div>
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => dismiss(toast.id)}
              className={`ml-2 p-0.5 rounded-md transition-colors shrink-0 ${
                toast.type === "success"
                  ? "hover:bg-zinc-800 text-zinc-400"
                  : "hover:bg-rose-100 text-rose-400"
              }`}
            >
              <HiOutlineXMark className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
