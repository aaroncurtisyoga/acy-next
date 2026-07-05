import HomeHero from "@/app/(root)/_components/HomeHero";
import WeeklySchedule from "@/app/(root)/_components/WeeklySchedule";
import MonthlySchedule from "@/app/(root)/_components/MonthlySchedule";
import FeaturedEvents from "@/app/(root)/_components/FeaturedEvents";
import HomeIntro from "@/app/(root)/_components/HomeIntro";
import NewsletterBand from "@/app/(root)/_components/NewsletterBand";

interface HomePageProps {
  searchParams: Promise<any>;
}

const HomePage = async ({ searchParams }: HomePageProps) => {
  const resolvedParams = await searchParams;
  const isMonthView = resolvedParams.view === "month";

  return (
    <div className="w-full">
      <HomeHero />
      <section
        id="this-week"
        className="mx-auto w-full max-w-screen-2xl scroll-mt-20"
      >
        {isMonthView ? (
          <MonthlySchedule searchParams={resolvedParams} />
        ) : (
          <WeeklySchedule searchParams={resolvedParams} />
        )}
      </section>
      <FeaturedEvents />
      <HomeIntro />
      <NewsletterBand />
    </div>
  );
};

export default HomePage;
