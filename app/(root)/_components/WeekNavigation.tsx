"use client";

import Link from "next/link";

interface WeekNavigationProps {
  prevWeek: string;
  nextWeek: string;
  hasMoreEvents: boolean;
}

export default function WeekNavigation({
  prevWeek,
  nextWeek,
  hasMoreEvents,
}: WeekNavigationProps) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/?week=${prevWeek}`}
        scroll={false}
        aria-label="Previous week"
        className="px-2 py-1 text-base font-semibold text-muted-foreground transition-colors hover:text-primary"
      >
        &larr;
      </Link>
      {hasMoreEvents ? (
        <Link
          href={`/?week=${nextWeek}`}
          scroll={false}
          aria-label="Next week"
          className="px-2 py-1 text-base font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          &rarr;
        </Link>
      ) : (
        <span
          aria-label="Next week unavailable"
          className="px-2 py-1 text-base font-semibold text-muted-foreground/40"
        >
          &rarr;
        </span>
      )}
    </div>
  );
}
