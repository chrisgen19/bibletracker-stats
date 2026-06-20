export type Testament = "OT" | "NT";

/** Canonical groupings used for colour-coding across the app. */
export type BookGroup =
  | "Law"
  | "History"
  | "Wisdom"
  | "Prophets"
  | "Gospels"
  | "Acts"
  | "Epistles"
  | "Apocalyptic";

export interface BibleBook {
  name: string;
  abbr: string;
  testament: Testament;
  group: BookGroup;
  /** Number of chapters in the book. */
  chapters: number;
  /** Total verses in the book (KJV versification). */
  verses: number;
}

/** A reflective tone the reader can optionally attach to a reading. */
export type Mood =
  | "grateful"
  | "peaceful"
  | "convicted"
  | "curious"
  | "joyful"
  | "comforted";

export interface ReadingEntry {
  id: string;
  /** Calendar day the reading happened — ISO `yyyy-mm-dd`. */
  date: string;
  /** Book name; matches a {@link BibleBook} name. */
  book: string;
  startChapter: number;
  endChapter: number;
  /** Present only when the reader logged a partial-chapter (per-verse) read. */
  startVerse?: number;
  endVerse?: number;
  /** Derived count of chapters touched by this entry. */
  chaptersRead: number;
  /** Derived (estimated) count of verses read, used for stats. */
  versesRead: number;
  minutes?: number;
  mood?: Mood;
  note?: string;
  createdAt: string;
}

/** Shape submitted by the log form before derived fields are computed. */
export interface ReadingInput {
  date: string;
  book: string;
  startChapter: number;
  endChapter: number;
  startVerse?: number;
  endVerse?: number;
  minutes?: number;
  mood?: Mood;
  note?: string;
}

export type Period = "week" | "month" | "year";
