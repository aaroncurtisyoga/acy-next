import { getPublicCalendarLink } from "@/app/_lib/google-calendar";
import CalendarSubscription from "./CalendarSubscription";

interface CalendarSubscriptionWrapperProps {
  inline?: boolean;
}

const CalendarSubscriptionWrapper = ({
  inline = false,
}: CalendarSubscriptionWrapperProps = {}) => {
  const calendarLinks = getPublicCalendarLink();

  if (!calendarLinks) {
    console.warn(
      "[Calendar Subscription] Calendar links not available - check environment variables",
    );
    return null;
  }

  return (
    <CalendarSubscription
      googleCalendarUrl={calendarLinks.googleCalendarUrl}
      icalUrl={calendarLinks.icalUrl}
      inline={inline}
    />
  );
};

export default CalendarSubscriptionWrapper;
