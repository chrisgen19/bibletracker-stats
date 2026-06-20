import Link from "next/link";
import { cn } from "@/lib/utils";

/** A small oil-lamp flame in a parchment seal — "Thy word is a lamp" (Ps 119:105). */
export function LampMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none">
      <rect
        x="1.1"
        y="1.1"
        width="29.8"
        height="29.8"
        rx="9"
        fill="var(--card)"
        stroke="var(--gold)"
        strokeWidth="1.3"
      />
      <path
        d="M16 6c3.5 4.1 5.3 6.6 5.3 9.8a5.3 5.3 0 1 1-10.6 0C10.7 12.6 12.5 10.1 16 6Z"
        fill="var(--gold)"
      />
      <path
        d="M16 12.4c1.6 2.1 2.3 3.3 2.3 4.7a2.3 2.3 0 1 1-4.6 0c0-1.4.7-2.6 2.3-4.7Z"
        fill="var(--gold-bright)"
      />
    </svg>
  );
}

export function Brand({
  collapsed = false,
  className,
}: {
  collapsed?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Selah — home"
    >
      <LampMark className="h-9 w-9 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5" />
      {!collapsed && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.35rem] font-semibold tracking-tight text-ink">
            Selah<span className="text-gold">.</span>
          </span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-ink-faint">
            reading journal
          </span>
        </span>
      )}
    </Link>
  );
}
