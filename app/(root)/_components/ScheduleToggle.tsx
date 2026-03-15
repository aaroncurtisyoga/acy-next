"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/app/_lib/utils";

export default function ScheduleToggle() {
  const searchParams = useSearchParams();
  const isMonthView = searchParams.get("view") === "month";

  return (
    <div className="inline-flex items-center rounded-lg bg-muted p-1 text-sm">
      <Link
        href="/"
        className={cn(
          "rounded-md px-3 py-1 font-medium transition-colors",
          !isMonthView
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        Week
      </Link>
      <Link
        href="/?view=month"
        className={cn(
          "rounded-md px-3 py-1 font-medium transition-colors",
          isMonthView
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        Month
      </Link>
    </div>
  );
}
