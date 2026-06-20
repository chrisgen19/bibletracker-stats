"use client";

import { format, isToday, isYesterday, parseISO, startOfToday } from "date-fns";
import { Feather, RotateCcw, ScrollText } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EntryCard } from "@/components/entry-card";
import {
  entriesInRange,
  periodRange,
  summarize,
} from "@/lib/reading";
import { useReadingStore } from "@/lib/store";
import type { Period, ReadingEntry } from "@/lib/types";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

type Filter = "all" | Period;
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All time" },
  { id: "year", label: "This year" },
  { id: "month", label: "This month" },
  { id: "week", label: "This week" },
];

function dayHeading(dateKey: string): string {
  const date = parseISO(dateKey);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
}

function groupByDay(entries: ReadingEntry[]): [string, ReadingEntry[]][] {
  const map = new Map<string, ReadingEntry[]>();
  for (const e of entries) {
    const list = map.get(e.date) ?? [];
    list.push(e);
    map.set(e.date, list);
  }
  return [...map.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([day, list]) => [
      day,
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    ]);
}

export default function JournalPage() {
  const hydrated = useHydrated();
  const entries = useReadingStore((s) => s.entries);
  const removeEntry = useReadingStore((s) => s.removeEntry);
  const resetToSample = useReadingStore((s) => s.resetToSample);
  const [filter, setFilter] = useState<Filter>("all");

  const { filtered, summary, groups } = useMemo(() => {
    const list =
      filter === "all"
        ? entries
        : entriesInRange(entries, periodRange(filter, startOfToday()));
    return {
      filtered: list,
      summary: summarize(list),
      groups: groupByDay(list),
    };
  }, [entries, filter]);

  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
            Your readings
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Journal
          </h1>
        </div>
        <Link
          href="/log"
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 dark:bg-gold dark:text-[#171206]"
        >
          <Feather className="h-4 w-4" />
          New entry
        </Link>
      </header>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex flex-wrap gap-1 rounded-full border border-line bg-card-2 p-1 text-sm">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 font-medium transition-colors",
                filter === f.id
                  ? "bg-ink text-paper dark:bg-gold dark:text-[#171206]"
                  : "text-ink-soft hover:text-ink",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        {hydrated && (
          <p className="text-sm text-ink-faint">
            <span className="font-semibold text-ink">{summary.entries}</span> reading
            {summary.entries === 1 ? "" : "s"} ·{" "}
            <span className="font-semibold text-ink">{summary.chapters}</span> chapters
          </p>
        )}
      </div>

      {/* Timeline */}
      {!hydrated ? (
        <JournalSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-8">
          {groups.map(([day, list]) => (
            <section key={day}>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="font-display text-lg font-semibold text-ink">
                  {dayHeading(day)}
                </h2>
                <span className="h-px flex-1 bg-line" />
                <span className="text-xs text-ink-faint">
                  {list.length} reading{list.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {list.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} onDelete={removeEntry} />
                ))}
              </div>
            </section>
          ))}

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    "Restore the sample reading history? This replaces your current entries.",
                  )
                ) {
                  resetToSample();
                  setFilter("all");
                }
              }}
              className="inline-flex items-center gap-2 text-xs font-medium text-ink-faint transition-colors hover:text-ink"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset to sample data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="surface rounded-card p-12 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/12">
        <ScrollText className="h-7 w-7 text-gold" />
      </span>
      <h2 className="mt-5 font-display text-xl font-semibold text-ink">
        Nothing here yet
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
        No readings in this window. Log what you read today and your journal will
        begin to fill.
      </p>
      <Link
        href="/log"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 dark:bg-gold dark:text-[#171206]"
      >
        <Feather className="h-4 w-4" />
        Log a reading
      </Link>
    </div>
  );
}

function JournalSkeleton() {
  return (
    <div className="space-y-8">
      {[0, 1].map((s) => (
        <div key={s}>
          <div className="mb-3 h-5 w-40 animate-pulse rounded bg-card-2" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-card border border-line bg-card-2"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
