import type { BibleBook, BookGroup } from "./types";

/**
 * The 66 books of the Protestant canon with chapter counts and total verse
 * counts (KJV versification). Used for progress, coverage and the log form.
 */
export const BOOKS: BibleBook[] = [
  // ── Old Testament ────────────────────────────────────────────────
  { name: "Genesis", abbr: "GEN", testament: "OT", group: "Law", chapters: 50, verses: 1533 },
  { name: "Exodus", abbr: "EXO", testament: "OT", group: "Law", chapters: 40, verses: 1213 },
  { name: "Leviticus", abbr: "LEV", testament: "OT", group: "Law", chapters: 27, verses: 859 },
  { name: "Numbers", abbr: "NUM", testament: "OT", group: "Law", chapters: 36, verses: 1288 },
  { name: "Deuteronomy", abbr: "DEU", testament: "OT", group: "Law", chapters: 34, verses: 959 },
  { name: "Joshua", abbr: "JOS", testament: "OT", group: "History", chapters: 24, verses: 658 },
  { name: "Judges", abbr: "JDG", testament: "OT", group: "History", chapters: 21, verses: 618 },
  { name: "Ruth", abbr: "RUT", testament: "OT", group: "History", chapters: 4, verses: 85 },
  { name: "1 Samuel", abbr: "1SA", testament: "OT", group: "History", chapters: 31, verses: 810 },
  { name: "2 Samuel", abbr: "2SA", testament: "OT", group: "History", chapters: 24, verses: 695 },
  { name: "1 Kings", abbr: "1KI", testament: "OT", group: "History", chapters: 22, verses: 816 },
  { name: "2 Kings", abbr: "2KI", testament: "OT", group: "History", chapters: 25, verses: 719 },
  { name: "1 Chronicles", abbr: "1CH", testament: "OT", group: "History", chapters: 29, verses: 942 },
  { name: "2 Chronicles", abbr: "2CH", testament: "OT", group: "History", chapters: 36, verses: 822 },
  { name: "Ezra", abbr: "EZR", testament: "OT", group: "History", chapters: 10, verses: 280 },
  { name: "Nehemiah", abbr: "NEH", testament: "OT", group: "History", chapters: 13, verses: 406 },
  { name: "Esther", abbr: "EST", testament: "OT", group: "History", chapters: 10, verses: 167 },
  { name: "Job", abbr: "JOB", testament: "OT", group: "Wisdom", chapters: 42, verses: 1070 },
  { name: "Psalms", abbr: "PSA", testament: "OT", group: "Wisdom", chapters: 150, verses: 2461 },
  { name: "Proverbs", abbr: "PRO", testament: "OT", group: "Wisdom", chapters: 31, verses: 915 },
  { name: "Ecclesiastes", abbr: "ECC", testament: "OT", group: "Wisdom", chapters: 12, verses: 222 },
  { name: "Song of Solomon", abbr: "SNG", testament: "OT", group: "Wisdom", chapters: 8, verses: 117 },
  { name: "Isaiah", abbr: "ISA", testament: "OT", group: "Prophets", chapters: 66, verses: 1292 },
  { name: "Jeremiah", abbr: "JER", testament: "OT", group: "Prophets", chapters: 52, verses: 1364 },
  { name: "Lamentations", abbr: "LAM", testament: "OT", group: "Prophets", chapters: 5, verses: 154 },
  { name: "Ezekiel", abbr: "EZK", testament: "OT", group: "Prophets", chapters: 48, verses: 1273 },
  { name: "Daniel", abbr: "DAN", testament: "OT", group: "Prophets", chapters: 12, verses: 357 },
  { name: "Hosea", abbr: "HOS", testament: "OT", group: "Prophets", chapters: 14, verses: 197 },
  { name: "Joel", abbr: "JOL", testament: "OT", group: "Prophets", chapters: 3, verses: 73 },
  { name: "Amos", abbr: "AMO", testament: "OT", group: "Prophets", chapters: 9, verses: 146 },
  { name: "Obadiah", abbr: "OBA", testament: "OT", group: "Prophets", chapters: 1, verses: 21 },
  { name: "Jonah", abbr: "JON", testament: "OT", group: "Prophets", chapters: 4, verses: 48 },
  { name: "Micah", abbr: "MIC", testament: "OT", group: "Prophets", chapters: 7, verses: 105 },
  { name: "Nahum", abbr: "NAM", testament: "OT", group: "Prophets", chapters: 3, verses: 47 },
  { name: "Habakkuk", abbr: "HAB", testament: "OT", group: "Prophets", chapters: 3, verses: 56 },
  { name: "Zephaniah", abbr: "ZEP", testament: "OT", group: "Prophets", chapters: 3, verses: 53 },
  { name: "Haggai", abbr: "HAG", testament: "OT", group: "Prophets", chapters: 2, verses: 38 },
  { name: "Zechariah", abbr: "ZEC", testament: "OT", group: "Prophets", chapters: 14, verses: 211 },
  { name: "Malachi", abbr: "MAL", testament: "OT", group: "Prophets", chapters: 4, verses: 55 },
  // ── New Testament ────────────────────────────────────────────────
  { name: "Matthew", abbr: "MAT", testament: "NT", group: "Gospels", chapters: 28, verses: 1071 },
  { name: "Mark", abbr: "MRK", testament: "NT", group: "Gospels", chapters: 16, verses: 678 },
  { name: "Luke", abbr: "LUK", testament: "NT", group: "Gospels", chapters: 24, verses: 1151 },
  { name: "John", abbr: "JHN", testament: "NT", group: "Gospels", chapters: 21, verses: 879 },
  { name: "Acts", abbr: "ACT", testament: "NT", group: "Acts", chapters: 28, verses: 1007 },
  { name: "Romans", abbr: "ROM", testament: "NT", group: "Epistles", chapters: 16, verses: 433 },
  { name: "1 Corinthians", abbr: "1CO", testament: "NT", group: "Epistles", chapters: 16, verses: 437 },
  { name: "2 Corinthians", abbr: "2CO", testament: "NT", group: "Epistles", chapters: 13, verses: 257 },
  { name: "Galatians", abbr: "GAL", testament: "NT", group: "Epistles", chapters: 6, verses: 149 },
  { name: "Ephesians", abbr: "EPH", testament: "NT", group: "Epistles", chapters: 6, verses: 155 },
  { name: "Philippians", abbr: "PHP", testament: "NT", group: "Epistles", chapters: 4, verses: 104 },
  { name: "Colossians", abbr: "COL", testament: "NT", group: "Epistles", chapters: 4, verses: 95 },
  { name: "1 Thessalonians", abbr: "1TH", testament: "NT", group: "Epistles", chapters: 5, verses: 89 },
  { name: "2 Thessalonians", abbr: "2TH", testament: "NT", group: "Epistles", chapters: 3, verses: 47 },
  { name: "1 Timothy", abbr: "1TI", testament: "NT", group: "Epistles", chapters: 6, verses: 113 },
  { name: "2 Timothy", abbr: "2TI", testament: "NT", group: "Epistles", chapters: 4, verses: 83 },
  { name: "Titus", abbr: "TIT", testament: "NT", group: "Epistles", chapters: 3, verses: 46 },
  { name: "Philemon", abbr: "PHM", testament: "NT", group: "Epistles", chapters: 1, verses: 25 },
  { name: "Hebrews", abbr: "HEB", testament: "NT", group: "Epistles", chapters: 13, verses: 303 },
  { name: "James", abbr: "JAS", testament: "NT", group: "Epistles", chapters: 5, verses: 108 },
  { name: "1 Peter", abbr: "1PE", testament: "NT", group: "Epistles", chapters: 5, verses: 105 },
  { name: "2 Peter", abbr: "2PE", testament: "NT", group: "Epistles", chapters: 3, verses: 61 },
  { name: "1 John", abbr: "1JN", testament: "NT", group: "Epistles", chapters: 5, verses: 105 },
  { name: "2 John", abbr: "2JN", testament: "NT", group: "Epistles", chapters: 1, verses: 13 },
  { name: "3 John", abbr: "3JN", testament: "NT", group: "Epistles", chapters: 1, verses: 14 },
  { name: "Jude", abbr: "JUD", testament: "NT", group: "Epistles", chapters: 1, verses: 25 },
  { name: "Revelation", abbr: "REV", testament: "NT", group: "Apocalyptic", chapters: 22, verses: 404 },
];

