import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getEventsByMonth } from "@/app/_lib/actions/event.actions";
import { formatDateTime, cn } from "@/app/_lib/utils";
import { EventWithLocationAndCategory } from "@/app/_lib/types";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function todayKey(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
}

function buildGridDates(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const startDay = firstOfMonth.getDay();
  const totalCells = Math.ceil((startDay + lastOfMonth.getDate()) / 7) * 7;
  const dates: Date[] = [];
  for (let i = 0; i < totalCells; i++) {
    dates[i] = new Date(year, month, 1 - startDay + i);
  }
  return dates;
}

interface MonthlyScheduleProps {
  searchParams: { month?: string };
}

export default async function MonthlySchedule({
  searchParams,
}: MonthlyScheduleProps) {
  const now = new Date();
  const etNow = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" }),
  );

  let year = etNow.getFullYear();
  let month = etNow.getMonth();

  if (searchParams.month) {
    const [y, m] = searchParams.month.split("-").map(Number);
    if (y && m >= 1 && m <= 12) {
      year = y;
      month = m - 1;
    }
  }

  const events = await getEventsByMonth({ year, month, isActive: true });

  // Group events by date key
  const eventsByDate = new Map<string, EventWithLocationAndCategory[]>();
  for (const event of events) {
    const dateKey = new Date(event.startDateTime).toLocaleDateString("en-CA", {
      timeZone: "America/New_York",
    });
    const existing = eventsByDate.get(dateKey) || [];
    existing.push(event);
    eventsByDate.set(dateKey, existing);
  }

  const gridDates = buildGridDates(year, month);
  const today = todayKey();

  const monthLabel = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const isCurrentMonth =
    year === etNow.getFullYear() && month === etNow.getMonth();

  // Prev / Next month params
  const prevMonth = month === 0 ? 12 : month;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 1 : month + 2;
  const nextYear = month === 11 ? year + 1 : year;
  const prevParam = `${prevYear}-${String(prevMonth).padStart(2, "0")}`;
  const nextParam = `${nextYear}-${String(nextMonth).padStart(2, "0")}`;

  // Mobile: only days with events in current month
  const daysWithEvents = Array.from(eventsByDate.entries())
    .filter(([key]) => {
      const d = new Date(key + "T12:00:00");
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="flex flex-col gap-4 px-4 pt-3 pb-8 md:px-6 lg:px-12 lg:pt-4 lg:pb-16">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {monthLabel}
        </h2>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href={`/?view=month&month=${prevParam}`}>&larr; Prev</Link>
        </Button>
        {!isCurrentMonth && (
          <Button asChild size="sm" variant="outline">
            <Link href="/?view=month">This Month</Link>
          </Button>
        )}
        <Button asChild size="sm" variant="outline">
          <Link href={`/?view=month&month=${nextParam}`}>Next &rarr;</Link>
        </Button>
      </div>

      {/* Desktop: Calendar grid */}
      <div className="hidden md:block">
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          {DAY_NAMES.map((day) => (
            <div
              key={day}
              className="bg-muted px-2 py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {day}
            </div>
          ))}
          {gridDates.map((date, i) => {
            const key = toDateKey(date);
            const isCurrentMonthDay = date.getMonth() === month;
            const isToday = key === today;
            const dayEvents = eventsByDate.get(key) || [];

            return (
              <div
                key={i}
                className={cn(
                  "bg-background min-h-24 p-1.5",
                  !isCurrentMonthDay && "opacity-40",
                )}
              >
                <span
                  className={cn(
                    "inline-flex items-center justify-center text-xs w-6 h-6 rounded-full",
                    isToday && "bg-primary text-primary-foreground font-bold",
                  )}
                >
                  {date.getDate()}
                </span>
                <div className="mt-0.5 space-y-0.5">
                  {dayEvents.map((event) => (
                    <MonthEventChip key={event.id} event={event} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: stacked days */}
      <div className="flex flex-col gap-3 md:hidden">
        {daysWithEvents.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No classes scheduled this month.
          </p>
        ) : (
          daysWithEvents.map(([dateKey, dayEvents]) => {
            const dateObj = new Date(dateKey + "T12:00:00");
            const isToday = dateKey === today;
            return (
              <div key={dateKey}>
                <div
                  className={cn(
                    "mb-1 rounded-lg px-3 py-2 text-sm font-semibold",
                    isToday
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {formatDateTime(dateObj).dateLongWithoutYear}
                  {isToday && " (Today)"}
                </div>
                <div className="flex flex-col gap-1 pl-1">
                  {dayEvents.map((event) => (
                    <MobileEventCell key={event.id} event={event} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop empty state */}
      {events.length === 0 && (
        <p className="hidden py-4 text-center text-muted-foreground md:block">
          No classes scheduled this month.
        </p>
      )}
    </div>
  );
}

function MonthEventChip({ event }: { event: EventWithLocationAndCategory }) {
  const { timeOnly } = formatDateTime(event.startDateTime);
  const href = event.isHostedExternally
    ? event.externalRegistrationUrl || `/events/${event.id}`
    : `/events/${event.id}`;
  const isExternal = event.isHostedExternally && event.externalRegistrationUrl;

  return (
    <Link
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="block w-full text-[11px] leading-tight px-1.5 py-0.5 rounded truncate bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
    >
      <span className="font-medium">{timeOnly}</span> <span>{event.title}</span>
    </Link>
  );
}

function MobileEventCell({ event }: { event: EventWithLocationAndCategory }) {
  const { timeOnly } = formatDateTime(event.startDateTime);
  const href = event.isHostedExternally
    ? event.externalRegistrationUrl || `/events/${event.id}`
    : `/events/${event.id}`;
  const isExternal = event.isHostedExternally && event.externalRegistrationUrl;

  return (
    <Link
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group rounded-lg border border-border bg-card px-2.5 py-3 transition-colors hover:border-primary hover:bg-primary/5"
    >
      <p className="text-xs font-semibold text-primary">{timeOnly}</p>
      <p className="text-sm font-medium leading-snug text-card-foreground group-hover:text-primary">
        {event.title}
      </p>
      {event.location && (
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {event.location.name}
        </p>
      )}
    </Link>
  );
}
