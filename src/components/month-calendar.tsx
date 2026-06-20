"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { getBook, groupColor } from "@/lib/books";
import { referenceLabel } from "@/lib/reading";
import type { ReadingEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MoodTag } from "./entry-card";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MAX_CHIPS = 2;

/** Unique book names for a day, in the order first read. */
function distinctBooks(list: ReadingEntry[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const e of list) {
    if (!seen.has(e.book)) {
      seen.add(e.book);
      out.push(e.book);
    }
  }
  return out;
}

function BookChip({ book }: { book: string }) {
  const meta = getBook(book);
  const color = meta ? groupColor(meta.group) : "var(--gold)";
  return (
    <span
      className="truncate rounded px-1 py-0.5 font-mono text-[9px] font-semibold leading-none"
      style={{
        color,
        backgroundColor: `color-mix(in oklab, ${color} 15%, transparent)`,
      }}
    >
      {meta?.abbr ?? book.slice(0, 3).toUpperCase()}
    </span>
  );
}

export function MonthCalendar({ entries }: { entries: ReadingEntry[] }) {
  const today = startOfToday();
  const [month, setMonth] = useState(() => startOfMonth(today));
  const [selected, setSelected] = useState<string | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<string, ReadingEntry[]>();
    for (const e of entries) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, [entries]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  const isCurrentMonth = isSameMonth(month, today);
  const changeMonth = (delta: number) => {
    setMonth((m) => startOfMonth(addMonths(m, delta)));
    setSelected(null);
  };

  const selectedEntries = selected ? (byDay.get(selected) ?? []) : [];

  return (
    <div className="surface flex h-full flex-col rounded-card p-6">
      {/* Header + navigation */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
            Month at a glance
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold text-ink">
            {format(month, "MMMM yyyy")}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          {!isCurrentMonth && (
            <button
              type="button"
              onClick={() => {
                setMonth(startOfMonth(today));
                setSelected(null);
              }}
              className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-gold/50 hover:text-ink"
            >
              Today
            </button>
          )}
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
            className="grid h-8 w-8 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-gold/50 hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            disabled={isCurrentMonth}
            aria-label="Next month"
            className="grid h-8 w-8 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-gold/50 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink-soft"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday header */}
      <div className="mt-5 grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((d, i) => (
          <div
            key={i}
            className="pb-1 text-center text-[10px] font-semibold uppercase tracking-wider text-ink-faint"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const inMonth = isSameMonth(day, month);
          const todayCell = isToday(day);
          const list = inMonth ? byDay.get(key) : undefined;
          const books = list ? distinctBooks(list) : [];
          const isSelected = selected === key;

          if (!inMonth) {
            return (
              <div
                key={key}
                className="min-h-[56px] rounded-lg p-1.5 text-[11px] text-ink-faint/40 sm:min-h-[76px]"
              >
                {format(day, "d")}
              </div>
            );
          }

          return (
            <button
              key={key}
              type="button"
              onClick={() => list && setSelected(isSelected ? null : key)}
              disabled={!list}
              aria-label={`${format(day, "MMMM d")}${
                list ? ` — ${books.length} book${books.length === 1 ? "" : "s"}` : ""
              }`}
              className={cn(
                "flex min-h-[56px] flex-col rounded-lg border p-1.5 text-left transition-colors sm:min-h-[76px]",
                isSelected
                  ? "border-gold bg-gold/10"
                  : todayCell
                    ? "border-gold/40 bg-gold/5"
                    : "border-line",
                list ? "cursor-pointer hover:border-gold/50" : "cursor-default",
              )}
            >
              <span
                className={cn(
                  "text-[11px] font-semibold leading-none",
                  todayCell ? "text-gold" : "text-ink-soft",
                )}
              >
                {format(day, "d")}
              </span>
              {books.length > 0 && (
                <div className="mt-1.5 flex flex-col gap-0.5">
                  {books.slice(0, MAX_CHIPS).map((b) => (
                    <BookChip key={b} book={b} />
                  ))}
                  {books.length > MAX_CHIPS && (
                    <span className="px-1 text-[9px] font-medium text-ink-faint">
                      +{books.length - MAX_CHIPS} more
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Day detail */}
      <AnimatePresence initial={false}>
        {selected && selectedEntries.length > 0 && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl border border-line bg-card-2 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-ink">
                  {format(parseISO(selected), "EEEE, MMMM d")}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close day details"
                  className="rounded-lg p-1 text-ink-faint transition-colors hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ul className="mt-3 space-y-3">
                {selectedEntries.map((e) => {
                  const meta = getBook(e.book);
                  return (
                    <li key={e.id} className="flex gap-2.5">
                      <span
                        className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor: meta
                            ? groupColor(meta.group)
                            : "var(--gold)",
                        }}
                      />
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-baseline gap-x-2">
                          <span className="font-display text-sm font-semibold text-ink">
                            {referenceLabel(e)}
                          </span>
                          <span className="font-mono text-[11px] text-ink-faint">
                            {e.chaptersRead} ch · {e.versesRead} vs
                          </span>
                          {e.mood && <MoodTag mood={e.mood} />}
                        </p>
                        {e.note && (
                          <p className="mt-1 font-display text-sm italic text-ink-soft">
                            “{e.note}”
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      <p className="mt-4 flex items-center gap-1.5 text-[11px] text-ink-faint">
        <CalendarDays className="h-3.5 w-3.5" />
        Tap a day to see what you read.
      </p>
    </div>
  );
}
