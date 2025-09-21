import { FC } from "react";
import { Card, CardBody } from "@heroui/react";
import EventCard from "@/app/(root)/_components/EventCard";
import Pagination from "@/app/(root)/_components/Pagination";
import CalendarSubscriptionWrapper from "@/app/(root)/_components/CalendarSubscriptionWrapper";
import AddEventButton from "@/app/(root)/_components/AddEventButton";
import { getAllEvents } from "@/app/_lib/actions/event.actions";
import { merriweather } from "@/app/fonts";

interface UpcomingEventsProps {
  searchParams: Promise<{
    page?: string;
    query?: string;
    category?: string;
  }>;
}

const UpcomingEvents: FC<UpcomingEventsProps> = async ({ searchParams }) => {
  // Await the searchParams promise before accessing its properties
  const resolvedParams = await searchParams;

  const page = Number(resolvedParams?.page) || 1;
  const searchText = (resolvedParams?.query as string) || "";
  const category = (resolvedParams?.category as string) || "";

  const { data, hasFiltersApplied, totalPages, totalCount } =
    await getAllEvents({
      category,
      limit: 3,
      page,
      query: searchText,
    });

  const hasEvents = data.length > 0;

  return (
    <div className="flex flex-col px-6 py-5 pb-8 lg:px-12 lg:py-10 lg:pb-16">
      {/* Header - Always show */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1
            className={`text-3xl lg:text-4xl font-bold text-foreground-900 ${merriweather.className}`}
          >
            Practice.
          </h1>
        </div>
        <p className="text-lg text-foreground-600 leading-relaxed">
          Join me for upcoming yoga sessions, workshops, and mindful movement
          experiences.
        </p>
      </div>

      {/* Filter bar - Always show */}
      {/* <Card className="mb-6 shadow-sm border border-divider">
        <CardBody className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-500"></div>
              <p className="font-semibold text-foreground-800">
                {data.length} upcoming event{data.length !== 1 ? "s" : ""}
              </p>
              {hasFiltersApplied && (
                <div className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                  Filtered
                </div>
              )}
            </div>
            <FilterEventsModal hasFiltersApplied={hasFiltersApplied} />
          </div>
        </CardBody>
      </Card> */}

      {/* Calendar Subscription */}
      <CalendarSubscriptionWrapper />

      {/* Simple event count display */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-500"></div>
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
            {data.map((event) => (
              <EventCard key={event.id} event={event} />
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
        <Card className="flex-1 border border-primary-100 dark:border-primary-900/20 shadow-none rounded-2xl transition-all duration-300 @container">
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
