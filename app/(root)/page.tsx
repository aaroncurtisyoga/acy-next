import ImageResponsiveHandstand from "@/app/(root)/_components/ImageResponsiveHandstand";
import WeeklySchedule from "@/app/(root)/_components/WeeklySchedule";

interface HomePageProps {
  searchParams: Promise<any>;
}

const HomePage = async ({ searchParams }: HomePageProps) => {
  const resolvedParams = await searchParams;

  return (
    <section
      className={
        "grid w-full max-w-7xl flex-1 md:grid-cols-[1fr_2fr] lg:mx-auto"
      }
    >
      <div
        className={
          "relative min-h-[300px] md:min-h-[400px] aspect-[4/3] md:aspect-auto"
        }
      >
        <ImageResponsiveHandstand />
      </div>
      <WeeklySchedule searchParams={resolvedParams} />
    </section>
  );
};

export default HomePage;
