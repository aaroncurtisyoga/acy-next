"use client";

import { FC, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  ExternalLink,
} from "lucide-react";
import BasicModal from "@/app/_components/BasicModal";
import EventTableToolbar from "@/app/admin/events/_components/EventTableToolbar";
import { useDisclosure } from "@/app/_hooks/useDisclosure";
import { useEventTableFilters } from "@/app/admin/events/_components/hooks/useEventTableFilters";
import { useCalendarData } from "@/app/admin/events/_components/hooks/useCalendarData";
import { formatDateTime, cn } from "@/app/_lib/utils";
import type { EventWithLocationAndCategory } from "@/app/_lib/types";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildGridDates(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const startDay = firstOfMonth.getDay();
  const totalCells = Math.ceil((startDay + lastOfMonth.getDate()) / 7) * 7;
  const dates: Date[] = [];
  for (let i = 0; i < totalCells; i++) {
    const d = new Date(year, month, 1 - startDay + i);
    dates[i] = d;
  }
  return dates;
}

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

const CalendarEventManagement: FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedEvent, setSelectedEvent] =
    useState<EventWithLocationAndCategory | null>(null);

  const {
    filters,
    hasActiveFilters,
    handleSearchChange,
    handleCategoryChange,
    handleStatusChange,
    clearFilters,
  } = useEventTableFilters();

  const {
    year,
    month,
    loading,
    eventsByDate,
    monthLabel,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    handleDeleteEvent,
  } = useCalendarData(filters);

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  useEffect(() => {
    import("@/app/_lib/actions/category.actions").then(({ getAllCategories }) =>
      getAllCategories().then(setCategories),
    );
  }, []);

  const gridDates = useMemo(() => buildGridDates(year, month), [year, month]);
  const today = todayKey();

  const onDeleteClick = (event: EventWithLocationAndCategory) => {
    setSelectedEvent(event);
    onOpen();
  };

  const onConfirmDelete = async () => {
    if (!selectedEvent) return;
    const success = await handleDeleteEvent(selectedEvent.id);
    if (success) {
      onOpenChange();
    }
  };

  // Mobile: only days with events, sorted
  const daysWithEvents = useMemo(() => {
    const entries = Array.from(eventsByDate.entries()).sort(([a], [b]) =>
      a.localeCompare(b),
    );
    // Filter to only current month
    return entries.filter(([key]) => {
      const d = new Date(key + "T12:00:00");
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }, [eventsByDate, month, year]);

  const numRows = gridDates.length / 7 + 1; // +1 for day-name header row

  return (
    <div className="flex flex-col flex-1 gap-4">
      <EventTableToolbar
        searchText={filters.searchText}
        category={filters.category}
        statusFilter={filters.statusFilter}
        categories={categories}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onClearFilters={clearFilters}
      />

      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{monthLabel}</h2>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={goToPrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <>
          <div className="hidden md:flex md:flex-col flex-1">
            <div
              className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden flex-1"
              style={{ gridTemplateRows: `auto repeat(5, 1fr)` }}
            >
              {DAY_NAMES.map((day) => (
                <div
                  key={day}
                  className="bg-muted px-2 py-1.5 text-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} className="rounded-none" />
              ))}
            </div>
          </div>
          <div className="md:hidden space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Desktop: Grid */}
          <div className="hidden md:flex md:flex-col flex-1">
            <div
              className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden flex-1"
              style={{
                gridTemplateRows: `auto repeat(${numRows - 1}, 1fr)`,
              }}
            >
              {DAY_NAMES.map((day) => (
                <div
                  key={day}
                  className="bg-muted px-2 py-1.5 text-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
              {gridDates.map((date, i) => {
                const key = toDateKey(date);
                const isCurrentMonth = date.getMonth() === month;
                const isToday = key === today;
                const dayEvents = eventsByDate.get(key) || [];

                return (
                  <div
                    key={i}
                    className={cn(
                      "bg-background p-1.5 relative overflow-hidden",
                      !isCurrentMonth && "opacity-40",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex items-center justify-center text-xs w-6 h-6 rounded-full",
                        isToday &&
                          "bg-primary text-primary-foreground font-bold",
                      )}
                    >
                      {date.getDate()}
                    </span>
                    <div className="mt-0.5 space-y-0.5">
                      {dayEvents.map((event) => (
                        <EventChip
                          key={event.id}
                          event={event}
                          onDeleteClick={onDeleteClick}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile: Day list */}
          <div className="md:hidden space-y-4">
            {daysWithEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No events this month
              </p>
            ) : (
              daysWithEvents.map(([dateKey, events]) => {
                const dateObj = new Date(dateKey + "T12:00:00");
                const isToday = dateKey === today;
                return (
                  <div key={dateKey}>
                    <h3
                      className={cn(
                        "text-sm font-medium mb-2 pb-1 border-b",
                        isToday && "text-primary font-bold",
                      )}
                    >
                      {dateObj.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        timeZone: "America/New_York",
                      })}
                      {isToday && " (Today)"}
                    </h3>
                    <div className="space-y-2">
                      {events.map((event) => (
                        <MobileEventItem
                          key={event.id}
                          event={event}
                          onDeleteClick={onDeleteClick}
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      <BasicModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        header={<h1>Confirm deletion for this event</h1>}
        primaryAction={onConfirmDelete}
        primaryActionLabel="Delete"
      >
        {selectedEvent && (
          <div>
            <p className="mb-5">Are you sure you want to delete this event?</p>
            <p>
              <b>Event:</b> {selectedEvent.title}
            </p>
            <p>
              <b>Category:</b> {selectedEvent.category.name}
            </p>
            <p>
              <b>Date:</b>{" "}
              {formatDateTime(selectedEvent.startDateTime).dateTime}
            </p>
          </div>
        )}
      </BasicModal>
    </div>
  );
};

function EventChip({
  event,
  onDeleteClick,
}: {
  event: EventWithLocationAndCategory;
  onDeleteClick: (event: EventWithLocationAndCategory) => void;
}) {
  const { timeOnly } = formatDateTime(event.startDateTime);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "w-full text-left text-[11px] leading-tight px-1.5 py-0.5 rounded truncate",
            "bg-primary/10 text-primary hover:bg-primary/20 transition-colors",
            !event.isActive && "opacity-60",
          )}
        >
          <span className="font-medium">{timeOnly}</span>{" "}
          <span>{event.title}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" side="right" align="start">
        <EventPopoverDetails event={event} onDeleteClick={onDeleteClick} />
      </PopoverContent>
    </Popover>
  );
}

function EventPopoverDetails({
  event,
  onDeleteClick,
}: {
  event: EventWithLocationAndCategory;
  onDeleteClick: (event: EventWithLocationAndCategory) => void;
}) {
  const { dateTime } = formatDateTime(event.startDateTime);

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex items-start gap-1.5">
          <h4 className="font-semibold text-sm leading-tight">{event.title}</h4>
          {event.isHostedExternally && (
            <ExternalLink
              size={12}
              className="text-muted-foreground mt-0.5 shrink-0"
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground">{dateTime}</p>
        {event.location && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">
              {event.location.name || event.location.formattedAddress}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge className="text-[10px] bg-primary/10 text-primary">
          {event.category.name}
        </Badge>
        <Badge
          className={cn(
            "text-[10px]",
            event.isActive
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              : "bg-secondary text-secondary-foreground",
          )}
        >
          {event.isActive ? "Active" : "Inactive"}
        </Badge>
        {event.isFree ? (
          <Badge className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
            Free
          </Badge>
        ) : (
          event.price && (
            <Badge className="text-[10px] bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
              ${event.price}
            </Badge>
          )
        )}
      </div>

      <div className="flex items-center gap-1 pt-1 border-t">
        {!event.isHostedExternally && (
          <Button size="sm" variant="ghost" className="h-7 text-xs" asChild>
            <Link href={`/events/${event.id}`}>
              <Eye size={14} className="mr-1" /> View
            </Link>
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs text-primary hover:text-primary"
          asChild
        >
          <Link href={`/admin/events/${event.id}/edit`}>
            <Pencil size={14} className="mr-1" /> Edit
          </Link>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs text-destructive hover:text-destructive"
          onClick={() => onDeleteClick(event)}
        >
          <Trash2 size={14} className="mr-1" /> Delete
        </Button>
      </div>
    </div>
  );
}

function MobileEventItem({
  event,
  onDeleteClick,
}: {
  event: EventWithLocationAndCategory;
  onDeleteClick: (event: EventWithLocationAndCategory) => void;
}) {
  const { timeOnly } = formatDateTime(event.startDateTime);

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{timeOnly}</span>
          <Badge className="text-[10px] bg-primary/10 text-primary">
            {event.category.name}
          </Badge>
          {!event.isActive && (
            <Badge className="text-[10px]" variant="secondary">
              Inactive
            </Badge>
          )}
        </div>
        <p className="text-sm font-medium mt-0.5 truncate">{event.title}</p>
        {event.location && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <MapPin size={11} />
            <span className="truncate">
              {event.location.name || event.location.formattedAddress}
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-0.5 ml-2 shrink-0">
        {!event.isHostedExternally && (
          <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
            <Link href={`/events/${event.id}`}>
              <Eye size={16} />
            </Link>
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-primary hover:text-primary"
          asChild
        >
          <Link href={`/admin/events/${event.id}/edit`}>
            <Pencil size={16} />
          </Link>
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => onDeleteClick(event)}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}

export default CalendarEventManagement;
