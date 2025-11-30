import { FC } from "react";
import CalendarSubscriptionWrapper from "@/app/(root)/_components/CalendarSubscriptionWrapper";
import AddEventButton from "@/app/(root)/_components/AddEventButton";
import { merriweather } from "@/app/fonts";

const UpcomingEventsHeader: FC = () => {
  return (
    <div className="flex items-center justify-between gap-3 mb-6 md:mb-8">
      <h1
        className={`text-3xl font-bold text-foreground-900 ${merriweather.className}`}
      >
        Let&#39;s Practice
      </h1>
      <div className="flex items-center gap-2">
        <CalendarSubscriptionWrapper inline />
        <AddEventButton />
      </div>
    </div>
  );
};

export default UpcomingEventsHeader;
