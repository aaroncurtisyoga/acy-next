import { FC } from "react";
import { Card, CardBody } from "@heroui/card";
import EventCardContent from "@/app/(root)/_components/EventCard/EventCardContent";
import { EventWithLocationAndCategory } from "@/app/_lib/types";
import { formatDateTime, isToday } from "@/app/_lib/utils";

interface EventCardProps {
  event: EventWithLocationAndCategory;
  isHighlighted?: boolean;
}

const EventCard: FC<EventCardProps> = ({ event, isHighlighted = false }) => {
  const dateTime = formatDateTime(event.startDateTime);
  const dayLabel = isToday(event.startDateTime)
    ? "TODAY"
    : dateTime.weekdayShort.toUpperCase();

  return (
    <div className="w-full mb-4">
      <Card
        id={`event-${event.id}`}
        className={`w-full border ${isHighlighted ? "border-2 border-primary bg-blue-50/50 dark:bg-primary/5 shadow-lg" : "border-divider"} shadow-none hover:shadow-sm transition-shadow duration-200 rounded-2xl @container`}
      >
        <CardBody className="p-0">
          <div className="flex flex-col gap-0">
            <EventCardContent event={event} dayLabel={dayLabel} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default EventCard;
