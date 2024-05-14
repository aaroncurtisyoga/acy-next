"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import EventAdminButtons from "@/components/events/EventAdminButtons";
import { EventWithLocationAndCategory } from "@/components/events/Collection";
import { formatDateTime } from "@/lib/utils";

interface EventTextProps {
  isAdmin: boolean;
  event: EventWithLocationAndCategory;
}

const EventText: FC<EventTextProps> = ({ isAdmin, event }) => {
  const pathname = usePathname();
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
      {isAdmin && <EventAdminButtons id={id} pathname={pathname} />}
    </>
  );
};

export default EventText;
