"use client";

import { FC } from "react";
import Link from "next/link";
import { EventWithLocationAndCategory } from "@/app/_lib/types";
import { formatDateTime } from "@/app/_lib/utils";

interface EventTextProps {
  event: EventWithLocationAndCategory;
}

const EventText: FC<EventTextProps> = ({ event }) => {
  const { id, startDateTime, title } = event;
  const formattedDate = formatDateTime(startDateTime).dateOnlyWithoutYear;
  const formattedTime = formatDateTime(startDateTime).timeOnly;

  const signUpHref = event.isHostedExternally
    ? event.externalRegistrationUrl || event.externalUrl || `/events/${id}`
    : `/events/${id}`;

  return (
    <>
      <p className={"text-base text-default-900 md:text-lg mb-4"}>
        {formattedDate} - {formattedTime} - {title} at {event.location.name} -{" "}
        <Link
          className={
            "italic underline cursor-pointer" +
            " text-primary hover:text-primary-700"
          }
          href={signUpHref}
        >
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default EventText;
