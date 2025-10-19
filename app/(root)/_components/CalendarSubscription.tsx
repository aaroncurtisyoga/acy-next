"use client";

import { FC, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Check, ChevronDown, Calendar } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineLink } from "react-icons/hi";
import { track } from "@vercel/analytics";

interface CalendarSubscriptionProps {
  googleCalendarUrl: string;
  icalUrl: string;
  inline?: boolean;
}

const CalendarSubscription: FC<CalendarSubscriptionProps> = ({
  googleCalendarUrl,
  icalUrl,
  inline = false,
}) => {
  const [copiedIcal, setCopiedIcal] = useState(false);

  const handleCopyIcal = async () => {
    try {
      await navigator.clipboard.writeText(icalUrl);
      setCopiedIcal(true);
      setTimeout(() => setCopiedIcal(false), 2000);
      console.log("[Calendar Subscription] iCal URL copied to clipboard");
      track("calendar_subscription", {
        method: "ical_copy",
        url: icalUrl,
      });
    } catch (error) {
      console.error("[Calendar Subscription] Failed to copy iCal URL:", error);
    }
  };

  const handleGoogleCalendarClick = () => {
    console.log(
      "[Calendar Subscription] Opening Google Calendar subscription link",
    );
    track("calendar_subscription", {
      method: "google_calendar",
      url: googleCalendarUrl,
    });
    window.open(googleCalendarUrl, "_blank");
  };

  const dropdownButton = (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="solid"
          color="primary"
          startContent={<Calendar className="w-4 h-4" />}
          endContent={<ChevronDown className="w-4 h-4" />}
          size="sm"
          className="font-medium min-w-[140px] @sm:min-w-fit"
        >
          Add to Calendar
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Calendar subscription options">
        <DropdownItem
          key="google"
          startContent={<FcGoogle className="w-4 h-4" />}
          description="Subscribe with Google Calendar"
          onPress={handleGoogleCalendarClick}
        >
          Google Calendar
        </DropdownItem>
        <DropdownItem
          key="ical"
          startContent={
            copiedIcal ? (
              <Check className="w-4 h-4" />
            ) : (
              <HiOutlineLink className="w-4 h-4" />
            )
          }
          description="Copy link for Apple Calendar, Outlook, etc."
          onPress={handleCopyIcal}
        >
          {copiedIcal ? "Copied!" : "Copy iCal Link"}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  // If inline mode, return just the button
  if (inline) {
    return dropdownButton;
  }

  // Otherwise, return with Card wrapper
  return (
    <Card className="w-full mb-4 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-gray-800/20 dark:to-transparent border border-gray-200 dark:border-gray-800 shadow-none hover:shadow-sm transition-all duration-300 rounded-2xl @container">
      <CardBody className="px-4 py-3.5 @sm:px-5 @sm:py-4">
        <div className="flex flex-col @sm:flex-row @sm:items-center @sm:justify-between gap-3">
          {/* Content Section */}
          <div className="flex-1">
            <p className="text-sm @sm:text-base text-foreground font-medium">
              Add my upcoming classes to your calendar
            </p>
          </div>

          {/* Subscribe Button - Same for both mobile and desktop */}
          {dropdownButton}
        </div>
      </CardBody>
    </Card>
  );
};

export default CalendarSubscription;
