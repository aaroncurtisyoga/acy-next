"use client";

import { FC } from "react";
import Link from "next/link";
import { Card, CardBody, Chip, Button } from "@heroui/react";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { EventWithLocationAndCategory } from "@/app/_lib/types";
import { formatDateTime } from "@/app/_lib/utils";

interface EventTextProps {
  event: EventWithLocationAndCategory;
}

const EventText: FC<EventTextProps> = ({ event }) => {
  const { id, startDateTime, title, category } = event;
  const dateTime = formatDateTime(startDateTime);

  const signUpHref = event.isHostedExternally
    ? event.externalRegistrationUrl || event.externalUrl || `/events/${id}`
    : `/events/${id}`;

  return (
    <Card className="w-full mb-4 shadow-small hover:shadow-medium transition-shadow duration-200">
      <CardBody className="px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Date Badge */}
          <div className="flex items-center gap-3">
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 text-center min-w-[60px]">
              <div className="text-xs font-bold text-primary-600 dark:text-primary-400">
                {dateTime.monthShort}
              </div>
              <div className="text-2xl font-bold text-foreground">
                {dateTime.dayNumber}
              </div>
              <div className="text-xs text-foreground-500">
                {dateTime.weekdayLong}
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <div className="flex gap-2">
                {event.isExternal && (
                  <Chip size="sm" variant="flat" color="warning">
                    External
                  </Chip>
                )}
                <Chip
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="capitalize"
                >
                  {category.name}
                </Chip>
              </div>
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
            </div>
          </div>

          {/* Sign Up Button */}
          <div className="md:ml-auto">
            <Button
              as={Link}
              href={signUpHref}
              color="primary"
              variant="flat"
              size="md"
              endContent={
                event.isHostedExternally ? (
                  <ExternalLink className="w-4 h-4" />
                ) : null
              }
              className="font-semibold"
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
