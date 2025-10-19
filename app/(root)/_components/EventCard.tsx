"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { Card, CardBody, Button, useDisclosure } from "@heroui/react";
import { Clock } from "lucide-react";
import { EventWithLocationAndCategory } from "@/app/_lib/types";
import { formatDateTime } from "@/app/_lib/utils";
import { useUser } from "@clerk/nextjs";
import EventCardInlineEdit from "@/app/(root)/_components/EventCardInlineEdit";
import BasicModal from "@/app/_components/BasicModal";
import { deleteEvent } from "@/app/_lib/actions/event.actions";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
// import ShareButton from "./ShareButton";

interface EventCardProps {
  event: EventWithLocationAndCategory;
  isHighlighted?: boolean;
}

const EventCard: FC<EventCardProps> = ({
  event: initialEvent,
  isHighlighted = false,
}) => {
  const [event, setEvent] = useState(initialEvent);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const { id, startDateTime, title, category, isFree } = event;
  const dateTime = formatDateTime(startDateTime);
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const handleSaveEdit = (updatedEvent: EventWithLocationAndCategory) => {
    setEvent(updatedEvent);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    track("event_management", {
      action: "delete_event",
      event_id: event.id,
      event_title: event.title,
    });
    try {
      const response = await deleteEvent(event.id);
      if (response.success) {
        setIsDeleted(true);
        onOpenChange();
        // Refresh the page to update the list
        router.refresh();
      } else {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    } finally {
      setIsDeleting(false);
    }
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

  // Don't render if deleted
  if (isDeleted) return null;

  return (
    <>
      <div className="w-full mb-4">
        {/* Edit and Delete Badges - positioned above card on the right */}
        {isAdmin && !isEditing && (
          <div className="flex justify-end pr-[30px] -mb-[1px] gap-[1px]">
            <button
              onClick={() => {
                track("event_management", {
                  action: "edit_event_click",
                  event_id: event.id,
                  event_title: event.title,
                });
                setIsEditing(true);
              }}
              className="px-3 py-1 text-xs text-foreground-600 hover:text-foreground-800 bg-white dark:bg-gray-800 border border-divider rounded-tl-lg border-b-0 border-r-0 transition-colors duration-200 cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => {
                track("event_management", {
                  action: "delete_event_click",
                  event_id: event.id,
                  event_title: event.title,
                });
                onOpen();
              }}
              className="px-3 py-1 text-xs text-danger-600 hover:text-danger-800 bg-white dark:bg-gray-800 border border-divider rounded-tr-lg border-b-0 transition-colors duration-200 cursor-pointer"
            >
              Delete
            </button>
          </div>
        )}
        <Card
          id={`event-${event.id}`}
          className={`w-full border ${isHighlighted ? "border-2 border-primary bg-blue-50/50 dark:bg-primary/5 shadow-lg" : "border-divider"} shadow-none hover:shadow-sm transition-shadow duration-200 rounded-2xl @container`}
        >
          <CardBody className="p-0">
            <div className="flex flex-col gap-0">
              {/* Mobile: Compact date + title row, Desktop: Date badge + details */}
              <div className="flex flex-row items-stretch gap-0">
                {/* Desktop Date Badge - Full height */}
                <div className="hidden @sm:flex">
                  <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-l-2xl px-3 py-3 flex flex-col items-center justify-center min-w-[50px]">
                    <div className="text-[10px] font-medium text-foreground-500 dark:text-foreground-400 tracking-wide mb-2">
                      {dayLabel}
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xs font-normal text-foreground-600 dark:text-foreground-400 mb-0.5">
                        {dateTime.monthShort}
                      </div>
                      <div className="text-xl font-semibold text-foreground leading-none">
                        {dateTime.dayNumber}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex-1 @sm:flex @sm:items-center">
                  <div className="flex-1 px-4 py-2.5 @sm:py-3">
                    <div className="space-y-2">
                      {/* Title and inline edit */}
                      {isEditing ? (
                        <EventCardInlineEdit
                          event={event}
                          onCancel={() => setIsEditing(false)}
                          onSave={handleSaveEdit}
                        />
                      ) : (
                        <>
                          <h3 className="text-base @sm:text-lg font-medium text-foreground leading-tight">
                            {title}
                          </h3>

                          {/* Event metadata with mobile date inline */}
                          <div className="flex flex-wrap items-center gap-x-2.5 @sm:gap-x-3 gap-y-1.5 text-sm">
                            {/* Mobile date - shown first in metadata */}
                            <div className="@sm:hidden flex items-center">
                              <span className="font-semibold text-foreground">
                                {dayLabel}, {dateTime.monthShort}{" "}
                                {dateTime.dayNumber}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-foreground-700">
                              <Clock className="w-3.5 h-3.5 text-foreground-500 flex-shrink-0" />
                              <span className="font-normal">
                                {dateTime.timeOnly}
                              </span>
                            </div>

                            <span className="text-foreground-400">•</span>

                            <span className="text-foreground-600 line-clamp-1">
                              {event.location.name}
                            </span>

                            <span className="text-foreground-400">•</span>

                            <span className="text-foreground-600">
                              {category.name}
                            </span>

                            {isFree && (
                              <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-semibold">
                                FREE
                              </span>
                            )}
                          </div>

                          {/* Action buttons row - bottom of content */}
                          {/*{!isEditing && (*/}
                          {/*  <div className="flex items-center gap-1 mt-3">*/}
                          {/*    <ShareButton*/}
                          {/*      event={event}*/}
                          {/*      variant="icon"*/}
                          {/*      size="sm"*/}
                          {/*      className="text-foreground-500 hover:text-foreground-700"*/}
                          {/*    />*/}
                          {/*    /!* Space for future buttons like "More Details" *!/*/}
                          {/*  </div>*/}
                          {/*)}*/}
                        </>
                      )}
                    </div>

                    {/* Mobile Sign Up Button - Prominent at bottom */}
                    {!isEditing && (
                      <div className="@sm:hidden mt-2 pt-2 border-t border-divider">
                        <Button
                          as={Link}
                          href={signUpHref}
                          target="_blank"
                          color="primary"
                          size="md"
                          className="font-semibold w-full"
                          onPress={() => {
                            track("event_signup", {
                              action: "signup_click",
                              event_id: event.id,
                              event_title: event.title,
                              category: event.category.name,
                              is_free: event.isFree,
                              is_external: event.isHostedExternally,
                              source: "mobile_card",
                            });
                          }}
                        >
                          Sign Up
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Desktop Sign Up Button - vertically centered on right */}
                  {!isEditing && (
                    <div className="hidden @sm:flex items-center pr-4">
                      <Button
                        as={Link}
                        href={signUpHref}
                        target="_blank"
                        color="primary"
                        size="sm"
                        className="font-semibold"
                        onPress={() => {
                          track("event_signup", {
                            action: "signup_click",
                            event_id: event.id,
                            event_title: event.title,
                            category: event.category.name,
                            is_free: event.isFree,
                            is_external: event.isHostedExternally,
                            source: "desktop_card",
                          });
                        }}
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
      </div>

      {/* Delete Confirmation Modal */}
      <BasicModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        header="Confirm Delete"
        primaryAction={handleDelete}
        primaryActionLabel={isDeleting ? "Deleting..." : "Delete"}
      >
        <div className="py-4">
          <p className="text-foreground-700">
            Are you sure you want to delete the event{" "}
            <strong>&ldquo;{title}&rdquo;</strong>?
          </p>
          <p className="text-sm text-foreground-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
      </BasicModal>
    </>
  );
};

export default EventCard;
