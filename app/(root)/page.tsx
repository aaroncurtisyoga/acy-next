import ImageResponsiveHandstand from "@/components/shared/ImageResponsiveHandstand";
import UpcomingEvents from "@/components/events/UpcomingEvents";
import { SearchParamProps } from "@/types";

const EventsPage = async ({ searchParams }: SearchParamProps) => {
  return (
    <section
      className={
        "grid grow w-full" +
        " max-w-screen-2xl lg:mx-auto min-h-[calc(100dvh-64px)] md:grid-cols-[1fr,1fr] 11rem)]  "
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
