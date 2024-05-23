import { FC } from "react";
import EventCard from "@/app/(root)/_components/EventCard";
import EventText from "@/app/(root)/_components/EventText";
import NoEventsFound from "@/app/(root)/_components/NoEventsFound";
import Pagination from "@/app/(root)/_components/Pagination";
import { EventWithLocationAndCategory } from "@/_lib/types";

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
          <ul>
            {data.map((event) => {
              return (
                <li key={event.id}>
                  {view === "text" ? (
                    <EventText event={event} />
                  ) : (
                    <EventCard event={event} />
                  )}
                </li>
              );
            })}
          </ul>

          {totalPages > 1 && (
            <Pagination
              urlParamName={urlParamName}
              page={page}
              totalPages={totalPages}
            />
          )}
        </div>
      ) : (
        <NoEventsFound hasFiltersApplied={hasFiltersApplied} />
      )}
    </>
  );
};

export default Collection;
