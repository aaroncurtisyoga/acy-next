import Collection from "@/components/events/Collection";
import FilterModal from "@/components/events/Filter/FilterModal";
import { getAllEvents } from "@/lib/actions/event.actions";

const UpcomingEvents = async ({ searchParams }) => {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";
  const { data, hasFiltersApplied, numberOfFilters, totalPages } =
    await getAllEvents({
      category,
      limit: 8,
      page,
      query: searchText,
    });

  return (
    <div
      className={
        "px-unit-5 py-unit-5 md:py-unit-15" +
        " md:px-unit-16 md:py-unit-10 min-h-[50dvh] md:min-h-auto"
      }
    >
      <h1 className={"text-3xl mb-6 md:text-7xl md:mb-8"}>Practice.</h1>
      <div className={"flex justify-between items-center mb-4"}>
        <p className={"font-semibold"}>
          Join me for upcoming classes and workshops
        </p>
        <FilterModal
          hasFiltersApplied={hasFiltersApplied}
          numberOfFilters={numberOfFilters}
        />
      </div>
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
  );
};

export default UpcomingEvents;
