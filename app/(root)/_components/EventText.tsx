"use client";

import Link from "next/link";
import { FC } from "react";
import { formatDateTime } from "@/_lib/utils";
import { EventWithLocationAndCategory } from "@/_lib/types";

interface EventTextProps {
  event: EventWithLocationAndCategory;
}

const EventText: FC<EventTextProps> = ({ event }) => {
  const { id, startDateTime, title } = event;
  const formattedDate = formatDateTime(startDateTime).dateOnlyWithoutYear;
  const formattedTime = formatDateTime(startDateTime).timeOnly;

  const signUpHref = event.isHostedExternally
    ? event.externalRegistrationUrl
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
