"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { Card, CardBody, Button } from "@heroui/react";
import { Clock, MapPin, Edit } from "lucide-react";
import { EventWithLocationAndCategory } from "@/app/_lib/types";
import { formatDateTime } from "@/app/_lib/utils";
import { useUser } from "@clerk/nextjs";
import EventCardInlineEdit from "./EventCardInlineEdit";

interface EventCardProps {
  event: EventWithLocationAndCategory;
}

const EventCard: FC<EventCardProps> = ({ event: initialEvent }) => {
  const [event, setEvent] = useState(initialEvent);
  const [isEditing, setIsEditing] = useState(false);
  const { id, startDateTime, title, category, isFree } = event;
  const dateTime = formatDateTime(startDateTime);
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const handleSaveEdit = (updatedEvent: EventWithLocationAndCategory) => {
    setEvent(updatedEvent);
    setIsEditing(false);
  };

  // Check if the event is today
  const isToday = () => {
    const today = new Date();
    const eventDate = new Date(startDateTime);
    // Convert both to Eastern Time for comparison
    const todayET = new Date(
      today.toLocaleString("en-US", { timeZone: "America/New_York" }),
    );
    const eventET = new Date(
      eventDate.toLocaleString("en-US", { timeZone: "America/New_York" }),
    );
    return (
      todayET.getDate() === eventET.getDate() &&
      todayET.getMonth() === eventET.getMonth() &&
      todayET.getFullYear() === eventET.getFullYear()
    );
  };

  const dayLabel = isToday() ? "TODAY" : dateTime.weekdayShort.toUpperCase();

  const signUpHref = event.isHostedExternally
    ? event.externalRegistrationUrl || event.externalUrl || `/events/${id}`
    : `/events/${id}`;

  return (
    <Card className="w-full mb-4 shadow-small hover:shadow-medium transition-shadow duration-200 rounded-3xl @container">
      <CardBody className="p-0">
        <div className="flex flex-col gap-3">
          {/* Mobile: Compact date + title row, Desktop: Date badge + details */}
          <div className="flex flex-row items-stretch gap-0">
            {/* Desktop Date Badge - Full height */}
            <div className="hidden @sm:flex">
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-l-3xl px-4 py-4 flex flex-col items-center justify-center min-w-[75px]">
                <div className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 tracking-wider mb-3">
                  {dayLabel}
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs font-medium text-foreground-600 dark:text-foreground-400 mb-0.5">
                    {dateTime.monthShort}
                  </div>
                  <div className="text-3xl font-bold text-foreground leading-none">
                    {dateTime.dayNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="flex-1 @sm:flex @sm:items-center">
              <div className="flex-1 px-4 py-3 @sm:py-4">
                <div className="space-y-2.5">
                  {/* Title and inline edit */}
                  {isEditing ? (
                    <EventCardInlineEdit
                      event={event}
                      onCancel={() => setIsEditing(false)}
                      onSave={handleSaveEdit}
                    />
                  ) : (
                    <>
                      <h3 className="text-lg @sm:text-xl font-semibold text-foreground leading-tight">
                        {title}
                      </h3>

                      {/* Event metadata with mobile date inline */}
                      <div className="flex flex-wrap items-center gap-x-3 @sm:gap-x-4 gap-y-2 text-sm">
                        {/* Mobile date - shown first in metadata */}
                        <div className="@sm:hidden flex items-center">
                          <span className="font-semibold text-foreground">
                            {dayLabel}, {dateTime.monthShort}{" "}
                            {dateTime.dayNumber}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-foreground-700">
                          <Clock className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                          <span className="font-medium">
                            {dateTime.timeOnly}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-foreground-600">
                          <MapPin className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {event.location.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-foreground-600">
                          <div className="w-2 h-2 rounded-full bg-primary-400 flex-shrink-0"></div>
                          <span>{category.name}</span>
                        </div>

                        {isFree && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400 rounded-full text-xs font-semibold">
                            FREE
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile Sign Up Button - Prominent at bottom */}
                {!isEditing && (
                  <div className="@sm:hidden mt-3 pt-3 border-t border-divider">
                    <div className="flex gap-2">
                      {isAdmin && (
                        <Button
                          onClick={() => setIsEditing(true)}
                          color="secondary"
                          variant="flat"
                          size="md"
                          className="font-semibold"
                          startContent={<Edit className="w-4 h-4" />}
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        as={Link}
                        href={signUpHref}
                        target="_blank"
                        color="primary"
                        size="md"
                        className={`font-semibold ${isAdmin ? "" : "w-full"}`}
                      >
                        Sign Up
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Sign Up Button - vertically centered on right */}
              {!isEditing && (
                <div className="hidden @sm:flex items-center pr-4 gap-2">
                  {isAdmin && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      color="secondary"
                      variant="flat"
                      size="sm"
                      className="font-semibold"
                      startContent={<Edit className="w-3.5 h-3.5" />}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    as={Link}
                    href={signUpHref}
                    target="_blank"
                    color="primary"
                    size="sm"
                    className="font-semibold"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default EventCard;
