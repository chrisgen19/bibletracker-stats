import {
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { avgVersesPerChapter, getBook, TOTAL_CHAPTERS } from "./books";
import type {
  Mood,
  Period,
  ReadingEntry,
  ReadingInput,
  Testament,
} from "./types";

export const WEEK_STARTS_ON = 0 as const; // Sunday

/* -------------------------------------------------------------------- */
/*  Reference formatting                                                 */
/* -------------------------------------------------------------------- */

/** Human-readable reference, e.g. "John 3:16–18", "Psalm 23", "Romans 8–12". */
export function referenceLabel(entry: ReadingEntry | ReadingInput): string {
  const { book, startChapter, endChapter, startVerse, endVerse } = entry;
  const isPsalm = book === "Psalms";
  const bookLabel = isPsalm && startChapter === endChapter ? "Psalm" : book;

  if (startVerse != null && startChapter === endChapter) {
    const verses =
      endVerse != null && endVerse !== startVerse
        ? `${startVerse}–${endVerse}`
        : `${startVerse}`;
    return `${bookLabel} ${startChapter}:${verses}`;
  }

  if (startChapter === endChapter) return `${bookLabel} ${startChapter}`;
  return `${book} ${startChapter}–${endChapter}`;
}

/** Compact reference for chips, e.g. "JHN 3:16". */
export function shortReference(entry: ReadingEntry): string {
  const book = getBook(entry.book);
  const abbr = book?.abbr ?? entry.book.slice(0, 3).toUpperCase();
  if (entry.startVerse != null && entry.startChapter === entry.endChapter) {
    return `${abbr} ${entry.startChapter}:${entry.startVerse}`;
  }
  if (entry.startChapter === entry.endChapter) return `${abbr} ${entry.startChapter}`;
  return `${abbr} ${entry.startChapter}–${entry.endChapter}`;
}

/* -------------------------------------------------------------------- */
/*  Deriving entries                                                     */
/* -------------------------------------------------------------------- */

interface Derived {
  chaptersRead: number;
  versesRead: number;
}

/** Estimate chapters & verses touched by an input. */
export function deriveCounts(input: ReadingInput): Derived {
  const book = getBook(input.book);
  const partial =
    input.startVerse != null && input.startChapter === input.endChapter;

  if (partial) {
    const start = input.startVerse ?? 1;
    const end = input.endVerse ?? start;
    return { chaptersRead: 1, versesRead: Math.max(1, end - start + 1) };
  }

  const chaptersRead = Math.max(1, input.endChapter - input.startChapter + 1);
  const perChapter = book ? avgVersesPerChapter(book) : 26;
  return { chaptersRead, versesRead: Math.round(chaptersRead * perChapter) };
}

/** Build a complete entry (id + derived fields) from form input. */
export function makeEntry(input: ReadingInput): ReadingEntry {
  const { chaptersRead, versesRead } = deriveCounts(input);
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: input.date,
    book: input.book,
    startChapter: input.startChapter,
    endChapter: input.endChapter,
    startVerse: input.startVerse,
    endVerse: input.endVerse,
    chaptersRead,
    versesRead,
    minutes: input.minutes,
    mood: input.mood,
    note: input.note?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };
}

/* -------------------------------------------------------------------- */
/*  Periods                                                              */
/* -------------------------------------------------------------------- */

export interface DateRange {
  start: Date;
  end: Date;
}

export function periodRange(period: Period, ref: Date = startOfToday()): DateRange {
  switch (period) {
    case "week":
      return {
        start: startOfWeek(ref, { weekStartsOn: WEEK_STARTS_ON }),
        end: endOfWeek(ref, { weekStartsOn: WEEK_STARTS_ON }),
      };
    case "month":
      return { start: startOfMonth(ref), end: endOfMonth(ref) };
    case "year":
      return { start: startOfYear(ref), end: endOfYear(ref) };
  }
}

export function entriesInRange(
  entries: ReadingEntry[],
  range: DateRange,
): ReadingEntry[] {
  return entries.filter((e) =>
    isWithinInterval(parseISO(e.date), {
      start: range.start,
      end: range.end,
    }),
  );
}

export const PERIOD_LABEL: Record<Period, string> = {
  week: "This Week",
  month: "This Month",
  year: "This Year",
};

/* -------------------------------------------------------------------- */
/*  Summaries & streaks                                                  */
/* -------------------------------------------------------------------- */

export interface Summary {
  entries: number;
  chapters: number;
  verses: number;
  minutes: number;
  /** Distinct days with at least one reading. */
  days: number;
}

