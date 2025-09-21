"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";

export const usePageTracking = () => {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(Date.now());
  const scrollDepthRef = useRef<number>(0);

  useEffect(() => {
    // Track page view
    track("page_view", {
      path: pathname,
      timestamp: new Date().toISOString(),
    });

    // Reset start time for new page
    startTimeRef.current = Date.now();
    scrollDepthRef.current = 0;

    // Track scroll depth
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = documentHeight > 0 ? scrollTop / documentHeight : 0;

      if (scrollDepth > scrollDepthRef.current) {
        scrollDepthRef.current = scrollDepth;
      }
    };

    // Track time on page when leaving
    const handleBeforeUnload = () => {
      const timeOnPage = Date.now() - startTimeRef.current;
      track("page_exit", {
        path: pathname,
        time_on_page_ms: timeOnPage,
        scroll_depth: scrollDepthRef.current,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // Track page exit when component unmounts (route change)
      const timeOnPage = Date.now() - startTimeRef.current;
      track("page_exit", {
        path: pathname,
        time_on_page_ms: timeOnPage,
        scroll_depth: scrollDepthRef.current,
      });
    };
  }, [pathname]);
};

export default usePageTracking;
