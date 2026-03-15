"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface WeekNavigationProps {
  prevWeek: string;
  nextWeek: string;
  isCurrentWeek: boolean;
}

export default function WeekNavigation({
  prevWeek,
  nextWeek,
  isCurrentWeek,
}: WeekNavigationProps) {
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href={`/?week=${prevWeek}`}>&larr; Prev</Link>
      </Button>
      {!isCurrentWeek && (
        <Button asChild size="sm" variant="outline">
          <Link href="/">This Week</Link>
        </Button>
      )}
      <Button asChild size="sm" variant="outline">
        <Link href={`/?week=${nextWeek}`}>Next &rarr;</Link>
      </Button>
    </div>
  );
}
