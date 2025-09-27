"use client";

import { useEffect } from "react";

interface HighlightedEventScrollerProps {
  eventId: string;
}

const HighlightedEventScroller: React.FC<HighlightedEventScrollerProps> = ({
  eventId,
}) => {
  useEffect(() => {
    if (eventId) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(`event-${eventId}`);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    }
  }, [eventId]);

  return null; // This component doesn't render anything
};

export default HighlightedEventScroller;