export function summarize(entries: ReadingEntry[]): Summary {
  const days = new Set<string>();
  let chapters = 0;
  let verses = 0;
  let minutes = 0;
  for (const e of entries) {
    days.add(e.date);
    chapters += e.chaptersRead;
    verses += e.versesRead;
    minutes += e.minutes ?? 0;
  }
  return { entries: entries.length, chapters, verses, minutes, days: days.size };
}

export interface StreakInfo {
  current: number;
  longest: number;
}

/** Consecutive-day reading streaks. A streak stays "alive" through today. */
export function computeStreak(entries: ReadingEntry[]): StreakInfo {
  const dayKeys = [...new Set(entries.map((e) => e.date))].sort();
  if (dayKeys.length === 0) return { current: 0, longest: 0 };

  const days = dayKeys.map((k) => parseISO(k));

  // Longest run of consecutive days.
  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    const gap = differenceInCalendarDays(days[i], days[i - 1]);
    run = gap === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  // Current streak: must include today or yesterday to still be alive.
  const today = startOfToday();
  const last = days[days.length - 1];
  const sinceLast = differenceInCalendarDays(today, last);
  let current = 0;
  if (sinceLast <= 1) {
    current = 1;
    for (let i = days.length - 1; i > 0; i--) {
      if (differenceInCalendarDays(days[i], days[i - 1]) === 1) current++;
      else break;
    }
  }

  return { current, longest };
}

/* -------------------------------------------------------------------- */
/*  Daily activity (for charts & heatmap)                                */
/* -------------------------------------------------------------------- */

export interface DayActivity {
  date: Date;
  key: string;
  chapters: number;
  verses: number;
  count: number;
}

/** Map of dayKey → aggregated activity. */
export function activityByDay(entries: ReadingEntry[]): Map<string, DayActivity> {
  const map = new Map<string, DayActivity>();
  for (const e of entries) {
    const existing = map.get(e.date);
    if (existing) {
      existing.chapters += e.chaptersRead;
      existing.verses += e.versesRead;
      existing.count += 1;
    } else {
      map.set(e.date, {
        date: parseISO(e.date),
        key: e.date,
        chapters: e.chaptersRead,
        verses: e.versesRead,
        count: 1,
      });
    }
  }
  return map;
}

/** Build a dense list of days across a range with activity filled in. */
export function denseDays(
  entries: ReadingEntry[],
  range: DateRange,
): DayActivity[] {
  const byDay = activityByDay(entries);
  return eachDayOfInterval({ start: range.start, end: range.end }).map((date) => {
    const key = format(date, "yyyy-MM-dd");
    return (
      byDay.get(key) ?? { date, key, chapters: 0, verses: 0, count: 0 }
    );
  });
}

/* -------------------------------------------------------------------- */
/*  Bible coverage                                                       */
/* -------------------------------------------------------------------- */

export interface Coverage {
  /** book name → set of chapter numbers read at least once. */
  byBook: Map<string, Set<number>>;
  chaptersCovered: number;
  percent: number;
  byTestament: Record<Testament, number>;
}

export function computeCoverage(entries: ReadingEntry[]): Coverage {
  const byBook = new Map<string, Set<number>>();
  for (const e of entries) {
    const set = byBook.get(e.book) ?? new Set<number>();
    for (let c = e.startChapter; c <= e.endChapter; c++) set.add(c);
    byBook.set(e.book, set);
  }

  let chaptersCovered = 0;
  const byTestament: Record<Testament, number> = { OT: 0, NT: 0 };
  for (const [name, set] of byBook) {
    const book = getBook(name);
    const covered = book ? Math.min(set.size, book.chapters) : set.size;
    chaptersCovered += covered;
    if (book) byTestament[book.testament] += covered;
  }

  return {
    byBook,
    chaptersCovered,
    percent: (chaptersCovered / TOTAL_CHAPTERS) * 100,
    byTestament,
  };
}

/* -------------------------------------------------------------------- */
/*  Moods                                                                */
/* -------------------------------------------------------------------- */

export interface MoodMeta {
  id: Mood;
  label: string;
  colorVar: string;
}

export const MOODS: MoodMeta[] = [
  { id: "grateful", label: "Grateful", colorVar: "--gold" },
  { id: "peaceful", label: "Peaceful", colorVar: "--sage" },
  { id: "convicted", label: "Convicted", colorVar: "--rubric" },
  { id: "curious", label: "Curious", colorVar: "--lapis" },
  { id: "joyful", label: "Joyful", colorVar: "--ember" },
  { id: "comforted", label: "Comforted", colorVar: "--plum" },
];

const MOOD_BY_ID = new Map(MOODS.map((m) => [m.id, m]));
export function moodMeta(mood: Mood): MoodMeta | undefined {
  return MOOD_BY_ID.get(mood);
}
