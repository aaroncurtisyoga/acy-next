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
import { Calendar, Check, Copy, ChevronDown } from "lucide-react";

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
    <Card className="mb-6 shadow-sm border border-divider">
      <CardBody className="px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary-50 text-primary-500">
              <Calendar size={20} />
            </div>
            <div>
              <p className="font-semibold text-foreground-800">
                Subscribe to Calendar
              </p>
              <p className="text-xs text-foreground-600">
                Stay updated with all upcoming events
              </p>
            </div>
          </div>

          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                color="primary"
                endContent={<ChevronDown size={16} />}
                size="sm"
              >
                Add to Calendar
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Calendar subscription options">
              <DropdownItem
                key="google"
                startContent={<Calendar size={16} />}
                description="Subscribe with Google Calendar"
                onClick={handleGoogleCalendarClick}
              >
                Google Calendar
              </DropdownItem>
              <DropdownItem
                key="ical"
                startContent={
                  copiedIcal ? <Check size={16} /> : <Copy size={16} />
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
