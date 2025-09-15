import { getPublicCalendarLink } from "@/app/_lib/google-calendar";
import CalendarSubscription from "./CalendarSubscription";

const CalendarSubscriptionWrapper = () => {
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
    />
  );
};

export default CalendarSubscriptionWrapper;
