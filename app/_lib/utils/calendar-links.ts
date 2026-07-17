/**
 * Public Google Calendar subscription links (Google + iCal).
 *
 * Pure env-string builder — deliberately kept OUT of google-calendar.ts so a
 * client "Subscribe" button can import it without dragging the heavy googleapis
 * SDK toward the client bundle.
 */
export const getPublicCalendarLink = () => {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!calendarId) {
    console.error(
      "[Google Calendar] Missing GOOGLE_CALENDAR_ID environment variable",
    );
    return null;
  }

  // Google Calendar public URL format
  const googleCalendarUrl = `https://calendar.google.com/calendar/u/0?cid=${Buffer.from(calendarId).toString("base64")}`;

  // iCal format for Apple Calendar, Outlook, etc.
  const icalUrl = `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`;

  return {
    googleCalendarUrl,
    icalUrl,
  };
};
