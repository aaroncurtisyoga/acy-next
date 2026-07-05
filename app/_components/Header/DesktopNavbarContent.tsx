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
            "flex items-center px-3 py-2 text-[15px] font-medium lowercase transition-colors duration-200",
            pathname.includes(link.href)
              ? "text-foreground underline decoration-primary decoration-2 underline-offset-8"
              : "text-muted-foreground hover:text-foreground",
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
