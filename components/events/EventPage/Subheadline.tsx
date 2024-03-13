import React from "react";
import { formatDateTime } from "@/lib/utils";
import ShareEvent from "@/components/events/EventPage/ShareEvent";

const Subheading = ({ category, id, startDateTime }) => {
  return (
    <div className="wrapper flex justify-between items-center w-full">
      <p className={"text-base lg:text-lg font-semibold text-gray-600"}>
        {formatDateTime(startDateTime).dateOnlyWithoutYear} • {category.name}
      </p>
      <ShareEvent eventId={id} />
    </div>
  );
};

export default Subheading;
