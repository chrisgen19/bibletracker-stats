import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SAMPLE_ENTRIES } from "./mock-data";
import { makeEntry } from "./reading";
import type { ReadingEntry, ReadingInput } from "./types";

interface ReadingState {
  entries: ReadingEntry[];
  addEntry: (input: ReadingInput) => ReadingEntry;
  removeEntry: (id: string) => void;
  resetToSample: () => void;
  clearAll: () => void;
}

/* localStorage is undefined during SSR; fall back to a no-op store. */
const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useReadingStore = create<ReadingState>()(
  persist(
    (set, get) => ({
      entries: SAMPLE_ENTRIES,
      addEntry: (input) => {
        const entry = makeEntry(input);
        set({ entries: [entry, ...get().entries] });
        return entry;
      },
      removeEntry: (id) =>
        set({ entries: get().entries.filter((e) => e.id !== id) }),
      resetToSample: () => set({ entries: SAMPLE_ENTRIES }),
      clearAll: () => set({ entries: [] }),
    }),
    {
      name: "selah-readings",
      version: 1,
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage,
      ),
      partialize: (state) => ({ entries: state.entries }),
    },
  ),
);