export const TOTAL_CHAPTERS = BOOKS.reduce((sum, b) => sum + b.chapters, 0); // 1189
export const TOTAL_VERSES = BOOKS.reduce((sum, b) => sum + b.verses, 0); // 31,102

const BOOK_BY_NAME = new Map(BOOKS.map((b) => [b.name, b]));

/** Look up a book by its exact canonical name. */
export function getBook(name: string): BibleBook | undefined {
  return BOOK_BY_NAME.get(name);
}

/** Average verses per chapter — used to estimate verses from chapter ranges. */
export function avgVersesPerChapter(book: BibleBook): number {
  return book.verses / book.chapters;
}

export const GROUP_ORDER: BookGroup[] = [
  "Law",
  "History",
  "Wisdom",
  "Prophets",
  "Gospels",
  "Acts",
  "Epistles",
  "Apocalyptic",
];

/** Each canonical group maps to a themed accent token. */
const GROUP_VAR: Record<BookGroup, string> = {
  Law: "--gold",
  History: "--rubric",
  Wisdom: "--sage",
  Prophets: "--lapis",
  Gospels: "--ember",
  Acts: "--plum",
  Epistles: "--gold-bright",
  Apocalyptic: "--rubric",
};

/** CSS `var(...)` for a group's accent colour (theme-aware). */
export function groupColor(group: BookGroup): string {
  return `var(${GROUP_VAR[group]})`;
}
