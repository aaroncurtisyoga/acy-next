import { FC } from "react";
import { Card, CardBody } from "@heroui/react";
import { Calendar } from "lucide-react";
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
    limit: 4,
    page,
    query: searchText,
  });

  const hasEvents = data.length > 0;

  return (
    <div className="h-full flex flex-col px-5 py-5 md:px-8 md:py-8 lg:px-12 lg:py-10">
      {/* Header - Always show */}
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
          Join me for upcoming yoga sessions, workshops, and mindful movement
          experiences.
        </p>
      </div>

      {/* Filter bar - Always show */}
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

      {/* Content area */}
      {hasEvents ? (
        <div className="flex-1">
          <Collection
            collectionType={"All_Events"}
            data={data}
            hasFiltersApplied={hasFiltersApplied}
            limit={4}
            page={page}
            totalPages={totalPages}
            view={"text"}
          />
        </div>
      ) : (
        // Empty State - Below filter bar
        <Card className="flex-1 shadow-none border-none">
          <CardBody className="flex flex-col items-center justify-center text-center py-12 px-6">
            <div className="p-4 rounded-full bg-primary-50 text-primary-300 mb-4">
              <Calendar size={48} />
            </div>
            <h3 className="text-xl font-semibold text-foreground-800 mb-2">
              No Events Found
            </h3>
            <p className="text-foreground-600 max-w-md leading-relaxed">
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
