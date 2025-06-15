import { FC } from "react";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { Calendar, Filter } from "lucide-react";
import Collection from "@/app/(root)/_components/Collection";
import FilterEventsModal from "@/app/(root)/_components/FilterEventsModal";
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

  const { data, hasFiltersApplied, totalPages } = await getAllEvents({
    category,
    limit: 8,
    page,
    query: searchText,
  });

  const hasEvents = data.length > 0;

  return (
    <div className="h-full flex flex-col px-5 py-5 md:px-8 md:py-8 lg:px-12 lg:py-10">
      {hasEvents ? (
        <>
          {/* Header Section - Only show when there are events */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
                <Calendar size={24} />
              </div>
              <h1
                className={`text-3xl lg:text-4xl font-bold text-foreground-900 ${merriweather.className}`}
              >
                Practice.
              </h1>
            </div>
            <p className="text-lg text-foreground-600 leading-relaxed">
              Join me for upcoming yoga sessions, workshops, and mindful
              movement experiences.
            </p>
          </div>

          {/* Filter Bar */}
          <Card className="mb-6 shadow-sm border border-divider">
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
          </Card>

          {/* Events Collection */}
          <div className="flex-1">
            <Collection
              collectionType={"All_Events"}
              data={data}
              hasFiltersApplied={hasFiltersApplied}
              limit={8}
              page={page}
              totalPages={totalPages}
              view={"text"}
            />
          </div>
        </>
      ) : (
        // Empty State - No header, just the card
        <Card className="flex-1 shadow-none border-none">
          <CardBody className="flex flex-col items-center justify-center text-center py-12 px-6">
            <div className="p-4 rounded-full bg-primary-50 text-primary-300 mb-4">
              <Calendar size={48} />
            </div>
            <h3 className="text-xl font-semibold text-foreground-800 mb-2">
              No Events Scheduled
            </h3>
            <p className="text-foreground-600 max-w-md leading-relaxed">
              There aren&apos;t any events scheduled at the moment. Check back
              soon for upcoming yoga sessions and workshops!
            </p>
            {hasFiltersApplied && (
              <>
                <Divider className="my-4 w-24" />
                <p className="text-sm text-foreground-500">
                  Try adjusting your filters to see more events
                </p>
              </>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default UpcomingEvents;
