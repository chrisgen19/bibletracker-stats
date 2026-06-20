"use client";

import { BookMarked, CheckCircle2, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Reveal } from "@/components/ui/reveal";
import { BOOKS, GROUP_ORDER, groupColor, TOTAL_CHAPTERS } from "@/lib/books";
import { computeCoverage } from "@/lib/reading";
import type { Coverage as CoverageType } from "@/lib/reading";
import { useReadingStore } from "@/lib/store";
import type { BibleBook } from "@/lib/types";
import { useHydrated } from "@/lib/use-hydrated";

const OT_TOTAL = BOOKS.filter((b) => b.testament === "OT").reduce(
  (s, b) => s + b.chapters,
  0,
);
const NT_TOTAL = TOTAL_CHAPTERS - OT_TOTAL;

function coveredFor(coverage: CoverageType, book: BibleBook): number {
  return Math.min(coverage.byBook.get(book.name)?.size ?? 0, book.chapters);
}

export default function ProgressPage() {
  const hydrated = useHydrated();
  const entries = useReadingStore((s) => s.entries);

  const { coverage, started, completed } = useMemo(() => {
    const cov = computeCoverage(entries);
    let started = 0;
    let completed = 0;
    for (const book of BOOKS) {
      const c = coveredFor(cov, book);
      if (c > 0) started++;
      if (c >= book.chapters) completed++;
    }
    return { coverage: cov, started, completed };
  }, [entries]);

  if (!hydrated) return <ProgressSkeleton />;

  const rings = [
    {
      label: "Whole Bible",
      value: coverage.percent / 100,
      covered: coverage.chaptersCovered,
      total: TOTAL_CHAPTERS,
      color: "var(--gold)",
    },
    {
      label: "Old Testament",
      value: coverage.byTestament.OT / OT_TOTAL,
      covered: coverage.byTestament.OT,
      total: OT_TOTAL,
      color: "var(--lapis)",
    },
    {
      label: "New Testament",
      value: coverage.byTestament.NT / NT_TOTAL,
      covered: coverage.byTestament.NT,
      total: NT_TOTAL,
      color: "var(--ember)",
    },
  ];

  return (
    <div className="space-y-7">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
          Scripture map
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Your progress
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Every chapter you&apos;ve touched, lit up across the whole canon.
        </p>
      </header>

      {/* Rings */}
      <Reveal delay={0.04}>
        <div className="grid gap-4 sm:grid-cols-3">
          {rings.map((r) => (
            <div
              key={r.label}
              className="surface flex items-center gap-5 rounded-card p-5"
            >
              <ProgressRing value={r.value} size={104} stroke={9} color={r.color}>
                <p className="font-display text-lg font-semibold text-ink">
                  {Math.round(r.value * 100)}%
                </p>
              </ProgressRing>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  {r.label}
                </p>
                <p className="mt-1 font-display text-2xl font-semibold text-ink">
                  {r.covered}
                  <span className="text-base font-normal text-ink-faint">
                    {" "}
                    / {r.total}
                  </span>
                </p>
                <p className="text-xs text-ink-faint">chapters read</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Quick stats */}
      <Reveal delay={0.08}>
        <div className="surface flex flex-wrap items-center justify-around gap-6 rounded-card px-6 py-5 text-center">
          <Stat icon={<BookMarked className="h-5 w-5 text-gold" />} value={`${started}`} label="books started" sub="of 66" />
          <span className="hidden h-10 w-px bg-line sm:block" />
          <Stat icon={<CheckCircle2 className="h-5 w-5 text-sage" />} value={`${completed}`} label="books finished" sub="every chapter read" />
          <span className="hidden h-10 w-px bg-line sm:block" />
          <Stat icon={<Sparkles className="h-5 w-5 text-ember" />} value={`${coverage.chaptersCovered}`} label="chapters covered" sub={`of ${TOTAL_CHAPTERS}`} />
        </div>
      </Reveal>

      {/* By group */}
      <Reveal delay={0.12}>
        <div className="grid gap-4 lg:grid-cols-2">
          {GROUP_ORDER.map((group) => {
            const books = BOOKS.filter((b) => b.group === group);
            const totalCh = books.reduce((s, b) => s + b.chapters, 0);
            const coveredCh = books.reduce((s, b) => s + coveredFor(coverage, b), 0);
            return (
              <div key={group} className="surface rounded-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: groupColor(group) }}
                    />
                    <h2 className="font-display text-lg font-semibold text-ink">
                      {group}
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-ink-faint">
                    {coveredCh}/{totalCh}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {books.map((book) => (
                    <BookRow key={book.name} book={book} coverage={coverage} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}

function BookRow({ book, coverage }: { book: BibleBook; coverage: CoverageType }) {
  const covered = coveredFor(coverage, book);
  const pct = (covered / book.chapters) * 100;
  const done = covered >= book.chapters;
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 truncate text-sm text-ink sm:w-36">
        {book.name}
      </span>
      <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-line-soft">
        <span
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: groupColor(book.group),
            opacity: covered === 0 ? 0 : 1,
          }}
        />
      </span>
      <span
        className={`w-14 shrink-0 text-right font-mono text-[11px] ${done ? "text-sage" : "text-ink-faint"}`}
      >
        {covered}/{book.chapters}
      </span>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
  sub,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      {icon}
      <p className="mt-1 font-display text-2xl font-semibold text-ink">{value}</p>
      <p className="text-xs font-medium text-ink-soft">{label}</p>
      <p className="text-[10px] uppercase tracking-wider text-ink-faint">{sub}</p>
    </div>
  );
}

function ProgressSkeleton() {
  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <div className="h-4 w-32 animate-pulse rounded bg-card-2" />
        <div className="h-9 w-56 animate-pulse rounded bg-card-2" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-card border border-line bg-card-2"
          />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-56 animate-pulse rounded-card border border-line bg-card-2"
          />
        ))}
      </div>
    </div>
  );
}
