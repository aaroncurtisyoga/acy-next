"use client";

import { FC, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { unauthenticatedLinks } from "@/app/_lib/constants";
import { track } from "@vercel/analytics";
import { cn } from "@/app/_lib/utils";

interface DesktopNavbarContentProps {
  children: ReactNode;
}

const DesktopNavbarContent: FC<DesktopNavbarContentProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div
      className="hidden sm:flex items-center gap-4 ml-auto"
      data-testid="navbar-menu-desktop"
    >
      {unauthenticatedLinks.map((link, index) => (
        <Link
          key={`${link.name}-${index}`}
          className={cn(
            "flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200",
            pathname.includes(link.href)
              ? "text-slate-800 bg-slate-100 dark:text-white dark:bg-gray-800"
              : "text-gray-700 dark:text-gray-300 hover:text-slate-700 hover:bg-slate-50 dark:hover:text-white dark:hover:bg-gray-800/50",
          )}
          href={link.href}
          aria-label={link.name}
          data-testid={`${link.testId}`}
          onClick={() => {
            track("navigation", {
              action: "desktop_nav_click",
              destination: link.name.toLowerCase(),
              href: link.href,
            });
          }}
        >
          {link.name}
        </Link>
      ))}

      {children}
    </div>
  );
};

export default DesktopNavbarContent;
