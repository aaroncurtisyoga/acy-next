"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/app/_lib/utils";

export default function ScheduleToggle() {
  const searchParams = useSearchParams();
  const isMonthView = searchParams.get("view") === "month";

  const base =
    "px-1.5 py-1 text-sm font-semibold lowercase tracking-wide transition-colors";

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/"
        className={cn(
          base,
          !isMonthView
            ? "text-foreground underline decoration-primary decoration-2 underline-offset-4"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        week
      </Link>
      <span className="text-muted-foreground/40">·</span>
      <Link
        href="/?view=month"
        className={cn(
          base,
          isMonthView
            ? "text-foreground underline decoration-primary decoration-2 underline-offset-4"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        month
      </Link>
    </div>
  );
}
