"use client";

import { format, parseISO } from "date-fns";
import { Clock, Trash2 } from "lucide-react";
import { getBook, groupColor } from "@/lib/books";
import { moodMeta, referenceLabel, shortReference } from "@/lib/reading";
import type { Mood, ReadingEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MoodTag({ mood }: { mood: Mood }) {
  const meta = moodMeta(mood);
  if (!meta) return null;
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{
        backgroundColor: `color-mix(in oklab, var(${meta.colorVar}) 15%, transparent)`,
        color: `var(${meta.colorVar})`,
      }}
    >
      {meta.label}
    </span>
  );
}

export function EntryCard({
  entry,
  onDelete,
  className,
}: {
  entry: ReadingEntry;
  onDelete?: (id: string) => void;
  className?: string;
}) {
  const book = getBook(entry.book);
  const accent = book ? groupColor(book.group) : "var(--gold)";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-card border border-line bg-card p-4 shadow-soft transition-shadow hover:shadow-lift sm:p-5",
        className,
      )}
    >
      {/* group accent spine */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: accent }}
      />

      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-tight text-ink">
            {referenceLabel(entry)}
          </h3>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-ink-faint">
            {shortReference(entry)} · {entry.chaptersRead} ch · {entry.versesRead} vs
          </p>
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(entry.id)}
            aria-label="Delete reading"
            className="shrink-0 rounded-lg p-1.5 text-ink-faint opacity-0 transition hover:bg-rubric/10 hover:text-rubric focus-visible:opacity-100 group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {entry.note && (
        <p className="mt-3 pl-2 font-display text-sm italic leading-relaxed text-ink-soft">
          “{entry.note}”
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 pl-2 text-xs text-ink-faint">
        {entry.mood && <MoodTag mood={entry.mood} />}
        {entry.minutes != null && (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {entry.minutes} min
          </span>
        )}
        <span>{format(parseISO(entry.date), "EEE, MMM d")}</span>
      </div>
    </article>
  );
}
