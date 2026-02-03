"use client";

import { useTheme } from "@/hooks/useTheme";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 bg-surface border border-gray-300 rounded-pill p-1">
        <button className="px-3 py-1 rounded-pill text-sm font-body" disabled>
          <span className="sr-only">Loading theme...</span>
        </button>
      </div>
    );
  }

  const activeTheme = theme === "system" ? resolvedTheme : theme;
  const isDarkActive = activeTheme === "dark";
  const nextTheme = isDarkActive ? "light" : "dark";

  return (
    <div className="flex items-center bg-surface border border-gray-300 rounded-pill p-1">
      <button
        type="button"
        onClick={() => setTheme(nextTheme)}
        className="relative flex h-8 w-14 items-center justify-between rounded-pill px-1 transition-colors"
        aria-label={`Switch to ${nextTheme} theme`}
        aria-pressed={isDarkActive}
      >
        <span className="sr-only">Toggle theme</span>
        <span
          className={`absolute top-0.5 left-0.5 h-7 w-7 rounded-full bg-slate-500 shadow-sm transition-transform duration-200 ${
            isDarkActive ? "translate-x-6" : "translate-x-0"
          }`}
        />
        <span
          aria-hidden="true"
          className={`relative z-10 flex h-7 w-7 items-center justify-center transition-opacity duration-150 ${
            isDarkActive ? "opacity-0" : "opacity-100"
          }`}
        >
          ☀️
        </span>
        <span
          aria-hidden="true"
          className={`relative z-10 flex h-7 w-7 items-center justify-center transition-opacity duration-150 ${
            isDarkActive ? "opacity-100" : "opacity-0"
          }`}
        >
          🌙
        </span>
      </button>
    </div>
  );
}
