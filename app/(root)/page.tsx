import { Suspense } from "react";
import ImageResponsiveHandstand from "@/app/(root)/_components/ImageResponsiveHandstand";
import WeeklySchedule from "@/app/(root)/_components/WeeklySchedule";
import MonthlySchedule from "@/app/(root)/_components/MonthlySchedule";
import ScheduleToggle from "@/app/(root)/_components/ScheduleToggle";

interface HomePageProps {
  searchParams: Promise<any>;
}

const HomePage = async ({ searchParams }: HomePageProps) => {
  const resolvedParams = await searchParams;
  const isMonthView = resolvedParams.view === "month";

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
      <div className="flex flex-col">
        <div className="px-4 pt-5 md:px-6 lg:px-12 lg:pt-10">
          <Suspense>
            <ScheduleToggle />
          </Suspense>
        </div>
        {isMonthView ? (
          <MonthlySchedule searchParams={resolvedParams} />
        ) : (
          <WeeklySchedule searchParams={resolvedParams} />
        )}
      </div>
    </section>
  );
};

export default HomePage;
