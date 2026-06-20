"use client";

import { format } from "date-fns";
import { BookOpen, Check, ChevronDown, Feather, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BookCombobox } from "@/components/book-combobox";
import { getBook } from "@/lib/books";
import { deriveCounts, MOODS, referenceLabel } from "@/lib/reading";
import { useReadingStore } from "@/lib/store";
import type { Mood, ReadingEntry, ReadingInput } from "@/lib/types";
import { cn } from "@/lib/utils";

type Mode = "chapters" | "verses";
const MAX_VERSE = 176; // Psalm 119

function NumberSelect({
  value,
  min,
  max,
  onChange,
  ariaLabel,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  ariaLabel: string;
}) {
  const options = [];
  for (let i = min; i <= max; i++) options.push(i);
  return (
    <div className="relative">
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full appearance-none rounded-xl border border-line bg-card px-4 py-2.5 pr-9 text-sm font-medium text-ink outline-none transition-colors focus:border-gold"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
    </div>
  );
}

export default function LogPage() {
  const addEntry = useReadingStore((s) => s.addEntry);

  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [book, setBook] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("chapters");
  const [startChapter, setStartChapter] = useState(1);
  const [endChapter, setEndChapter] = useState(1);
  const [chapter, setChapter] = useState(1);
  const [startVerse, setStartVerse] = useState(1);
  const [endVerse, setEndVerse] = useState(5);
  const [minutes, setMinutes] = useState("");
  const [mood, setMood] = useState<Mood | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<ReadingEntry | null>(null);

  const bookMeta = book ? getBook(book) : undefined;
  const maxChapters = bookMeta?.chapters ?? 1;

  const handleBook = (name: string) => {
    setBook(name);
    setStartChapter(1);
    setEndChapter(1);
    setChapter(1);
    setError(null);
  };

  const buildInput = (): ReadingInput | null => {
    if (!book) return null;
    if (mode === "verses") {
      return {
        date,
        book,
        startChapter: chapter,
        endChapter: chapter,
        startVerse,
        endVerse: Math.max(startVerse, endVerse),
      };
    }
    return {
      date,
      book,
      startChapter,
      endChapter: Math.max(startChapter, endChapter),
    };
  };

  const preview = useMemo(() => {
    const input = buildInput();
    if (!input) return null;
    return { ref: referenceLabel(input), counts: deriveCounts(input) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book, mode, startChapter, endChapter, chapter, startVerse, endVerse, date]);

  const submit = () => {
    const input = buildInput();
    if (!input) {
      setError("Choose a book to log your reading.");
      return;
    }
    if (minutes && Number(minutes) > 0) input.minutes = Number(minutes);
    if (mood) input.mood = mood;
    if (note.trim()) input.note = note.trim();
    setSuccess(addEntry(input));
  };

  const reset = () => {
    setSuccess(null);
    setBook(null);
    setMode("chapters");
    setStartChapter(1);
    setEndChapter(1);
    setChapter(1);
    setStartVerse(1);
    setEndVerse(5);
    setMinutes("");
    setMood(null);
    setNote("");
    setError(null);
  };

  if (success) {
    return (
      <div className="mx-auto max-w-xl py-10">
        <div className="surface relative overflow-hidden rounded-card p-8 text-center sm:p-10">
          <div className="pointer-events-none absolute inset-0 glow-gold opacity-70" />
          <div className="relative">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/15">
              <Check className="h-7 w-7 text-gold" />
            </span>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
              Recorded
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
              {referenceLabel(success)}
            </h1>
            <p className="mt-2 text-sm text-ink-soft">
              {success.chaptersRead} chapter{success.chaptersRead === 1 ? "" : "s"} ·{" "}
              {success.versesRead} verses · added to your journal.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 dark:bg-gold dark:text-[#171206]"
              >
                <Feather className="h-4 w-4" />
                Log another
              </button>
              <Link
                href="/journal"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-card px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-gold/50"
              >
                View journal
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
          New entry
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Log a reading
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Whole chapters or a handful of verses — record it however you read.
        </p>
      </header>

      <div className="space-y-7">
        {/* Date + Book */}
        <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
          <Field label="Date">
            <input
              type="date"
              value={date}
              max={format(new Date(), "yyyy-MM-dd")}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-line bg-card px-4 py-3 text-sm font-medium text-ink outline-none transition-colors focus:border-gold"
            />
          </Field>
          <Field label="Book">
            <BookCombobox value={book} onChange={handleBook} />
          </Field>
        </div>

        {/* Passage */}
        <Field label="Passage">
          <div className="surface-2 rounded-card p-4">
            <div className="mb-4 inline-flex rounded-full border border-line bg-card p-1 text-sm">
              {(["chapters", "verses"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    "rounded-full px-4 py-1.5 font-medium capitalize transition-colors",
                    mode === m
                      ? "bg-ink text-paper dark:bg-gold dark:text-[#171206]"
                      : "text-ink-soft hover:text-ink",
                  )}
                >
                  {m === "chapters" ? "Whole chapters" : "Verses"}
                </button>
              ))}
            </div>

            {mode === "chapters" ? (
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <p className="mb-1.5 text-xs text-ink-faint">From chapter</p>
                  <NumberSelect
                    ariaLabel="From chapter"
                    value={startChapter}
                    min={1}
                    max={maxChapters}
                    onChange={(n) => {
                      setStartChapter(n);
                      if (n > endChapter) setEndChapter(n);
                    }}
                  />
                </div>
                <span className="pb-2.5 text-ink-faint">–</span>
                <div>
                  <p className="mb-1.5 text-xs text-ink-faint">To chapter</p>
                  <NumberSelect
                    ariaLabel="To chapter"
                    value={endChapter}
                    min={startChapter}
                    max={maxChapters}
                    onChange={setEndChapter}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <p className="mb-1.5 text-xs text-ink-faint">Chapter</p>
                  <NumberSelect
                    ariaLabel="Chapter"
                    value={chapter}
                    min={1}
                    max={maxChapters}
                    onChange={setChapter}
                  />
                </div>
                <div>
                  <p className="mb-1.5 text-xs text-ink-faint">From verse</p>
                  <NumberSelect
                    ariaLabel="From verse"
                    value={startVerse}
                    min={1}
                    max={MAX_VERSE}
                    onChange={(n) => {
                      setStartVerse(n);
                      if (n > endVerse) setEndVerse(n);
                    }}
                  />
                </div>
                <span className="pb-2.5 text-ink-faint">–</span>
                <div>
                  <p className="mb-1.5 text-xs text-ink-faint">To verse</p>
                  <NumberSelect
                    ariaLabel="To verse"
                    value={endVerse}
                    min={startVerse}
                    max={MAX_VERSE}
                    onChange={setEndVerse}
                  />
                </div>
              </div>
            )}

            {/* Live preview */}
            <div className="mt-4 flex items-center gap-2.5 border-t border-line pt-4 text-sm">
              <BookOpen className="h-4 w-4 text-gold" />
              {preview ? (
                <span className="text-ink">
                  <span className="font-display text-base font-semibold">
                    {preview.ref}
                  </span>
                  <span className="ml-2 text-ink-faint">
                    ≈ {preview.counts.chaptersRead} ch · {preview.counts.versesRead} vs
                  </span>
                </span>
              ) : (
                <span className="text-ink-faint">Pick a book to see the reference.</span>
              )}
            </div>
          </div>
        </Field>

        {/* Optional: minutes + mood */}
        <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
          <Field label="Minutes" optional>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="—"
              className="w-full rounded-xl border border-line bg-card px-4 py-3 text-sm font-medium text-ink outline-none transition-colors focus:border-gold"
            />
          </Field>
          <Field label="How it landed" optional>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => {
                const active = mood === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMood(active ? null : m.id)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "border-transparent text-white"
                        : "border-line text-ink-soft hover:border-gold/50",
                    )}
                    style={
                      active
                        ? { backgroundColor: `var(${m.colorVar})` }
                        : undefined
                    }
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>

        {/* Reflection */}
        <Field label="Reflection" optional>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="A thought, a prayer, a verse worth keeping…"
            className="w-full resize-none rounded-xl border border-line bg-card px-4 py-3 text-sm leading-relaxed text-ink outline-none transition-colors focus:border-gold placeholder:text-ink-faint"
          />
        </Field>

        {error && <p className="text-sm font-medium text-rubric">{error}</p>}

        <button
          type="button"
          onClick={submit}
          disabled={!book}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3.5 text-sm font-semibold text-paper shadow-lift transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 dark:bg-gold dark:text-[#171206]"
        >
          <Sparkles className="h-4 w-4" />
          Record reading
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
          {label}
        </label>
        {optional && (
          <span className="text-[10px] uppercase tracking-wider text-ink-faint">
            optional
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
