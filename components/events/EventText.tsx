"use client";

import { usePathname } from "next/navigation";
import { FC } from "react";
import { Link as NextUiLink } from "@nextui-org/react";
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
        <NextUiLink
          className={"italic cursor-pointer text-default-900"}
          href={signUpHref}
          underline="always"
        >
          Sign Up
        </NextUiLink>
      </p>
      {isAdmin && <EventAdminButtons id={id} pathname={pathname} />}
    </>
  );
};

export default EventText;
