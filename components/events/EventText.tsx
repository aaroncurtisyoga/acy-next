import { Link as NextUiLink } from "@nextui-org/react";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import { formatDateTime } from "@/lib/utils";

interface EventTextProps {
  isAdmin: boolean;
  event: IEvent;
}

const EventText = ({ isAdmin, event }: EventTextProps) => {
  const { _id, category, imageUrl, isFree, price, startDateTime, title } =
    event;

  const formattedDate = formatDateTime(startDateTime).dateOnlyWithoutYear;
  const formattedTime = formatDateTime(startDateTime).timeOnly;

  return (
    <p className={"text-base text-default-900 md:text-lg mb-4"}>
      {formattedDate} - {formattedTime} - {title} at {event.location.name} -{" "}
      <NextUiLink
        className={"italic cursor-pointer text-default-900"}
        underline="always"
      >
        Sign Up
      </NextUiLink>
    </p>
  );
};

export default EventText;
