import { FC } from "react";
import ShareEvent from "@/app/(root)/events/[id]/_components/ShareEvent";
import AddToCalendarButtons from "@/app/(root)/events/[id]/_components/AddToCalendarButtons";
import { formatDateTime } from "@/app/_lib/utils";

interface SubheadingProps {
  category: string;
  id: string;
  startDateTime: Date;
  event: {
    title: string;
    description?: string | null;
    startDateTime: Date | string;
    endDateTime: Date | string;
    location?: {
      formattedAddress?: string | null;
      name?: string | null;
    } | null;
  };
}
const Subheading: FC<SubheadingProps> = ({
  category,
  id,
  startDateTime,
  event,
}) => {
  return (
    <div className="wrapper-width flex justify-between items-center w-full py-3">
      <p className={"text-base lg:text-lg font-semibold text-gray-600"}>
        {formatDateTime(startDateTime).dateOnlyWithoutYear} • {category}
      </p>
      <div className="flex items-center gap-2">
        <AddToCalendarButtons event={event} />
        <ShareEvent eventId={id} />
      </div>
    </div>
  );
};

export default Subheading;
