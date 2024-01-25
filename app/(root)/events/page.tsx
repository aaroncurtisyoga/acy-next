import Collection from "@/components/events/Collection";
import { getAllEvents } from "@/lib/actions/event.actions";

const EventsPage = async () => {
  const events = await getAllEvents({
    query: "",
    page: 1,
    limit: 6,
    category: "",
  });

  return (
    <div className={"wrapper"}>
      <h1 className={"text-3xl mb-8"}>Events</h1>
      <Collection
        data={events?.data}
        emptyTitle={"No Events Founds"}
        emptyStateSubtext={"Please visit back soon to check in for events."}
        collectionType={"All_Events"}
        limit={6}
        page={1}
        totalPages={2}
      />
    </div>
  );
};

export default EventsPage;
