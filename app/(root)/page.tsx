import HomepageHero from "@/components/shared/HomepageHero";
import UpcomingEvents from "@/components/events/UpcomingEvents";
import { SearchParamProps } from "@/types";

const EventsPage = async ({ searchParams }: SearchParamProps) => {
  return (
    <section
      className={
        "grid md:grid-cols-[1fr,1fr] 11rem)] grow w-full" +
        " max-w-screen-2xl lg:mx-auto min-h-[calc(100dvh-64px)] "
      }
    >
      <div className={"relative"}>
        <HomepageHero />
      </div>
      <UpcomingEvents searchParams={searchParams} />
    </section>
  );
};

export default EventsPage;

//  h-[calc(100vh - 64px)]
