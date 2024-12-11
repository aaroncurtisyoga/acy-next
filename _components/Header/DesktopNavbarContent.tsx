"use client";

import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from "@nextui-org/react";
import { User } from "lucide-react";
import AuthButtons from "@/_components/Header/AuthButtons";

interface DesktopNavbarContentProps {
  menuItems: { name: string; href: string; testId: string }[];
}

const DesktopNavbarContent: FC<DesktopNavbarContentProps> = ({ menuItems }) => {
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
          <DropdownItem>
            <AuthButtons />
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarContent>
  );
};

export default DesktopNavbarContent;
