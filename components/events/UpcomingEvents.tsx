import CreateEventButton from "@/components/shared/CreateEventButton";
import Collection from "@/components/events/Collection";
import { checkRole } from "@/lib/utils";
import { getAllEvents } from "@/lib/actions/event.actions";

const UpcomingEvents = async ({ searchParams }) => {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";
  const isAdmin = checkRole("admin");

  const events = await getAllEvents({
    category,
    limit: 8,
    page,
    query: searchText,
  });

  return (
    <div>
      <p className={"text-semibold"}>
        Join me for upcoming workshops & classes
      </p>
      {isAdmin && <CreateEventButton />}
      <Collection
        collectionType={"All_Events"}
        data={events?.data}
        emptyStateSubtext={"Please visit back soon to check in for events."}
        emptyTitle={"No Events Founds"}
        limit={8}
        page={page}
        totalPages={events?.totalPages}
      />
    </div>
  );
};

export default UpcomingEvents;
