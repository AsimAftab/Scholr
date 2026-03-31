"use client";

import { useState, useRef, useEffect, useId } from "react";
import clsx from "clsx";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function DatePicker({ value, onChange, placeholder = "Select date", error }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const dialogId = useId();

  const currentRealYear = new Date().getFullYear();
  
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      const parts = value.split("-");
      if (parts.length === 3) return parseInt(parts[1], 10) - 1;
    }
    return new Date().getMonth();
  });
  
  const [currentYear, setCurrentYear] = useState(() => {
    if (value) {
      const parts = value.split("-");
      if (parts.length === 3) return parseInt(parts[0], 10);
    }
    return currentRealYear;
  });

  // Sync state if value changes from outside
  useEffect(() => {
    if (value) {
      const parts = value.split("-");
      if (parts.length === 3) {
        setCurrentYear(parseInt(parts[0], 10));
        setCurrentMonth(parseInt(parts[1], 10) - 1);
      }
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus management: move focus into dialog when opened
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const dialog = containerRef.current.querySelector('[role="dialog"]') as HTMLDivElement;
      if (dialog) {
        // Focus the first interactive element (the month select)
        const firstInteractive = dialog.querySelector('button, select, input') as HTMLElement;
        firstInteractive?.focus();
      }
    }
  }, [isOpen]);

  // Focus trap: keep Tab navigation within dialog when open
  useEffect(() => {
    if (!isOpen) return;

    function handleTabKey(event: KeyboardEvent) {
      if (event.key !== "Tab") return;

      const dialog = containerRef.current?.querySelector('[role="dialog"]') as HTMLDivElement;
      if (!dialog) return;

      const focusableElements = dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleTabKey);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleTabKey);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  // Return focus to trigger when dialog closes
  useEffect(() => {
    if (wasOpen.current && !isOpen && triggerRef.current) {
      triggerRef.current.focus();
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const handleSelectDate = (day: number) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    onChange(`${currentYear}-${formattedMonth}-${formattedDay}`);
    setIsOpen(false);
  };

  const getDisplayDate = () => {
    if (!value) return "";
    const parts = value.split("-");
    if (parts.length !== 3) return value;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (isNaN(year) || isNaN(month) || isNaN(day) || month < 0 || month > 11) {
      return value;
    }
    return `${MONTHS[month]} ${day}, ${year}`;
  };

  const years = Array.from({ length: 100 }, (_, i) => currentRealYear - i);

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        className={clsx(
          "flex w-full items-center justify-between rounded-2xl border px-4 py-3 outline-none transition focus:border-zinc-900",
          error ? "border-red-500 bg-red-50/50 text-red-900" : "border-zinc-200 bg-zinc-50 text-zinc-900 focus:bg-white",
          !value && "text-zinc-500",
          isOpen && !error && "border-zinc-900 bg-white"
        )}
      >
        <span>{value ? getDisplayDate() : placeholder}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={error ? "text-red-500" : "text-zinc-400"}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen && (
        <div
          id={dialogId}
          role="dialog"
          aria-modal="true"
          aria-label="Select date"
          className="absolute z-50 mt-2 w-72 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl"
        >
          <div className="mb-4 flex items-center justify-between gap-2">
            <select 
              value={currentMonth}
              onChange={(e) => setCurrentMonth(Number(e.target.value))}
              aria-label="Select month"
              className="w-1/2 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm font-medium text-zinc-900 outline-none focus:border-zinc-900"
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            
            <select 
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
              aria-label="Select year"
              className="w-1/2 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm font-medium text-zinc-900 outline-none focus:border-zinc-900"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-500">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
              <div key={day} className="py-1">{day}</div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1 text-sm">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const formattedMonth = String(currentMonth + 1).padStart(2, "0");
              const formattedDay = String(day).padStart(2, "0");
              const dateString = `${currentYear}-${formattedMonth}-${formattedDay}`;
              const isSelected = value === dateString;
              const isToday = todayString === dateString;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDate(day)}
                  aria-label={`${MONTHS[currentMonth]} ${day}, ${currentYear}`}
                  aria-pressed={isSelected}
                  className={clsx(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                    isSelected
                      ? "bg-zinc-900 text-white font-semibold shadow-sm"
                      : isToday
                      ? "bg-zinc-100 text-zinc-900 font-semibold"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
