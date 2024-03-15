import ImageResponsiveHandstand from "@/components/shared/ImageResponsiveHandstand";
import UpcomingEvents from "@/components/events/UpcomingEvents";
import { SearchParamProps } from "@/types";

const EventsPage = async ({ searchParams }: SearchParamProps) => {
  return (
    <section
      className={
        ""
        // " md:grid md:grow md:w-full" +
        // " md:max-w-screen-2xl md:grid-cols-[1fr,1fr] 11rem)]" +
        // " md:min-h-[calc(100dvh-64px)] lg:mx-auto min-h-full"
      }
    >
      <div className={"relative "}>
        <ImageResponsiveHandstand />
      </div>
      {/*  <UpcomingEvents searchParams={searchParams} />*/}
    </section>
  );
};

export default EventsPage;
