import { SearchParamProps } from "@/_lib/types";
import ImageResponsiveHandstand from "@/app/(root)/_components/ImageResponsiveHandstand";
import UpcomingEvents from "@/app/(root)/_components/UpcomingEvents";

const EventsPage = async ({ searchParams }: SearchParamProps) => {
  return (
    <section
      className={
        "grid grow w-full md:min-h-[calc(100dvh-201px)] max-w-screen-2xl " +
        "md:grid-cols-[1fr,1fr] 11rem)] lg:mx-auto"
      }
    >
      <div className={"relative"}>
        <ImageResponsiveHandstand />
      </div>
      <UpcomingEvents searchParams={searchParams} />
    </section>
  );
};

export default EventsPage;
