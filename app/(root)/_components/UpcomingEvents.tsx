import { FC } from "react";
import Collection from "@/app/(root)/_components/Collection";
import FilterEventsModal from "@/app/(root)/_components/FilterEventsModal";
import { getAllEvents } from "@/app/_lib/actions/event.actions";
import { merriweather } from "@/app/fonts";

interface UpcomingEventsProps {
  searchParams: Promise<{
    page?: string;
    query?: string;
    category?: string;
  }>;
}

const UpcomingEvents: FC<UpcomingEventsProps> = async ({ searchParams }) => {
  // Await the searchParams promise before accessing its properties
  const resolvedParams = await searchParams;

  const page = Number(resolvedParams?.page) || 1;
  const searchText = (resolvedParams?.query as string) || "";
  const category = (resolvedParams?.category as string) || "";

  const { data, hasFiltersApplied, totalPages } = await getAllEvents({
    category,
    limit: 8,
    page,
    query: searchText,
  });

  const hasEvents = data.length > 0;

  return (
    <div
      className={
        "px-5 py-5 md:py-8" + " md:px-16 md:py-10 min-h-[50dvh] md:min-h-auto"
      }
    >
      <h1 className={`text-3xl mb-4 md:mb-6 ${merriweather.className}`}>
        Practice.
      </h1>

      {hasEvents && (
        <div className={"flex justify-between items-center mb-4"}>
          <p className={"font-semibold"}>
            Here&apos;s some upcoming events I&apos;ve got coming up:
          </p>
          <FilterEventsModal hasFiltersApplied={hasFiltersApplied} />
        </div>
      )}

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
