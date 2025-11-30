import { FC } from "react";
import EventCard from "@/app/(root)/_components/EventCard";
import { EventWithLocationAndCategory } from "@/app/_lib/types";

interface HighlightedEventSectionProps {
  event: EventWithLocationAndCategory;
  showDivider: boolean;
}

const HighlightedEventSection: FC<HighlightedEventSectionProps> = ({
  event,
  showDivider,
}) => {
  return (
    <>
      <div className="text-sm text-primary dark:text-primary-300 font-medium mb-2">
        Shared Event
      </div>
      <EventCard
        key={`highlighted-${event.id}`}
        event={event}
        isHighlighted={true}
      />
      {showDivider && <div className="border-b border-divider my-6" />}
    </>
  );
};

export default HighlightedEventSection;
