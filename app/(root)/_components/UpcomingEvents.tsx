import { FC } from "react";
import HighlightedEventScroller from "@/app/(root)/_components/HighlightedEventScroller";
import UpcomingEventsHeader from "@/app/(root)/_components/UpcomingEventsHeader";
import EventsList from "@/app/(root)/_components/EventsList";
import EmptyEventsState from "@/app/(root)/_components/EmptyEventsState";
import { getAllEvents, getEventById } from "@/app/_lib/actions/event.actions";
import { EventWithLocationAndCategory } from "@/app/_lib/types";

interface UpcomingEventsProps {
  searchParams: Promise<{
    page?: string;
    query?: string;
    category?: string;
    event?: string;
  }>;
}

const UpcomingEvents: FC<UpcomingEventsProps> = async ({ searchParams }) => {
  const resolvedParams = await searchParams;

  const page = Number(resolvedParams?.page) || 1;
  const searchText = (resolvedParams?.query as string) || "";
  const category = (resolvedParams?.category as string) || "";
  const highlightedEventId = (resolvedParams?.event as string) || "";

  let highlightedEvent: EventWithLocationAndCategory | null = null;
  if (highlightedEventId) {
    try {
      highlightedEvent = await getEventById(highlightedEventId);
    } catch (error) {
      console.error("Failed to fetch highlighted event:", error);
    }
  }

  const { data, hasFiltersApplied, totalPages } = await getAllEvents({
    category,
    limit: 5,
    page,
    query: searchText,
  });

  const filteredData = highlightedEvent
    ? data.filter((event) => event.id !== highlightedEventId)
    : data;

  const hasEvents = filteredData.length > 0 || highlightedEvent !== null;

  return (
    <div className="flex flex-col px-6 py-5 pb-8 lg:px-12 lg:py-10 lg:pb-16">
      {highlightedEventId && (
        <HighlightedEventScroller eventId={highlightedEventId} />
      )}

      <UpcomingEventsHeader />

      {hasEvents ? (
        <EventsList
          events={filteredData}
          highlightedEvent={highlightedEvent}
          page={page}
          totalPages={totalPages}
        />
      ) : (
        <EmptyEventsState hasFiltersApplied={hasFiltersApplied} />
      )}
    </div>
  );
};

export default UpcomingEvents;
