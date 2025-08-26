"use client";

import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardBody, CardFooter, Chip } from "@heroui/react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { EventWithLocationAndCategory } from "@/app/_lib/types";
import { formatDateTime } from "@/app/_lib/utils";

interface CardProps {
  event: EventWithLocationAndCategory;
}

const EventCard: FC<CardProps> = ({ event }) => {
  const { id, category, imageUrl, startDateTime, title } = event;
  const dateTime = formatDateTime(startDateTime);

  return (
    <Card
      className="w-full md:max-w-[400px] shadow-medium hover:shadow-xl transition-all duration-300 border-none"
      isPressable
      as={Link}
      href={`/events/${id}`}
    >
      <CardBody className="p-0 overflow-visible">
        <div className="relative">
          <Image
            src={imageUrl}
            alt={`People doing ${category.name}`}
            sizes="400px"
            width={400}
            height={200}
            className="w-full h-[180px] md:h-[200px] object-cover"
            priority={true}
          />
          {/* Date Badge */}
          <div className="absolute top-3 left-3 bg-background/95 backdrop-blur-md rounded-lg p-2 shadow-large">
            <div className="text-center min-w-[50px]">
              <div className="text-xs font-bold text-danger-500">
                {dateTime.monthShort}
              </div>
              <div className="text-2xl font-bold text-foreground">
                {dateTime.dayNumber}
              </div>
            </div>
          </div>
          {event.isExternal && (
            <Chip
              size="sm"
              variant="flat"
              color="warning"
              className="absolute top-3 right-3"
            >
              External
            </Chip>
          )}
        </div>

        <div className="px-4 py-3">
          <h3 className="text-lg font-semibold text-foreground line-clamp-2 mb-3">
            {title}
          </h3>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-foreground-600">
              <Clock className="w-4 h-4 text-primary-500" />
              <span className="font-medium">{dateTime.timeOnly}</span>
              <span className="text-foreground-400">•</span>
              <span>{dateTime.dateOnlyWithoutYear}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-foreground-600">
              <MapPin className="w-4 h-4 text-primary-500" />
              <span className="line-clamp-1">{event.location.name}</span>
            </div>
          </div>
        </div>
      </CardBody>

      <CardFooter className="px-4 py-3 border-t border-divider">
        <div className="flex justify-between items-center w-full">
          <Chip size="sm" variant="flat" color="primary" className="capitalize">
            {category.name}
          </Chip>
          <span className="text-sm font-semibold text-primary hover:text-primary-700">
            View Details →
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
