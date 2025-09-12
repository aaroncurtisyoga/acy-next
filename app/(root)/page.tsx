import ImageResponsiveHandstand from "@/app/(root)/_components/ImageResponsiveHandstand";
import UpcomingEvents from "@/app/(root)/_components/UpcomingEvents";

interface EventsPageProps {
  searchParams: Promise<any>;
}

const EventsPage = async ({ searchParams }: EventsPageProps) => {
  const resolvedParams = await searchParams;

  return (
    <section
      className={"grid w-full max-w-7xl flex-1 " + "md:grid-cols-2 lg:mx-auto"}
    >
      <div
        className={
          "relative min-h-[300px] md:min-h-[400px] aspect-[4/3] md:aspect-auto"
        }
      >
        <ImageResponsiveHandstand />
      </div>
      <UpcomingEvents searchParams={resolvedParams} />
    </section>
  );
};

export default EventsPage;
