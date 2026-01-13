import { FC } from "react";
import CalendarSubscriptionWrapper from "@/app/(root)/_components/CalendarSubscriptionWrapper";

const UpcomingEventsHeader: FC = () => {
  return (
    <div className="flex items-center justify-between gap-3 mb-6 md:mb-8">
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground-900">
        Move ~ Breathe ~ Be
      </h1>
      <div className="flex items-center gap-2">
        <CalendarSubscriptionWrapper inline />
      </div>
    </div>
  );
};

export default UpcomingEventsHeader;
