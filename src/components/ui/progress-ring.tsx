import type { ReactNode } from "react";
import { clamp } from "@/lib/utils";

interface ProgressRingProps {
  /** 0–1 progress fraction. */
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  children?: ReactNode;
}

/** Animated circular progress with arbitrary centre content. */
export function ProgressRing({
  value,
  size = 132,
  stroke = 11,
  color = "var(--gold)",
  trackColor = "var(--line)",
  children,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamp(value, 0, 1));

  return (
    <div
      className="relative inline-grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 grid place-items-center text-center">
          {children}
        </div>
      )}
    </div>
  );
}
