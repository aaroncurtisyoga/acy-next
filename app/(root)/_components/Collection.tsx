import { FC } from "react";
import EventCard from "@/app/(root)/_components/EventCard";
import EventText from "@/app/(root)/_components/EventText";
import NoEventsFound from "@/app/(root)/_components/NoEventsFound";
import Pagination from "@/app/(root)/_components/Pagination";
import { EventWithLocationAndCategory } from "@/app/_lib/types";

interface CollectionProps {
  collectionType?: "Events_Organized" | "My_Tickets" | "All_Events";
  data: EventWithLocationAndCategory[];
  hasFiltersApplied?: boolean;
  limit: number;
  page: number | string;
  totalPages?: number;
  urlParamName?: string;
  view?: "text" | "card";
}

const Collection: FC<CollectionProps> = ({
  data,
  hasFiltersApplied = false,
  page,
  totalPages = 0,
  urlParamName,
  view = "card",
}) => {
  return (
    <>
      {data.length > 0 ? (
        <div>
          {view === "text" ? (
            <div className="space-y-2">
              {data.map((event) => (
                <EventText key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {data.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mb-6">
              <Pagination
                urlParamName={urlParamName}
                page={page}
                totalPages={totalPages}
              />
            </div>
          )}
        </div>
      ) : (
        <NoEventsFound hasFiltersApplied={hasFiltersApplied} />
      )}
    </>
  );
};

export default Collection;
