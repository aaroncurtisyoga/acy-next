"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

  return <p onClick={handeClick}>Copy link to event</p>;
}

export default ShareEvent;
