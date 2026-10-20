"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";

export default function ThemeToggle({ className = "" }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch by rendering only after mounting on client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 flex items-center justify-center opacity-70 ${className}`}
        aria-hidden="true"
      >
        <span className="w-4 h-4 rounded-full bg-zinc-300 dark:bg-zinc-700 animate-pulse" />
      </div>
    );
  }

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      aria-label={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      className={`relative w-9 h-9 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 transition-all flex items-center justify-center shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 scale-100 duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-700 transition-transform -rotate-12 scale-100 duration-300" />
      )}
    </button>
  );
}
