"use client";

import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavbarContent, NavbarItem } from "@nextui-org/react";
import AuthButtons from "@/_components/Header/AuthButtons";

interface DesktopNavbarContentProps {
  menuItems: { name: string; href: string; testId: string }[];
}

const DesktopNavbarContent: FC<DesktopNavbarContentProps> = ({ menuItems }) => {
  const pathname = usePathname();

  return (
    <NavbarContent className="hidden sm:flex gap-4" justify="end">
      <>
        {menuItems.map((link, index) => (
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
        <NavbarItem
          data-testid="navbar-login"
          isActive={pathname.includes("/sign-in")}
          className="min-w-[32px]"
        >
          <AuthButtons />
        </NavbarItem>
      </>
    </NavbarContent>
  );
};

export default DesktopNavbarContent;
