import Collection from "@/components/events/Collection";
import { getAllEvents } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import Search from "@/components/shared/Search";
import CategoryFilter from "@/components/events/CategoryFilter";

const EventsPage = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";

  const events = await getAllEvents({
    category,
    limit: 8,
    page,
    query: searchText,
  });

  return (
    <section className={"wrapper flex flex-col"}>
      {/*<Image
            alt="Yoga posture hand to big toe"
            // className="object-cover"
            fill={true}
            sizes="(min-width: 1640px) 768px, calc(45vw + 39px)"
            priority={true}
            placeholder={"blur"}
            loading="eager"
            src={handstandPicture}
          />*/}
      homepage
      {/*
      <div>
        <Search />
        <CategoryFilter />
      </div>
      */}
      <Collection
        data={events?.data}
        emptyTitle={"No Events Founds"}
        emptyStateSubtext={"Please visit back soon to check in for events."}
        collectionType={"All_Events"}
        limit={8}
        page={page}
        totalPages={events?.totalPages}
      />
    </section>
  );
};

export default EventsPage;
