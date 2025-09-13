"use client";

import { FC } from "react";
import Link from "next/link";
import { Card, CardBody, Button } from "@heroui/react";
import { Clock, MapPin } from "lucide-react";
import { EventWithLocationAndCategory } from "@/app/_lib/types";
import { formatDateTime } from "@/app/_lib/utils";

interface EventTextProps {
  event: EventWithLocationAndCategory;
}

const EventText: FC<EventTextProps> = ({ event }) => {
  const { id, startDateTime, title, category, isFree, price } = event;
  const dateTime = formatDateTime(startDateTime);

  const signUpHref = event.isHostedExternally
    ? event.externalRegistrationUrl || event.externalUrl || `/events/${id}`
    : `/events/${id}`;

  return (
    <Card className="w-full mb-4 shadow-small hover:shadow-medium transition-shadow duration-200 rounded-3xl @container">
      <CardBody className="px-4 py-3">
        <div className="flex flex-col gap-3">
          {/* Mobile: Compact date + title row, Desktop: Date badge + details */}
          <div className="flex flex-row items-start gap-3">
            {/* Desktop Date Badge - Hidden on narrow containers */}
            <div className="hidden @sm:block">
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 text-center min-w-[60px]">
                <div className="text-xs font-bold text-primary-600 dark:text-primary-400">
                  {dateTime.monthShort}
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {dateTime.dayNumber}
                </div>
                <div className="text-xs text-foreground-500">
                  {dateTime.weekdayShort}
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {/* Mobile: Show title first, then date */}
                <h3 className="text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <span className="@sm:hidden text-sm text-foreground-500">
                  |
                </span>
                <span className="@sm:hidden text-sm font-medium text-foreground-600 whitespace-nowrap">
                  {dateTime.weekdayShort.toUpperCase()}, {dateTime.monthShort}{" "}
                  {dateTime.dayNumber}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-foreground-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary-500" />
                  <span className="font-medium">{dateTime.timeOnly}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  <span>{event.location.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary-400"></div>
                  <span>{category.name}</span>
                </div>

                {isFree && (
                  <div className="flex items-center gap-1.5">
                    <div className="px-2 py-1 bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400 rounded-full text-xs font-bold">
                      FREE
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Sign Up Button */}
            <div className="hidden @sm:block ml-auto">
              <Button
                as={Link}
                href={signUpHref}
                color="primary"
                variant="light"
                size="md"
                className="font-semibold bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              >
                Sign Up
              </Button>
            </div>
          </div>

          {/* Mobile Sign Up Button - Full width */}
          <div className="@sm:hidden">
            <Button
              as={Link}
              href={signUpHref}
              color="primary"
              variant="light"
              size="md"
              className="w-full font-semibold bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default EventText;
