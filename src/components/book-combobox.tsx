"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BOOKS, getBook, groupColor } from "@/lib/books";
import type { BibleBook } from "@/lib/types";
import { cn } from "@/lib/utils";

export function BookCombobox({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return BOOKS;
    return BOOKS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) || b.abbr.toLowerCase().includes(q),
    );
  }, [query]);

  const selected = value ? getBook(value) : undefined;
  const ot = filtered.filter((b) => b.testament === "OT");
  const nt = filtered.filter((b) => b.testament === "NT");

  const select = (name: string) => {
    onChange(name);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl border border-line bg-card px-4 py-3 text-left transition-colors hover:border-gold/50"
      >
        <span className="flex items-center gap-2.5">
          {selected ? (
            <>
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: groupColor(selected.group) }}
              />
              <span className="font-medium text-ink">{selected.name}</span>
              <span className="font-mono text-[10px] uppercase text-ink-faint">
                {selected.group}
              </span>
            </>
          ) : (
            <span className="text-ink-faint">Choose a book…</span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-ink-faint transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-line bg-card shadow-lift">
          <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-ink-faint" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 66 books…"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
            />
          </div>
          <div className="max-h-64 overflow-y-auto p-1.5">
            {filtered.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-ink-faint">
                No books match “{query}”.
              </p>
            )}
            <BookGroup label="Old Testament" books={ot} value={value} onSelect={select} />
            <BookGroup label="New Testament" books={nt} value={value} onSelect={select} />
          </div>
        </div>
      )}
    </div>
  );
}

function BookGroup({
  label,
  books,
  value,
  onSelect,
}: {
  label: string;
  books: BibleBook[];
  value: string | null;
  onSelect: (name: string) => void;
}) {
  if (books.length === 0) return null;
  return (
    <div className="mb-1">
      <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
        {label}
      </p>
      {books.map((b) => (
        <button
          key={b.name}
          type="button"
          onClick={() => onSelect(b.name)}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-card-2"
        >
          <span className="flex items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: groupColor(b.group) }}
            />
            <span className="text-ink">{b.name}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-ink-faint">
              {b.chapters} ch
            </span>
            {value === b.name && <Check className="h-4 w-4 text-gold" />}
          </span>
        </button>
      ))}
    </div>
  );
}
