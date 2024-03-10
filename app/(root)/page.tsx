import Collection from "@/components/events/Collection";
import { getAllEvents } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import CreateEventButton from "@/components/shared/CreateEventButton";
// import { checkRole } from "@/lib/utils";
import { redirect } from "next/navigation";
import { checkRole } from "@/lib/utils";
import RichTextEditor from "@/components/shared/Index";
// import Search from "@/components/shared/Search";
// import CategoryFilter from "@/components/events/CategoryFilter";

const EventsPage = async ({ searchParams }: SearchParamProps) => {
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
    <section className={"wrapper flex flex-col"}>
      <p>
        <b>homepage content</b>
      </p>
      <RichTextEditor />
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

      {/*
      <div>
        <Search />
        <CategoryFilter />
      </div>
      */}
      {/* {isAdmin && <CreateEventButton />}
      <Collection
        collectionType={"All_Events"}
        data={events?.data}
        emptyStateSubtext={"Please visit back soon to check in for events."}
        emptyTitle={"No Events Founds"}
        limit={8}
        page={page}
        totalPages={events?.totalPages}
      />*/}
    </section>
  );
};

export default EventsPage;
