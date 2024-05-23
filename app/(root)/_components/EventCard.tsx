"use client";

import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { formatDateTime } from "@/_lib/utils";
import { EventWithLocationAndCategory } from "@/types";

interface CardProps {
  event: EventWithLocationAndCategory;
}

const EventCard: FC<CardProps> = ({ event }) => {
  const { id, category, imageUrl, startDateTime, title } = event;
  return (
    <div
      className={
        "flex flex-col w-full md:max-w-[400px]" +
        " md:min-h-[280px] overflow-hidden" +
        " rounded-sm bg-white shadow-md transition-all hover:shadow-lg"
      }
    >
      <Link href={`/events/${id}`} className={"flex-col hover:underline"}>
        <Image
          src={imageUrl}
          alt={`People doing ${category.name}`}
          sizes={"400px"}
          width={400}
          height={140}
          className={"w-full h-auto md:h-[140px]"}
          style={{ objectFit: "cover" }}
          priority={true}
        />
        <p className="text-lg line-clamp-2 flex-1 text-black pt-2 px-3">
          {title}
        </p>
      </Link>
      <div className={"pt-1 px-3 mb-8 md:mb-auto"}>
        <p className="md:text-sm mb-1/2 font-semibold">
          {formatDateTime(startDateTime).dateOnlyWithoutYear} •{" "}
          {formatDateTime(startDateTime).timeOnly}
        </p>
        <p className={"md:text-sm mt-1"}>{event.location.name}</p>
      </div>
    </div>
  );
};

export default EventCard;
