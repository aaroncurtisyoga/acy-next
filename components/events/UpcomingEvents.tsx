import CreateEventButton from "@/components/shared/CreateEventButton";
import Collection from "@/components/events/Collection";
import FilterModal from "@/components/events/FilterModal";
import { checkRole } from "@/lib/utils";
import { getAllEvents } from "@/lib/actions/event.actions";

const UpcomingEvents = async ({ searchParams }) => {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";
  const isAdmin = checkRole("admin");
  const hasFiltersApplied: boolean = Boolean(searchText || category);
  console.log("searchParams", searchParams);

  const events = await getAllEvents({
    category,
    limit: 8,
    page,
    query: searchText,
  });

  return (
    <div className={"px-unit-5 py-unit-15 md:px-unit-16 md:py-unit-10"}>
      <h1 className={"text-3xl mb-6 md:text-7xl md:mb-8"}>
        Practice. Explore. Connect.
      </h1>
      <div className={"flex justify-between items-center mb-4"}>
        <p className={"font-semibold"}>
          Join me for upcoming classes and workshops
        </p>

        <FilterModal />
      </div>
      <Collection
        collectionType={"All_Events"}
        data={events?.data}
        emptyStateSubtext={"Please visit back soon to check in for events."}
        emptyTitle={"No Events Founds"}
        limit={8}
        page={page}
        totalPages={events?.totalPages}
        view={"text"}
      />
      {isAdmin && <CreateEventButton />}
    </div>
  );
};

export default UpcomingEvents;
