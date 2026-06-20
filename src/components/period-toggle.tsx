"use client";

import { motion } from "motion/react";
import type { Period } from "@/lib/types";
import { cn } from "@/lib/utils";

const PERIODS: Period[] = ["week", "month", "year"];
const spring = { type: "spring" as const, stiffness: 380, damping: 32 };

export function PeriodToggle({
  value,
  onChange,
}: {
  value: Period;
  onChange: (period: Period) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-line bg-card-2 p-1 text-sm">
      {PERIODS.map((period) => {
        const active = period === value;
        return (
          <button
            key={period}
            type="button"
            onClick={() => onChange(period)}
            className="relative rounded-full px-3.5 py-1.5 font-medium capitalize"
          >
            {active && (
              <motion.span
                layoutId="period-pill"
                transition={spring}
                className="absolute inset-0 rounded-full bg-ink dark:bg-gold"
              />
            )}
            <span
              className={cn(
                "relative transition-colors",
                active
                  ? "text-paper dark:text-[#171206]"
                  : "text-ink-soft hover:text-ink",
              )}
            >
              {period}
            </span>
          </button>
        );
      })}
    </div>
  );
}
