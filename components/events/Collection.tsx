import { IEvent } from "@/lib/mongodb/database/models/event.model";
import { checkRole } from "@/lib/utils";
import EventCard from "@/components/events/EventCard";
import EventText from "@/components/events/EventText";
import Pagination from "@/components/events/Pagination";

interface CollectionProps {
  collectionType?: "Events_Organized" | "My_Tickets" | "All_Events";
  data: IEvent[];
  emptyStateSubtext: string;
  emptyTitle: string;
  limit: number;
  page: number | string;
  totalPages?: number;
  urlParamName?: string;
  view?: "text" | "card";
}

const Collection = ({
  data,
  emptyStateSubtext,
  emptyTitle,
  page,
  totalPages = 0,
  urlParamName,
  view = "card",
}: CollectionProps) => {
  const isAdmin = checkRole("admin");

  return (
    <>
      {data.length > 0 ? (
        <div>
          <ul>
            {data.map((event) => {
              return (
                <li key={event._id}>
                  {view === "text" ? (
                    <EventText event={event} isAdmin={isAdmin} />
                  ) : (
                    <EventCard event={event} isAdmin={isAdmin} />
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
        <div>
          <h3>{emptyTitle}</h3>
          <p>{emptyStateSubtext}</p>
        </div>
      )}
    </>
  );
};

export default Collection;
