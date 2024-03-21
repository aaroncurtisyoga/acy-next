import ImageResponsiveHandstand from "@/components/shared/ImageResponsiveHandstand";
import UpcomingEvents from "@/components/events/UpcomingEvents";
import { SearchParamProps } from "@/types";

const EventsPage = async ({ searchParams }: SearchParamProps) => {
  return (
    <section
      className={
        "grid grow w-full md:min-h-[calc(100dvh-64px)] max-w-screen-2xl " +
        "md:grid-cols-[1fr,1fr] 11rem)] lg:mx-auto"
      }
    >
      <div className={"relative"}>
        <p>hey</p>
        <ImageResponsiveHandstand />
      </div>
      <UpcomingEvents searchParams={searchParams} />
    </section>
  );
};

export default EventsPage;
