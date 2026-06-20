export interface Verse {
  text: string;
  ref: string;
}

/** A small rotation of verses for the daily reflection card. */
export const VERSES: Verse[] = [
  { text: "Thy word is a lamp unto my feet, and a light unto my path.", ref: "Psalm 119:105" },
  { text: "Be still, and know that I am God.", ref: "Psalm 46:10" },
  { text: "Man shall not live by bread alone, but by every word of God.", ref: "Luke 4:4" },
  { text: "The grass withers, the flower fades, but the word of our God stands forever.", ref: "Isaiah 40:8" },
  { text: "Your words were found, and I ate them, and they became to me a joy.", ref: "Jeremiah 15:16" },
  { text: "Blessed are those who hear the word of God and keep it.", ref: "Luke 11:28" },
  { text: "I have stored up your word in my heart, that I might not sin against you.", ref: "Psalm 119:11" },
  { text: "All scripture is given by inspiration of God, and is profitable.", ref: "2 Timothy 3:16" },
  { text: "Let the word of Christ dwell in you richly.", ref: "Colossians 3:16" },
  { text: "In the beginning was the Word, and the Word was with God.", ref: "John 1:1" },
  { text: "Heaven and earth shall pass away, but my words shall not pass away.", ref: "Matthew 24:35" },
  { text: "Open my eyes, that I may behold wondrous things out of your law.", ref: "Psalm 119:18" },
  { text: "The unfolding of your words gives light; it gives understanding.", ref: "Psalm 119:130" },
  { text: "As newborn babes, desire the sincere milk of the word.", ref: "1 Peter 2:2" },
];

/** Deterministic verse for the current calendar day. */
export function verseForToday(date: Date = new Date()): Verse {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  return VERSES[dayOfYear % VERSES.length];
}
