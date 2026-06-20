"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card text-ink-soft transition-colors hover:border-gold/50 hover:text-ink",
        className,
      )}
    >
      <Sun
        className={cn(
          "h-[18px] w-[18px] transition-all duration-300",
          isDark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
        )}
      />
      <Moon
        className={cn(
          "absolute h-[18px] w-[18px] transition-all duration-300",
          isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0",
        )}
      />
    </button>
  );
}
