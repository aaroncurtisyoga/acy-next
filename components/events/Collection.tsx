import { FC } from "react";
import { Category, Event, Location } from "@prisma/client";
import EventCard from "@/components/events/EventCard";
import EventText from "@/components/events/EventText";
import Pagination from "@/components/events/Pagination";
import NoEventsFound from "@/components/events/NoEventsFound";

export type EventWithLocationAndCategory = Event & {
  location: Location;
  category: Category;
};
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
  // todo: check if user is admin user org
  return (
    <>
      {data.length > 0 ? (
        <div>
          <ul>
            {data.map((event) => {
              return (
                <li key={event.id}>
                  {view === "text" ? (
                    <EventText event={event} isAdmin={true} />
                  ) : (
                    <EventCard event={event} isAdmin={true} />
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
