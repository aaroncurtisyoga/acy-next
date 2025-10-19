import { FC } from "react";
import { Card, CardBody } from "@heroui/react";
import EventCard from "@/app/(root)/_components/EventCard";
import Pagination from "@/app/(root)/_components/Pagination";
import CalendarSubscriptionWrapper from "@/app/(root)/_components/CalendarSubscriptionWrapper";
import AddEventButton from "@/app/(root)/_components/AddEventButton";
import HighlightedEventScroller from "@/app/(root)/_components/HighlightedEventScroller";
import { getAllEvents, getEventById } from "@/app/_lib/actions/event.actions";
import { merriweather } from "@/app/fonts";
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
  // Await the searchParams promise before accessing its properties
  const resolvedParams = await searchParams;

  const page = Number(resolvedParams?.page) || 1;
  const searchText = (resolvedParams?.query as string) || "";
  const category = (resolvedParams?.category as string) || "";
  const highlightedEventId = (resolvedParams?.event as string) || "";

  // Fetch highlighted event if ID is provided
  let highlightedEvent: EventWithLocationAndCategory | null = null;
  if (highlightedEventId) {
    try {
      highlightedEvent = await getEventById(highlightedEventId);
    } catch (error) {
      console.error("Failed to fetch highlighted event:", error);
    }
  }

  const { data, hasFiltersApplied, totalPages, totalCount } =
    await getAllEvents({
      category,
      limit: 3,
      page,
      query: searchText,
    });

  // Filter out the highlighted event from regular data to avoid duplication
  const filteredData = highlightedEvent
    ? data.filter((event) => event.id !== highlightedEventId)
    : data;

  const hasEvents = filteredData.length > 0 || highlightedEvent !== null;

  return (
    <div className="flex flex-col px-6 py-5 pb-8 lg:px-12 lg:py-10 lg:pb-16">
      {/* Client component to handle scrolling */}
      {highlightedEventId && (
        <HighlightedEventScroller eventId={highlightedEventId} />
      )}
      {/* Header with integrated calendar subscription */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1
            className={`text-3xl lg:text-4xl font-bold text-foreground-900 ${merriweather.className}`}
          >
            Let&#39;s Practice
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-lg text-foreground-600 leading-relaxed">
            All my upcoming classes and events – subscribe to add them to your
            calendar
          </p>
          <CalendarSubscriptionWrapper inline />
        </div>
      </div>

      {/* Simple event count display */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <p className="font-semibold text-foreground-800">
              {totalCount} upcoming event{totalCount !== 1 ? "s" : ""}
            </p>
          </div>
          <AddEventButton />
        </div>
      </div>

      {/* Content area */}
      {hasEvents ? (
        <div className="flex-1">
          <div className="space-y-2">
            {/* Show highlighted event first if it exists */}
            {highlightedEvent && (
              <>
                <div className="text-sm text-primary dark:text-primary-300 font-medium mb-2">
                  Shared Event
                </div>
                <EventCard
                  key={`highlighted-${highlightedEvent.id}`}
                  event={highlightedEvent}
                  isHighlighted={true}
                />
                {filteredData.length > 0 && (
                  <div className="border-b border-divider my-6" />
                )}
              </>
            )}

            {/* Show regular events */}
            {filteredData.map((event) => (
              <EventCard key={event.id} event={event} isHighlighted={false} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mb-6 mt-8">
              <Pagination page={page} totalPages={totalPages} />
            </div>
          )}
        </div>
      ) : (
        // Empty State - Below filter bar
        <Card className="flex-1 border border-gray-200 dark:border-gray-800 shadow-none rounded-2xl transition-all duration-300 @container">
          <CardBody className="flex flex-col items-center justify-center text-center py-16 px-6 @sm:py-20 @sm:px-8">
            <h3 className="text-xl @sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
              No Events Found
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-base @sm:text-lg leading-relaxed font-medium @sm:px-10">
              {hasFiltersApplied
                ? "No events match your current filters. Try adjusting them to see more events."
                : "There aren't any events scheduled at the moment. Check back soon for upcoming yoga sessions and workshops!"}
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default UpcomingEvents;
