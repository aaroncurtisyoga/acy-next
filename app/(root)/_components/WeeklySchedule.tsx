import { Suspense } from "react";
import Link from "next/link";
import {
  getEventsByWeek,
  getLastActiveEventDate,
} from "@/app/_lib/actions/event.actions";
import { formatDateTime, toDateKey } from "@/app/_lib/utils";
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

  const weekStartISO = toDateKey(weekStart);
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
  const isCurrentWeek = toDateKey(currentMonday) === toDateKey(weekStart);

  // Disable "Next" if no events exist after the current week
  const lastEventDate = await getLastActiveEventDate();
  const currentWeekEnd = new Date(weekStart);
  currentWeekEnd.setDate(currentWeekEnd.getDate() + 7);
  const hasMoreEvents = lastEventDate
    ? new Date(lastEventDate) >= currentWeekEnd
    : false;

  // Prev / Next week ISO strings
  const prevWeek = new Date(weekStart);
  prevWeek.setDate(prevWeek.getDate() - 7);
  const nextWeek = new Date(weekStart);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const todayKey = toDateKey(
    new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" })),
  );

  return (
    <div className="flex flex-col px-4 py-12 md:px-6 md:py-16 lg:px-12">
      {/* Header row */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-4xl uppercase text-foreground md:text-5xl">
            This Week
          </h2>
          <p className="text-sm font-medium text-muted-foreground">
            {formatDateTime(dayDates[0]).dateOnlyWithoutYear} &ndash;{" "}
            {formatDateTime(dayDates[6]).dateOnlyWithoutYear}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <WeekNavigation
            prevWeek={toDateKey(prevWeek)}
            nextWeek={toDateKey(nextWeek)}
            isCurrentWeek={isCurrentWeek}
            hasMoreEvents={hasMoreEvents}
          />
          <Suspense>
            <ScheduleToggle />
          </Suspense>
        </div>
      </div>

      {/* Poster rows */}
      <div className="mt-8 border-t-[3px] border-foreground">
        {DAYS.map((dayName, i) => {
          const dayEvents = eventsByDay.get(i) || [];
          if (dayEvents.length === 0) return null;
          const isToday = todayKey === toDateKey(dayDates[i]);

          return dayEvents.map((event, idx) => (
            <ScheduleRow
              key={event.id}
              event={event}
              dayLabel={idx === 0 ? dayName : ""}
              isToday={isToday}
            />
          ));
        })}
      </div>

      {events.length === 0 && (
        <p className="border-b-2 border-foreground py-10 text-center font-medium text-muted-foreground">
          No classes scheduled this week.
        </p>
      )}
    </div>
  );
}

function ScheduleRow({
  event,
  dayLabel,
  isToday,
}: {
  event: EventWithLocationAndCategory;
  dayLabel: string;
  isToday: boolean;
}) {
  const { timeOnly } = formatDateTime(event.startDateTime);
  const href = event.isHostedExternally
    ? event.externalRegistrationUrl || `/events/${event.id}`
    : `/events/${event.id}`;
  const isExternal = event.isHostedExternally && event.externalRegistrationUrl;

  return (
    <div className="grid grid-cols-[64px_1fr_auto] items-center gap-x-4 border-b-2 border-foreground py-4 md:grid-cols-[150px_120px_1fr_auto] md:gap-x-6 md:py-5">
      <span
        className={`font-display text-3xl uppercase leading-none md:text-5xl ${
          isToday ? "text-primary" : "text-foreground"
        }`}
        aria-hidden={dayLabel === ""}
      >
        {dayLabel}
      </span>
      <span className="hidden text-[15px] font-semibold tabular-nums text-foreground md:block">
        {timeOnly}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-bold tabular-nums text-primary md:hidden">
          {timeOnly}
        </span>
        <span className="block truncate text-base font-semibold uppercase tracking-[0.03em] text-foreground md:text-lg">
          {event.title}
        </span>
        {event.location?.name && (
          <span className="mt-0.5 block truncate text-sm text-muted-foreground">
            {event.location.name}
          </span>
        )}
      </span>
      <Link
        href={href}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="border-b-2 border-primary pb-0.5 text-sm font-semibold uppercase tracking-[0.1em] text-foreground transition-colors hover:text-primary"
      >
        Book
      </Link>
    </div>
  );
}
