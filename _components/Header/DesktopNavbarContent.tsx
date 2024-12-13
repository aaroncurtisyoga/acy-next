"use client";

import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from "@nextui-org/react";
import { User } from "lucide-react";

interface DesktopNavbarContentProps {
  menuItems: { name: string; href: string; testId: string }[];
}

const DesktopNavbarContent: FC<DesktopNavbarContentProps> = ({ menuItems }) => {
  const { userId, isLoaded } = useAuth();
  const pathname = usePathname();

  return (
    <NavbarContent className="hidden sm:flex gap-4" justify="end">
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
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <button aria-label="User menu" className="flex items-center">
            <User className="w-6 h-6" />
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="User Menu" variant="flat">
          {
            isLoaded && userId ? (
              <DropdownItem key="logout">
                <Link href="/sign-out">Logout</Link>
              </DropdownItem>
            ) : isLoaded && !userId ? (
              <DropdownItem key="login">
                <Link href="/sign-in">Login</Link>
              </DropdownItem>
            ) : null /* Show nothing until isLoaded is true */
          }
        </DropdownMenu>
      </Dropdown>
    </NavbarContent>
  );
};

export default DesktopNavbarContent;
