"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Share } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function ShareEvent({ eventId }: { eventId: string }) {
  const pathname = usePathname();
  const [isRecentlyCopied, setIsRecentlyCopied] = useState<boolean>(false);
  useEffect(() => {
    if (isRecentlyCopied === true) {
      setTimeout(() => {
        setIsRecentlyCopied(false);
      }, 2000);
    }
  }, [isRecentlyCopied]);
  const handeClick = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/events/${eventId}`,
    );
    setIsRecentlyCopied(true);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger
          onClick={handeClick}
          className={"text-base" + " lg:text-lg cursor-pointer"}
        >
          {isRecentlyCopied ? <Check /> : <Share />}
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy link to event</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ShareEvent;
