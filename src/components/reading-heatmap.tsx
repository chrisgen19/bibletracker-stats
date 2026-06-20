import {
  eachDayOfInterval,
  endOfWeek,
  format,
  getMonth,
  isAfter,
  isSameYear,
  startOfToday,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { activityByDay } from "@/lib/reading";
import type { ReadingEntry } from "@/lib/types";

const ALPHA = [0, 0.24, 0.46, 0.7, 1];

function level(chapters: number): number {
  if (chapters <= 0) return 0;
  if (chapters <= 1) return 1;
  if (chapters <= 3) return 2;
  if (chapters <= 6) return 3;
  return 4;
}

function cellColor(level: number): string {
  if (level === 0) return "var(--line-soft)";
  return `color-mix(in oklab, var(--gold) ${ALPHA[level] * 100}%, transparent)`;
}

export function ReadingHeatmap({ entries }: { entries: ReadingEntry[] }) {
  const today = startOfToday();
  const yearStart = startOfYear(today);
  const gridStart = startOfWeek(yearStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(today, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const byDay = activityByDay(entries);

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div className="overflow-x-auto pb-1">
      <div className="inline-block min-w-full">
        {/* Month labels */}
        <div className="mb-1.5 flex gap-[3px]">
          {weeks.map((week, wi) => {
            const startsMonth =
              week.some((d) => d.getDate() <= 7) &&
              (wi === 0 || getMonth(week[0]) !== getMonth(weeks[wi - 1][0]));
            const labelDay = week.find((d) => d.getDate() <= 7);
            return (
              <div
                key={wi}
                className="h-3 w-[13px] whitespace-nowrap text-[9px] font-medium uppercase tracking-wide text-ink-faint"
              >
                {startsMonth && labelDay ? format(labelDay, "MMM") : ""}
              </div>
            );
          })}
        </div>

        {/* Day grid — weeks as columns */}
        <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
          {weeks.map((week, wi) =>
            week.map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const chapters = byDay.get(key)?.chapters ?? 0;
              const outside = !isSameYear(day, today) || isAfter(day, today);
              const lvl = level(chapters);
              return (
                <div
                  key={`${wi}-${key}`}
                  title={`${format(day, "EEE, MMM d")} — ${chapters} chapter${chapters === 1 ? "" : "s"}`}
                  className="h-[13px] w-[13px] rounded-[3px] ring-1 ring-inset ring-black/[0.03] dark:ring-white/[0.04]"
                  style={{
                    backgroundColor: outside ? "transparent" : cellColor(lvl),
                    visibility: outside ? "hidden" : "visible",
                  }}
                />
              );
            }),
          )}
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-ink-faint">
          <span>Quieter</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span
              key={l}
              className="h-[11px] w-[11px] rounded-[3px]"
              style={{ backgroundColor: cellColor(l) }}
            />
          ))}
          <span>Fuller</span>
        </div>
      </div>
    </div>
  );
}
