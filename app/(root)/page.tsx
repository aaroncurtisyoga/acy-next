import ImageResponsiveHandstand from "@/app/(root)/_components/ImageResponsiveHandstand";
import UpcomingEvents from "@/app/(root)/_components/UpcomingEvents";

const EventsPage = async ({ searchParams }) => {
  const resolvedParams = await searchParams;

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
      <UpcomingEvents searchParams={resolvedParams} />
    </section>
  );
};

export default EventsPage;
