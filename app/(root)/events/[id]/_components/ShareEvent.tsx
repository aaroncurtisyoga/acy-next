"use client";

import { FC, useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Check, Share } from "lucide-react";

interface ShareEventProps {
  eventId: string;
}
const ShareEvent: FC<ShareEventProps> = ({ eventId }) => {
  const [isRecentlyCopied, setIsRecentlyCopied] = useState<boolean>(false);
  useEffect(() => {
    if (isRecentlyCopied === true) {
      setTimeout(() => {
        setIsRecentlyCopied(false);
      }, 2000);
    }
  }, [isRecentlyCopied]);
  const handleClick = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/events/${eventId}`,
    );
    setIsRecentlyCopied(true);
  };

  return (
    <Tooltip content={`Copy link to event`}>
      <Button
        isIconOnly
        onPress={handleClick}
        radius={"full"}
        variant={"light"}
      >
        {isRecentlyCopied ? <Check /> : <Share />}
      </Button>
    </Tooltip>
  );
};

export default ShareEvent;
