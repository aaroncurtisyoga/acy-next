import { FC } from "react";
import Collection from "@/app/(root)/_components/Collection";
import FilterEvents from "@/app/(root)/_components/FilterEvents";
import { getAllEvents } from "@/lib/actions/event.actions";

interface UpcomingEventsProps {
  searchParams: any;
}

const UpcomingEvents: FC<UpcomingEventsProps> = async ({ searchParams }) => {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";
  const { data, hasFiltersApplied, totalPages } = await getAllEvents({
    category,
    limit: 8,
    page,
    query: searchText,
  });
  return (
    <div
      className={
        "px-5 py-5 md:py-8" + " md:px-16 md:py-10 min-h-[50dvh] md:min-h-auto"
      }
    >
      <h1 className={"text-3xl mb-4 md:text-7xl md:mb-6"}>Practice.</h1>
      <div className={"flex justify-between items-center mb-4"}>
        <p className={"font-semibold"}>
          Join me in upcoming events to practice together.
        </p>
        <FilterEvents hasFiltersApplied={hasFiltersApplied} />
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
