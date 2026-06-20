import { format, startOfToday, subDays } from "date-fns";
import { getBook } from "./books";
import { deriveCounts } from "./reading";
import type { Mood, ReadingEntry, ReadingInput } from "./types";

/* Deterministic PRNG so the sample data set is identical on every load. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(0x5e1a48);
const randInt = (min: number, max: number) =>
  Math.floor(rand() * (max - min + 1)) + min;
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];

interface Weighted {
  book: string;
  weight: number;
}
const POOL: Weighted[] = [
  { book: "Psalms", weight: 9 },
  { book: "Proverbs", weight: 5 },
  { book: "John", weight: 6 },
  { book: "Matthew", weight: 5 },
  { book: "Luke", weight: 4 },
  { book: "Mark", weight: 3 },
  { book: "Romans", weight: 4 },
  { book: "Genesis", weight: 4 },
  { book: "Exodus", weight: 2 },
  { book: "Isaiah", weight: 3 },
  { book: "Acts", weight: 3 },
  { book: "1 Corinthians", weight: 2 },
  { book: "Philippians", weight: 2 },
  { book: "Ephesians", weight: 2 },
  { book: "James", weight: 2 },
  { book: "1 John", weight: 2 },
  { book: "Hebrews", weight: 2 },
  { book: "Galatians", weight: 1 },
  { book: "Colossians", weight: 1 },
  { book: "1 Peter", weight: 1 },
  { book: "Jeremiah", weight: 1 },
  { book: "Daniel", weight: 1 },
  { book: "Ecclesiastes", weight: 1 },
  { book: "Revelation", weight: 1 },
];
const POOL_TOTAL = POOL.reduce((s, p) => s + p.weight, 0);

function pickBook(): string {
  let r = rand() * POOL_TOTAL;
  for (const p of POOL) {
    r -= p.weight;
    if (r <= 0) return p.book;
  }
  return "Psalms";
}

const NOTES = [
  "Struck by how patient God is here.",
  "Want to sit with this one a little longer.",
  "A promise worth holding onto this week.",
  "Convicted about how I spend my mornings.",
  "Read the last few verses twice — slowly.",
  "This met something I've been praying about.",
  "Hope tucked into the middle of hard words.",
  "Want to memorize part of this passage.",
  "The imagery here is unforgettable.",
  "Grace shows up even in the small details.",
  "Quiet morning. Mostly just listening.",
  "Underlined nearly the whole chapter.",
  "Came back to this after a long day.",
  "Less answers, more wonder today.",
];
const MOOD_IDS: Mood[] = [
  "grateful",
  "peaceful",
  "convicted",
  "curious",
  "joyful",
  "comforted",
];

/** Build one plausible reading for a given day. */
function makePassage(date: string): ReadingInput {
  const bookName = pickBook();
  const book = getBook(bookName)!;

  // ~16% of reads are focused, partial-chapter (per-verse) readings.
  if (rand() < 0.16) {
    const chapter = randInt(1, book.chapters);
    const startVerse = randInt(1, 18);
    const endVerse = startVerse + randInt(2, 14);
    return {
      date,
      book: bookName,
      startChapter: chapter,
      endChapter: chapter,
      startVerse,
      endVerse,
    };
  }

  // Otherwise a span of whole chapters.
  const spanRoll = rand();
  const span = spanRoll < 0.55 ? 1 : spanRoll < 0.8 ? 2 : spanRoll < 0.92 ? 3 : randInt(4, 5);
  const start = randInt(1, Math.max(1, book.chapters - span + 1));
  const end = Math.min(book.chapters, start + span - 1);
  return { date, book: bookName, startChapter: start, endChapter: end };
}

function buildEntry(input: ReadingInput, id: number): ReadingEntry {
  const { chaptersRead, versesRead } = deriveCounts(input);
  const hour = randInt(6, 21);
  const minute = pick([0, 5, 15, 20, 30, 45]);
  return {
    id: `seed-${id}`,
    ...input,
    chaptersRead,
    versesRead,
    minutes: rand() < 0.72 ? randInt(8, 38) : undefined,
    mood: rand() < 0.48 ? pick(MOOD_IDS) : undefined,
    note: rand() < 0.36 ? pick(NOTES) : undefined,
    createdAt: new Date(
      `${input.date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`,
    ).toISOString(),
  };
}

/**
 * Generate ~7 months of believable reading history ending today, with a
 * fluctuating habit and a healthy current streak so the UI looks alive.
 */
function generateSampleEntries(): ReadingEntry[] {
  const today = startOfToday();
  const entries: ReadingEntry[] = [];
  let id = 0;
  const SPAN_DAYS = 224;

  for (let offset = SPAN_DAYS; offset >= 0; offset--) {
    const date = format(subDays(today, offset), "yyyy-MM-dd");

    // Slow seasonal rhythm + noise; the most recent ~10 days are always read
    // to guarantee a satisfying active streak through today.
    const wave = 0.5 + 0.32 * Math.sin(offset / 12);
    const willRead = offset <= 10 ? true : rand() < wave;
    if (!willRead) continue;

    const reads = rand() < 0.24 ? 2 : 1; // some days: an OT + NT rhythm
    for (let i = 0; i < reads; i++) {
      entries.push(buildEntry(makePassage(date), id++));
    }
  }

  return entries;
}

export const SAMPLE_ENTRIES: ReadingEntry[] = generateSampleEntries();
