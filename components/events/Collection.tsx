import Card from "@/components/events/Card";
import Pagination from "@/components/events/Pagination";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import { checkRole } from "@/lib/utils";

type CollectionProps = {
  data: IEvent[];
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  page: number | string;
  totalPages?: number;
  urlParamName?: string;
  collectionType?: "Events_Organized" | "My_Tickets" | "All_Events";
};

const Collection = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages = 0,
  urlParamName,
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
                  <Card event={event} isAdmin={isAdmin} />
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
