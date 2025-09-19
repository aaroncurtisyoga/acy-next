import { google } from "googleapis";

// Initialize Google Calendar API client with service account
const initializeCalendarClient = () => {
  console.log("[Google Calendar] Initializing calendar client...");

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });
    console.log("[Google Calendar] Client initialized successfully");
    return calendar;
  } catch (error) {
    console.error("[Google Calendar] Failed to initialize client:", error);
    throw new Error(`Failed to initialize Google Calendar client: ${error}`);
  }
};

// Create a Google Calendar event
export const createCalendarEvent = async (event: {
  title: string;
  description?: string | null;
  startDateTime: Date | string;
  endDateTime: Date | string;
  location?: string;
  maxAttendees?: number | null;
  price?: string | null;
  isFree?: boolean;
  externalRegistrationUrl?: string | null;
}) => {
  console.log("[Google Calendar] Creating calendar event:", {
    title: event.title,
  });

  try {
    const calendar = initializeCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      console.error(
        "[Google Calendar] Missing GOOGLE_CALENDAR_ID environment variable",
      );
      throw new Error("Google Calendar ID not configured");
    }

    // Build event description with additional details
    let eventDescription = event.description || "";
    if (event.price && !event.isFree) {
      eventDescription += `\n\nPrice: $${event.price}`;
    }
    if (event.maxAttendees) {
      eventDescription += `\n\nMax Attendees: ${event.maxAttendees}`;
    }
    if (event.externalRegistrationUrl) {
      eventDescription += `\n\nRegister at: ${event.externalRegistrationUrl}`;
    }

    const calendarEvent = {
      summary: event.title,
      description: eventDescription.trim(),
      start: {
        dateTime: new Date(event.startDateTime).toISOString(),
        timeZone: "America/New_York", // Eastern Time
      },
      end: {
        dateTime: new Date(event.endDateTime).toISOString(),
        timeZone: "America/New_York", // Eastern Time
      },
      location: event.location,
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 }, // 1 day before
          { method: "popup", minutes: 60 }, // 1 hour before
        ],
      },
    };

    console.log(
      "[Google Calendar] Sending event to Google Calendar:",
      calendarEvent,
    );

    const response = await calendar.events.insert({
      calendarId,
      requestBody: calendarEvent,
    });

    console.log("[Google Calendar] Event created successfully:", {
      id: response.data.id,
      htmlLink: response.data.htmlLink,
    });

    return {
      googleEventId: response.data.id,
      googleEventLink: response.data.htmlLink,
    };
  } catch (error) {
    console.error("[Google Calendar] Failed to create event:", error);
    console.error(
      "[Google Calendar] Error details:",
      JSON.stringify(error, null, 2),
    );

    // Don't throw - return null to allow event creation to continue even if calendar sync fails
    return null;
  }
};

