import { FC } from "react";
import EventCard from "@/app/(root)/_components/EventCard";
import Pagination from "@/app/(root)/_components/Pagination";
import HighlightedEventSection from "@/app/(root)/_components/HighlightedEventSection";
import { EventWithLocationAndCategory } from "@/app/_lib/types";

interface EventsListProps {
  events: EventWithLocationAndCategory[];
  highlightedEvent: EventWithLocationAndCategory | null;
  page: number;
  totalPages: number;
}

const EventsList: FC<EventsListProps> = ({
  events,
  highlightedEvent,
  page,
  totalPages,
}) => {
  return (
    <div className="flex-1">
      <div className="space-y-2">
        {highlightedEvent && (
          <HighlightedEventSection
            event={highlightedEvent}
            showDivider={events.length > 0}
          />
        )}

        {events.map((event) => (
          <EventCard key={event.id} event={event} isHighlighted={false} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mb-6 mt-8">
          <Pagination page={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
};

export default EventsList;
