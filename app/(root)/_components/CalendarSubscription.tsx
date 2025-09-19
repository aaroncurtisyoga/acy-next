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
import { FaGoogle } from "react-icons/fa";
import { HiOutlineLink } from "react-icons/hi";

interface CalendarSubscriptionProps {
  googleCalendarUrl: string;
  icalUrl: string;
}

const CalendarSubscription: FC<CalendarSubscriptionProps> = ({
  googleCalendarUrl,
  icalUrl,
}) => {
  const [copiedIcal, setCopiedIcal] = useState(false);

  const handleCopyIcal = async () => {
    try {
      await navigator.clipboard.writeText(icalUrl);
      setCopiedIcal(true);
      setTimeout(() => setCopiedIcal(false), 2000);
      console.log("[Calendar Subscription] iCal URL copied to clipboard");
    } catch (error) {
      console.error("[Calendar Subscription] Failed to copy iCal URL:", error);
    }
  };

  const handleGoogleCalendarClick = () => {
    console.log(
      "[Calendar Subscription] Opening Google Calendar subscription link",
    );
    window.open(googleCalendarUrl, "_blank");
  };

  return (
    <Card className="w-full mb-4 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-900/10 dark:to-transparent border border-primary-100 dark:border-primary-900/20 shadow-none hover:shadow-sm transition-all duration-300 rounded-2xl @container">
      <CardBody className="px-4 py-3.5 @sm:px-5 @sm:py-4">
        <div className="flex flex-col @sm:flex-row @sm:items-center @sm:justify-between gap-3">
          {/* Content Section */}
          <div className="flex-1">
            <p className="text-sm @sm:text-base text-foreground-700 dark:text-foreground-300">
              Add my upcoming classes to your calendar
            </p>
          </div>

          {/* Subscribe Button - Same for both mobile and desktop */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                color="primary"
                startContent={<Calendar className="w-4 h-4" />}
                endContent={<ChevronDown className="w-4 h-4" />}
                size="sm"
                className="font-medium min-w-[140px] @sm:min-w-fit"
              >
                Sync Calendar
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Calendar subscription options">
              <DropdownItem
                key="google"
                startContent={<FaGoogle className="w-4 h-4" />}
                description="Subscribe with Google Calendar"
                onClick={handleGoogleCalendarClick}
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
                onClick={handleCopyIcal}
              >
                {copiedIcal ? "Copied!" : "Copy iCal Link"}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardBody>
    </Card>
  );
};

export default CalendarSubscription;
