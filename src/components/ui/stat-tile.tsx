import type { LucideIcon } from "lucide-react";

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  accent?: string;
}

export function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  accent = "var(--gold)",
}: StatTileProps) {
  return (
    <div className="surface rounded-card p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <span
          className="grid h-7 w-7 place-items-center rounded-lg"
          style={{ backgroundColor: `color-mix(in oklab, ${accent} 14%, transparent)` }}
        >
          <Icon className="h-4 w-4" style={{ color: accent }} />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
          {label}
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold leading-none text-ink">
        {value}
      </p>
      {hint && <p className="mt-1.5 text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}
