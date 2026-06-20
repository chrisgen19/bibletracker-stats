"use client";

import { Flame } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { computeStreak } from "@/lib/reading";
import { useReadingStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";
import { Brand } from "./brand";
import { isNavActive, LOG_ITEM, NAV_ITEMS } from "./nav";
import { ThemeToggle } from "./theme-toggle";

const spring = { type: "spring" as const, stiffness: 380, damping: 32 };

function StreakBadge() {
  const hydrated = useHydrated();
  const entries = useReadingStore((s) => s.entries);
  const streak = hydrated ? computeStreak(entries).current : 0;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-line bg-card-2 px-4 py-3">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-ember/12">
          <Flame
            className={cn(
              "h-[18px] w-[18px] text-ember",
              hydrated && streak > 0 && "animate-flicker",
            )}
          />
        </span>
        <div className="leading-tight">
          <p className="font-display text-lg font-semibold text-ink">
            {hydrated ? streak : "—"}
            <span className="ml-1 text-xs font-normal text-ink-faint">
              day{streak === 1 ? "" : "s"}
            </span>
          </p>
          <p className="text-[11px] uppercase tracking-wider text-ink-faint">
            current streak
          </p>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh">
      {/* ───────── Desktop sidebar ───────── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-line bg-paper-2/70 px-5 py-7 backdrop-blur-sm lg:flex">
        <Brand className="px-1.5" />

        <nav className="mt-10 flex flex-col gap-1">
          <p className="mb-2 px-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
            Journal
          </p>
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm"
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    transition={spring}
                    className="absolute inset-0 rounded-xl bg-gold/10 ring-1 ring-gold/25"
                  />
                )}
                <item.icon
                  className={cn(
                    "relative h-[18px] w-[18px] transition-colors",
                    active
                      ? "text-gold"
                      : "text-ink-faint group-hover:text-ink",
                  )}
                />
                <span
                  className={cn(
                    "relative font-medium transition-colors",
                    active ? "text-ink" : "text-ink-soft group-hover:text-ink",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <Link
          href={LOG_ITEM.href}
          className="group mt-6 flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-paper shadow-lift transition-transform hover:-translate-y-0.5 active:translate-y-0 dark:bg-gold dark:text-[#171206]"
        >
          <LOG_ITEM.icon className="h-[18px] w-[18px] transition-transform group-hover:-rotate-12" />
          Log a reading
        </Link>

        <div className="mt-auto flex flex-col gap-4 pt-6">
          <StreakBadge />
          <div className="flex items-center justify-between px-1">
            <p className="font-display text-sm italic text-ink-faint">
              “Be still, and know.”
            </p>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* ───────── Mobile top bar ───────── */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-paper/85 px-5 py-3 backdrop-blur-md lg:hidden">
        <Brand />
        <ThemeToggle />
      </header>

      {/* ───────── Main content ───────── */}
      <main className="min-h-dvh pb-28 lg:pb-0 lg:pl-[264px]">
        <div className="mx-auto w-full max-w-6xl px-5 py-7 sm:px-8 lg:py-12">
          {children}
        </div>
      </main>

      {/* ───────── Mobile bottom nav ───────── */}
      <MobileNav pathname={pathname} />
    </div>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  const left = NAV_ITEMS.slice(0, 2);
  const right = NAV_ITEMS.slice(2);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="mx-auto flex max-w-md items-end justify-between gap-1 border-t border-line bg-paper/90 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md">
        {left.map((item) => (
          <MobileTab key={item.href} item={item} active={isNavActive(pathname, item.href)} />
        ))}

        {/* Raised center "log" action */}
        <Link
          href={LOG_ITEM.href}
          aria-label={LOG_ITEM.label}
          className="group -mt-7 grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink text-paper shadow-lift ring-4 ring-paper transition-transform active:scale-95 dark:bg-gold dark:text-[#171206] dark:ring-paper"
        >
          <LOG_ITEM.icon className="h-6 w-6 transition-transform group-hover:-rotate-12" />
        </Link>

        {right.map((item) => (
          <MobileTab key={item.href} item={item} active={isNavActive(pathname, item.href)} />
        ))}
        <MobileTabThemeSlot />
      </div>
    </nav>
  );
}

function MobileTab({
  item,
  active,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      className="relative flex w-14 flex-col items-center gap-1 py-1.5"
    >
      {active && (
        <motion.span
          layoutId="mobile-active"
          transition={spring}
          className="absolute -top-0.5 h-1 w-6 rounded-full bg-gold"
        />
      )}
      <item.icon
        className={cn(
          "h-[22px] w-[22px] transition-colors",
          active ? "text-gold" : "text-ink-faint",
        )}
      />
      <span
        className={cn(
          "text-[10px] font-medium transition-colors",
          active ? "text-ink" : "text-ink-faint",
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}

function MobileTabThemeSlot() {
  return (
    <div className="flex w-14 flex-col items-center gap-1 py-1.5">
      <ThemeToggle className="h-[22px] w-[22px] border-0 bg-transparent text-ink-faint hover:text-ink" />
      <span className="text-[10px] font-medium text-ink-faint">Theme</span>
    </div>
  );
}
