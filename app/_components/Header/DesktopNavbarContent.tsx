"use client";

import { FC, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavbarContent, NavbarItem } from "@heroui/react";
import { unauthenticatedLinks } from "@/app/_lib/constants";

interface DesktopNavbarContentProps {
  children: ReactNode;
}

const DesktopNavbarContent: FC<DesktopNavbarContentProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <>
      <NavbarContent
        className="hidden sm:flex gap-4"
        justify="end"
        data-testid="navbar-menu-desktop"
      >
        {/* Auth and Unauthenticated Links */}
        {unauthenticatedLinks.map((link, index) => (
          <NavbarItem
            key={`${link.name}-${index}`}
            isActive={pathname.includes(link.href)}
          >
            <Link
              className="w-full"
              href={link.href}
              aria-label={link.name}
              data-testid={`${link.testId}`}
            >
              {link.name}
            </Link>
          </NavbarItem>
        ))}

        {/* User Dropdown is passed as children */}
        {children}
      </NavbarContent>
    </>
  );
};

export default DesktopNavbarContent;
