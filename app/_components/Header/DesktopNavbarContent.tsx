"use client";

import { FC, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavbarContent, NavbarItem } from "@nextui-org/react";
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
            data-testid={`navbar-item-${link.testId}`}
            key={`${link.name}-${index}`}
            isActive={pathname.includes(link.href)}
          >
            <Link className="w-full" href={link.href}>
              {link.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      {children}
    </>
  );
};

export default DesktopNavbarContent;
