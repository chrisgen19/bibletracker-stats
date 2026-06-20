"use client";

import {
  differenceInCalendarDays,
  eachMonthOfInterval,
  endOfMonth,
  format,
  isAfter,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfToday,
} from "date-fns";
import {
  AlignLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock,
  Flame,
  Quote,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EntryCard } from "@/components/entry-card";
import { MonthCalendar } from "@/components/month-calendar";
import { PeriodToggle } from "@/components/period-toggle";
import { ReadingHeatmap } from "@/components/reading-heatmap";
import type { BarPoint } from "@/components/ui/bar-chart";
import { BarChart } from "@/components/ui/bar-chart";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Reveal } from "@/components/ui/reveal";
import { StatTile } from "@/components/ui/stat-tile";
import { TOTAL_CHAPTERS } from "@/lib/books";
import {
  computeCoverage,
  computeStreak,
  denseDays,
  entriesInRange,
  PERIOD_LABEL,
  periodRange,
  summarize,
} from "@/lib/reading";
import { useReadingStore } from "@/lib/store";
import type { Period, ReadingEntry } from "@/lib/types";
import { useHydrated } from "@/lib/use-hydrated";
import { formatNumber } from "@/lib/utils";
import { verseForToday } from "@/lib/verses";

function formatMinutes(total: number): string {
  if (total < 60) return `${total} min`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function rhythmPoints(
  entries: ReadingEntry[],
  period: Period,
  today: Date,
): BarPoint[] {
  const range = periodRange(period, today);

  if (period === "year") {
    return eachMonthOfInterval({ start: range.start, end: range.end }).map((m) => {
      const monthRange = { start: startOfMonth(m), end: endOfMonth(m) };
      const value = entriesInRange(entries, monthRange).reduce(
        (sum, e) => sum + e.chaptersRead,
        0,
      );
      return {
        label: format(m, "LLLLL"),
        fullLabel: format(m, "MMMM yyyy"),
        value,
        highlight: isSameMonth(m, today),
      };
    });
  }

  return denseDays(entries, range).map((d) => {
    const dayNum = d.date.getDate();
    const label =
      period === "week"
        ? format(d.date, "EEEEE")
        : dayNum === 1 || dayNum % 5 === 0
          ? String(dayNum)
          : "";
    return {
      label,
      fullLabel: format(d.date, "EEE, MMM d"),
      value: d.chapters,
      highlight: isToday(d.date),
    };
  });
}

export default function OverviewPage() {
  const hydrated = useHydrated();
  const entries = useReadingStore((s) => s.entries);
  const [period, setPeriod] = useState<Period>("month");

  const data = useMemo(() => {
    const today = startOfToday();
    const range = periodRange(period, today);
    const periodEntries = entriesInRange(entries, range);
    const summary = summarize(periodEntries);
    const cappedEnd = isAfter(range.end, today) ? today : range.end;
    const daysElapsed = differenceInCalendarDays(cappedEnd, range.start) + 1;
    const consistency = Math.min(1, summary.days / Math.max(1, daysElapsed));

    return {
      summary,
      daysElapsed,
      consistency,
      streak: computeStreak(entries),
      coverage: computeCoverage(entries),
      points: rhythmPoints(entries, period, today),
      recent: [...entries]
        .sort((a, b) =>
          a.date === b.date
            ? b.createdAt.localeCompare(a.createdAt)
            : b.date.localeCompare(a.date),
        )
        .slice(0, 3),
      year: today.getFullYear(),
    };
  }, [entries, period]);

  if (!hydrated) return <DashboardSkeleton />;

  const {
    summary,
    daysElapsed,
    consistency,
    streak,
    coverage,
    points,
    recent,
    year,
  } = data;
  const verse = verseForToday();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-ink-faint">
          {format(new Date(), "EEEE, MMMM d")}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {greeting}.
        </h1>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Month at a glance */}
        <Reveal delay={0.04} className="lg:col-span-12">
          <MonthCalendar entries={entries} />
        </Reveal>

        {/* Period scope for the summary tiles below */}
        <Reveal delay={0.06} className="lg:col-span-12">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
              Reading summary
            </p>
            <PeriodToggle value={period} onChange={setPeriod} />
          </div>
        </Reveal>

        {/* Streak / lamp */}
        <Reveal delay={0.08} className="lg:col-span-5">
          <div className="surface relative flex h-full flex-col justify-between overflow-hidden rounded-card p-6">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 glow-gold opacity-70" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  Reading rhythm
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold text-ink">
                  Keep the lamp lit
                </h2>
              </div>
              <Flame className="h-5 w-5 animate-flicker text-ember" />
            </div>

            <div className="relative mt-6 flex items-center gap-6">
              <ProgressRing value={consistency} size={124}>
                <div>
                  <p className="font-display text-2xl font-semibold text-ink">
                    {Math.round(consistency * 100)}%
                  </p>
                  <p className="text-[9px] font-medium uppercase tracking-wider text-ink-faint">
                    {PERIOD_LABEL[period]}
                  </p>
                </div>
              </ProgressRing>
              <div>
                <p className="font-display text-4xl font-semibold leading-none text-gilded">
                  {streak.current}
                  <span className="ml-1 font-sans text-base font-normal text-ink-faint">
                    day{streak.current === 1 ? "" : "s"}
                  </span>
                </p>
                <p className="mt-1 text-xs text-ink-faint">
                  current streak · best {streak.longest}
                </p>
                <p className="mt-4 text-sm text-ink-soft">
                  Read on{" "}
                  <span className="font-semibold text-ink">{summary.days}</span> of{" "}
                  {daysElapsed} days in view.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Stat tiles */}
        <Reveal delay={0.12} className="lg:col-span-7">
          <div className="grid h-full grid-cols-2 gap-4">
            <StatTile
              icon={BookOpen}
              label="Chapters"
              value={formatNumber(summary.chapters)}
              hint={PERIOD_LABEL[period]}
              accent="var(--gold)"
            />
            <StatTile
              icon={AlignLeft}
              label="Verses"
              value={formatNumber(summary.verses)}
              hint="est. from passages"
              accent="var(--lapis)"
            />
            <StatTile
              icon={CalendarDays}
              label="Days read"
              value={summary.days}
              hint={`${summary.entries} reading${summary.entries === 1 ? "" : "s"}`}
              accent="var(--sage)"
            />
            <StatTile
              icon={Clock}
              label="Time"
              value={formatMinutes(summary.minutes)}
              hint="logged with readings"
              accent="var(--ember)"
            />
          </div>
        </Reveal>

        {/* Rhythm chart */}
        <Reveal delay={0.16} className="lg:col-span-7">
          <div className="surface flex h-full flex-col rounded-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  Rhythm
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold text-ink">
                  Chapters {PERIOD_LABEL[period].toLowerCase()}
                </h2>
              </div>
              <span className="text-sm text-ink-faint">
                {formatNumber(summary.chapters)} total
              </span>
            </div>
            <div className="mt-6 flex-1">
              <BarChart points={points} />
            </div>
          </div>
        </Reveal>

        {/* Bible progress */}
        <Reveal delay={0.2} className="lg:col-span-5">
          <div className="surface flex h-full flex-col rounded-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  Scripture map
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold text-ink">
                  Bible covered
                </h2>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-5">
              <ProgressRing value={coverage.percent / 100} size={108} stroke={10}>
                <p className="font-display text-xl font-semibold text-ink">
                  {coverage.percent.toFixed(1)}%
                </p>
              </ProgressRing>
              <div className="space-y-2 text-sm">
                <p className="text-ink-soft">
                  <span className="font-semibold text-ink">
                    {coverage.chaptersCovered}
                  </span>{" "}
                  of {formatNumber(TOTAL_CHAPTERS)} chapters
                </p>
                <p className="text-xs text-ink-faint">
                  OT {coverage.byTestament.OT} · NT {coverage.byTestament.NT}
                </p>
              </div>
            </div>
            <Link
              href="/progress"
              className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-ink-soft transition-colors hover:text-gold"
            >
              Explore the map
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        {/* Year in light */}
        <Reveal delay={0.24} className="lg:col-span-8">
          <div className="surface flex h-full flex-col rounded-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  This year in light
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold text-ink">
                  {year}
                </h2>
              </div>
            </div>
            <div className="mt-5">
              <ReadingHeatmap entries={entries} />
            </div>
          </div>
        </Reveal>

        {/* Daily verse */}
        <Reveal delay={0.28} className="lg:col-span-4">
          <div className="surface relative flex h-full flex-col justify-between overflow-hidden rounded-card p-6">
            <div className="pointer-events-none absolute inset-0 glow-gold opacity-60" />
            <Quote className="relative h-7 w-7 text-gold" />
            <p className="relative mt-4 font-display text-lg italic leading-relaxed text-ink">
              “{verse.text}”
            </p>
            <p className="relative mt-4 font-mono text-xs uppercase tracking-wider text-ink-faint">
              {verse.ref}
            </p>
          </div>
        </Reveal>

        {/* Lately */}
        <Reveal delay={0.32} className="lg:col-span-12">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ink">Lately</h2>
              <Link
                href="/journal"
                className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft transition-colors hover:text-gold"
              >
                All entries
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {recent.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recent.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            ) : (
              <div className="surface rounded-card p-8 text-center text-sm text-ink-faint">
                No readings yet — tap{" "}
                <span className="font-medium text-ink">Log a reading</span> to begin.
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function SkeletonBox({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-card border border-line bg-card-2 ${className}`}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-card-2" />
          <div className="h-9 w-56 animate-pulse rounded bg-card-2" />
        </div>
        <div className="h-9 w-48 animate-pulse rounded-full bg-card-2" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <SkeletonBox className="h-52 lg:col-span-5" />
        <SkeletonBox className="h-52 lg:col-span-7" />
        <SkeletonBox className="h-56 lg:col-span-7" />
        <SkeletonBox className="h-56 lg:col-span-5" />
        <SkeletonBox className="h-48 lg:col-span-8" />
        <SkeletonBox className="h-48 lg:col-span-4" />
        <SkeletonBox className="h-40 lg:col-span-12" />
      </div>
    </div>
  );
}
