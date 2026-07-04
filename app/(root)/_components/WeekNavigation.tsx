"use client";

import Link from "next/link";

interface WeekNavigationProps {
  prevWeek: string;
  nextWeek: string;
  isCurrentWeek: boolean;
  hasMoreEvents: boolean;
}

const linkClass =
  "px-1.5 py-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground";
const disabledClass =
  "px-1.5 py-1 text-sm font-semibold text-muted-foreground/40";

export default function WeekNavigation({
  prevWeek,
  nextWeek,
  isCurrentWeek,
  hasMoreEvents,
}: WeekNavigationProps) {
  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/?week=${prevWeek}`}
        aria-label="Previous week"
        className={linkClass}
      >
        &larr;
      </Link>
      {isCurrentWeek ? (
        <span className={`${disabledClass} lowercase tracking-wide`}>
          today
        </span>
      ) : (
        <Link href="/" className={`${linkClass} lowercase tracking-wide`}>
          today
        </Link>
      )}
      {hasMoreEvents ? (
        <Link
          href={`/?week=${nextWeek}`}
          aria-label="Next week"
          className={linkClass}
        >
          &rarr;
        </Link>
      ) : (
        <span aria-label="Next week unavailable" className={disabledClass}>
          &rarr;
        </span>
      )}
    </div>
  );
}
