import { Suspense } from "react";
import Link from "next/link";
import { getEventsByWeek } from "@/app/_lib/actions/event.actions";
import { formatDateTime } from "@/app/_lib/utils";
import { EventWithLocationAndCategory } from "@/app/_lib/types";
import WeekNavigation from "./WeekNavigation";
import ScheduleToggle from "./ScheduleToggle";

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  // Get the day in ET
  const etDate = new Date(
    d.toLocaleString("en-US", { timeZone: "America/New_York" }),
  );
  const day = etDate.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday = 1
  etDate.setDate(etDate.getDate() + diff);
  etDate.setHours(0, 0, 0, 0);
  return etDate;
}

function toISODateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

interface WeeklyScheduleProps {
  searchParams: { week?: string };
}

export default async function WeeklySchedule({
  searchParams,
}: WeeklyScheduleProps) {
  const now = new Date();
  const weekStart = searchParams.week
    ? getMondayOfWeek(new Date(searchParams.week + "T12:00:00"))
    : getMondayOfWeek(now);

  const weekStartISO = toISODateString(weekStart);
  const events = await getEventsByWeek(weekStartISO);

  // Group events by day of week (0=Mon .. 6=Sun)
  const eventsByDay: Map<number, EventWithLocationAndCategory[]> = new Map();
  for (const event of events) {
    const dt = formatDateTime(event.startDateTime);
    const dayName = dt.weekdayShort; // "Mon", "Tue", etc.
    const dayIndex = DAYS.indexOf(dayName as (typeof DAYS)[number]);
    if (dayIndex === -1) continue;
    if (!eventsByDay.has(dayIndex)) eventsByDay.set(dayIndex, []);
    eventsByDay.get(dayIndex)!.push(event);
  }

  // Build day dates for header labels
  const dayDates = DAYS.map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  // Check if this is the current week
  const currentMonday = getMondayOfWeek(now);
  const isCurrentWeek =
    toISODateString(currentMonday) === toISODateString(weekStart);

  // Prev / Next week ISO strings
  const prevWeek = new Date(weekStart);
  prevWeek.setDate(prevWeek.getDate() - 7);
  const nextWeek = new Date(weekStart);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return (
    <div className="flex flex-col gap-4 px-4 py-5 pb-8 md:px-6 lg:px-12 lg:py-10 lg:pb-16">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Weekly Schedule
          </h2>
          <p className="text-sm text-muted-foreground">
            {formatDateTime(dayDates[0]).dateOnlyWithoutYear} &ndash;{" "}
            {formatDateTime(dayDates[6]).dateOnlyWithoutYear}
          </p>
        </div>
        <Suspense>
          <ScheduleToggle />
        </Suspense>
      </div>

      {/* Navigation */}
      <WeekNavigation
        prevWeek={toISODateString(prevWeek)}
        nextWeek={toISODateString(nextWeek)}
        isCurrentWeek={isCurrentWeek}
      />

      {/* Desktop: 7-column grid */}
      <div className="hidden md:grid md:grid-cols-7 md:gap-1">
        {DAYS.map((dayName, i) => {
          const dayEvents = eventsByDay.get(i) || [];
          const date = dayDates[i];
          const isToday =
            toISODateString(
              new Date(
                now.toLocaleString("en-US", { timeZone: "America/New_York" }),
              ),
            ) === toISODateString(date);

          return (
            <div key={dayName} className="flex flex-col">
              {/* Day header */}
              <div
                className={`mb-1 rounded-t-lg px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide ${
                  isToday
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <div>{dayName}</div>
                <div className="text-lg font-bold leading-tight">
                  {date.getDate()}
                </div>
              </div>

              {/* Events */}
              <div className="flex min-h-[80px] flex-col gap-1">
                {dayEvents.length === 0 ? (
                  <div className="flex-1" />
                ) : (
                  dayEvents.map((event) => (
                    <EventCell key={event.id} event={event} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: stacked days, hide empty */}
      <div className="flex flex-col gap-3 md:hidden">
        {DAYS.map((dayName, i) => {
          const dayEvents = eventsByDay.get(i) || [];
          if (dayEvents.length === 0) return null;
          const date = dayDates[i];
          const isToday =
            toISODateString(
              new Date(
                now.toLocaleString("en-US", { timeZone: "America/New_York" }),
              ),
            ) === toISODateString(date);

          return (
            <div key={dayName}>
              <div
                className={`mb-1 rounded-lg px-3 py-2 text-sm font-semibold ${
                  isToday
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {formatDateTime(date).dateLongWithoutYear}
              </div>
              <div className="flex flex-col gap-1 pl-1">
                {dayEvents.map((event) => (
                  <EventCell key={event.id} event={event} />
                ))}
              </div>
            </div>
          );
        })}
        {events.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">
            No classes scheduled this week.
          </p>
        )}
      </div>

      {/* Desktop empty state */}
      {events.length === 0 && (
        <p className="hidden py-4 text-center text-muted-foreground md:block">
          No classes scheduled this week.
        </p>
      )}
    </div>
  );
}

function EventCell({ event }: { event: EventWithLocationAndCategory }) {
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
