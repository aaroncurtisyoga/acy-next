"use client";

import { FC } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { track } from "@vercel/analytics";
import EventCardInlineEdit from "@/app/(root)/_components/EventCardInlineEdit";
import { EventWithLocationAndCategory } from "@/app/_lib/types";
import { formatDateTime } from "@/app/_lib/utils";

interface EventCardContentProps {
  event: EventWithLocationAndCategory;
  isEditing: boolean;
  dayLabel: string;
  onCancelEdit: () => void;
  onSaveEdit: (updatedEvent: EventWithLocationAndCategory) => void;
}

const EventCardContent: FC<EventCardContentProps> = ({
  event,
  isEditing,
  dayLabel,
  onCancelEdit,
  onSaveEdit,
}) => {
  const dateTime = formatDateTime(event.startDateTime);
  const { id, title, category, isFree } = event;

  const signUpHref = event.isHostedExternally
    ? event.externalRegistrationUrl || event.externalUrl || `/events/${id}`
    : `/events/${id}`;

  const trackSignup = (source: string) => {
    track("event_signup", {
      action: "signup_click",
      event_id: event.id,
      event_title: event.title,
      category: event.category.name,
      is_free: event.isFree,
      is_external: event.isHostedExternally,
      source,
    });
  };

  return (
    <div className="flex flex-row items-stretch gap-0">
      {/* Desktop Date Badge */}
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
            {isEditing ? (
              <EventCardInlineEdit
                event={event}
                onCancel={onCancelEdit}
                onSave={onSaveEdit}
              />
            ) : (
              <>
                <h3 className="text-base @sm:text-lg font-medium text-foreground leading-tight">
                  {title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-2.5 @sm:gap-x-3 gap-y-1.5 text-sm">
                  {/* Mobile date */}
                  <div className="@sm:hidden flex items-center">
                    <span className="font-semibold text-foreground">
                      {dayLabel}, {dateTime.monthShort} {dateTime.dayNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-foreground-700">
                    <Clock className="w-3.5 h-3.5 text-foreground-500 flex-shrink-0" />
                    <span className="font-normal">{dateTime.timeOnly}</span>
                  </div>

                  <span className="text-foreground-400">•</span>

                  <span className="text-foreground-600 line-clamp-1">
                    {event.location.name}
                  </span>

                  <span className="text-foreground-400">•</span>

                  <span className="text-foreground-600">{category.name}</span>

                  {isFree && (
                    <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-semibold">
                      FREE
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Sign Up Link */}
          {!isEditing && (
            <div className="@sm:hidden mt-2 pt-2 border-t border-divider">
              <Link
                href={signUpHref}
                target="_blank"
                onClick={() => trackSignup("mobile_card")}
                className="inline-block text-sm text-foreground-600 hover:text-foreground-900 font-medium transition-colors duration-200 underline decoration-dotted underline-offset-4 italic"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Desktop Sign Up Link */}
        {!isEditing && (
          <div className="hidden @sm:flex items-center pr-4">
            <Link
              href={signUpHref}
              target="_blank"
              onClick={() => trackSignup("desktop_card")}
              className="text-sm text-black dark:text-foreground-600 hover:text-foreground-900 font-medium transition-colors duration-200 underline decoration-dotted underline-offset-4 italic whitespace-nowrap"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCardContent;
