"use client";

import { FC, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Calendar, Check } from "lucide-react";

interface AddToCalendarButtonsProps {
  event: {
    title: string;
    description?: string | null;
    startDateTime: Date | string;
    endDateTime: Date | string;
    location?: {
      formattedAddress?: string | null;
      name?: string | null;
    } | null;
  };
}

const AddToCalendarButtons: FC<AddToCalendarButtonsProps> = ({ event }) => {
  const [addedToCalendar, setAddedToCalendar] = useState(false);

  const generateCalendarLinks = () => {
    const startDate = new Date(event.startDateTime);
    const endDate = new Date(event.endDateTime);
    const location =
      event.location?.formattedAddress || event.location?.name || "";

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
      location: location,
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
      location: location,
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
      `LOCATION:${location}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");

    return {
      google: googleCalendarLink,
      outlook: outlookLink,
      apple: `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`,
    };
  };

  const handleAddToCalendar = (type: "google" | "outlook" | "apple") => {
    const links = generateCalendarLinks();
    console.log(
      `[Add to Calendar] Opening ${type} calendar link for event:`,
      event.title,
    );

    if (type === "apple") {
      // For Apple Calendar, create a downloadable .ics file
      const element = document.createElement("a");
      element.setAttribute("href", links[type]);
      element.setAttribute(
        "download",
        `${event.title.replace(/\s+/g, "_")}.ics`,
      );
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      window.open(links[type], "_blank");
    }

    setAddedToCalendar(true);
    setTimeout(() => setAddedToCalendar(false), 2000);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          color="default"
          variant="bordered"
          startContent={
            addedToCalendar ? <Check size={18} /> : <Calendar size={18} />
          }
        >
          {addedToCalendar ? "Added!" : "Add to Calendar"}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Add to calendar options">
        <DropdownItem
          key="google"
          description="Add to Google Calendar"
          onPress={() => handleAddToCalendar("google")}
        >
          Google Calendar
        </DropdownItem>
        <DropdownItem
          key="outlook"
          description="Add to Outlook/Office 365"
          onPress={() => handleAddToCalendar("outlook")}
        >
          Outlook Calendar
        </DropdownItem>
        <DropdownItem
          key="apple"
          description="Download .ics file for Apple Calendar"
          onPress={() => handleAddToCalendar("apple")}
        >
          Apple Calendar
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AddToCalendarButtons;
