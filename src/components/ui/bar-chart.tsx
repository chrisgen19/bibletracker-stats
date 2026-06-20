import { cn } from "@/lib/utils";

export interface BarPoint {
  label: string;
  value: number;
  /** Longer label used in the hover tooltip. */
  fullLabel?: string;
  /** Render in the accent (ember) colour, e.g. for "today". */
  highlight?: boolean;
}

/** Minimal, dependency-free bar chart used for reading rhythm. */
export function BarChart({
  points,
  height = 160,
  unit = "chapters",
}: {
  points: BarPoint[];
  height?: number;
  unit?: string;
}) {
  const max = Math.max(1, ...points.map((p) => p.value));

  return (
    <div className="flex items-end gap-[3px]" style={{ height }}>
      {points.map((point, i) => {
        const pct = (point.value / max) * 100;
        return (
          <div
            key={i}
            className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
          >
            <div className="flex w-full flex-1 items-end">
              <div
                className={cn(
                  "w-full rounded-md transition-[height,background-color] duration-700 ease-out",
                  point.highlight ? "bg-ember" : "bg-gold/75 group-hover:bg-gold",
                )}
                style={{
                  height: point.value > 0 ? `${Math.max(pct, 3)}%` : "2px",
                  opacity: point.value > 0 ? 1 : 0.3,
                }}
                title={`${point.fullLabel ?? point.label}: ${point.value} ${unit}`}
              />
            </div>
            <span className="text-[10px] tabular-nums text-ink-faint">
              {point.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