// Update a Google Calendar event
export const updateCalendarEvent = async (
  googleEventId: string,
  event: {
    title: string;
    description?: string | null;
    startDateTime: Date | string;
    endDateTime: Date | string;
    location?: string;
    maxAttendees?: number | null;
    price?: string | null;
    isFree?: boolean;
    externalRegistrationUrl?: string | null;
  },
) => {
  console.log("[Google Calendar] Updating calendar event:", {
    googleEventId,
    title: event.title,
  });

  try {
    const calendar = initializeCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      console.error(
        "[Google Calendar] Missing GOOGLE_CALENDAR_ID environment variable",
      );
      throw new Error("Google Calendar ID not configured");
    }

    // Build event description with additional details
    let eventDescription = event.description || "";
    if (event.price && !event.isFree) {
      eventDescription += `\n\nPrice: $${event.price}`;
    }
    if (event.maxAttendees) {
      eventDescription += `\n\nMax Attendees: ${event.maxAttendees}`;
    }
    if (event.externalRegistrationUrl) {
      eventDescription += `\n\nRegister at: ${event.externalRegistrationUrl}`;
    }

    const calendarEvent = {
      summary: event.title,
      description: eventDescription.trim(),
      start: {
        dateTime: new Date(event.startDateTime).toISOString(),
        timeZone: "America/New_York", // Eastern Time
      },
      end: {
        dateTime: new Date(event.endDateTime).toISOString(),
        timeZone: "America/New_York", // Eastern Time
      },
      location: event.location,
    };

    console.log(
      "[Google Calendar] Sending update to Google Calendar:",
      calendarEvent,
    );

    const response = await calendar.events.update({
      calendarId,
      eventId: googleEventId,
      requestBody: calendarEvent,
    });

    console.log("[Google Calendar] Event updated successfully:", {
      id: response.data.id,
      htmlLink: response.data.htmlLink,
    });

    return {
      googleEventId: response.data.id,
      googleEventLink: response.data.htmlLink,
    };
  } catch (error) {
    console.error("[Google Calendar] Failed to update event:", error);
    console.error(
      "[Google Calendar] Error details:",
      JSON.stringify(error, null, 2),
    );

    // Don't throw - return null to allow event update to continue even if calendar sync fails
    return null;
  }
};

// Delete a Google Calendar event
export const deleteCalendarEvent = async (googleEventId: string) => {
  console.log("[Google Calendar] Deleting calendar event:", { googleEventId });

  try {
    const calendar = initializeCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      console.error(
        "[Google Calendar] Missing GOOGLE_CALENDAR_ID environment variable",
      );
      throw new Error("Google Calendar ID not configured");
    }

    await calendar.events.delete({
      calendarId,
      eventId: googleEventId,
    });

    console.log("[Google Calendar] Event deleted successfully");
    return true;
  } catch (error: any) {
    // If event is already deleted, don't throw
    if (error?.code === 404) {
      console.log("[Google Calendar] Event already deleted or not found");
      return true;
    }

    console.error("[Google Calendar] Failed to delete event:", error);
    console.error(
      "[Google Calendar] Error details:",
      JSON.stringify(error, null, 2),
    );

    // Don't throw - return false to allow event deletion to continue
    return false;
  }
};

// Get public calendar subscription link
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

  console.log("[Google Calendar] Generated public calendar links:", {
    google: googleCalendarUrl,
    ical: icalUrl,
  });

  return {
    googleCalendarUrl,
    icalUrl,
  };
};

// Generate "Add to Calendar" links for a specific event
export const generateAddToCalendarLinks = (event: {
  title: string;
  description?: string | null;
  startDateTime: Date | string;
  endDateTime: Date | string;
  location?: string;
}) => {
  const startDate = new Date(event.startDateTime);
  const endDate = new Date(event.endDateTime);

  // Format dates for Google Calendar (YYYYMMDDTHHmmssZ)
  const formatGoogleDate = (date: Date) => {
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  };

  // Google Calendar link
  const googleParams = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
    details: event.description || "",
    location: event.location || "",
  });
  const googleCalendarLink = `https://calendar.google.com/calendar/render?${googleParams.toString()}`;

  // Outlook/Office 365 link
  const outlookParams = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: startDate.toISOString(),
    enddt: endDate.toISOString(),
    body: event.description || "",
    location: event.location || "",
  });
  const outlookLink = `https://outlook.live.com/calendar/0/deeplink/compose?${outlookParams.toString()}`;

  // Apple Calendar (using data URI with .ics file)
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${formatGoogleDate(startDate)}`,
    `DTEND:${formatGoogleDate(endDate)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description?.replace(/\n/g, "\\n") || ""}`,
    `LOCATION:${event.location || ""}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");

  const appleCalendarLink = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;

  console.log(
    "[Google Calendar] Generated add to calendar links for event:",
    event.title,
  );

  return {
    google: googleCalendarLink,
    outlook: outlookLink,
    apple: appleCalendarLink,
  };
};
