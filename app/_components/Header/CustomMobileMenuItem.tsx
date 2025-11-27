import { FC, ReactNode } from "react";
import Link from "next/link";
import { NavbarMenuItem } from "@heroui/navbar";
import { NavbarLink } from "@/app/_lib/types";

interface CustomMenuItemProps {
  children?: ReactNode;
  link?: NavbarLink;
  setIsMenuOpen?: (open: boolean) => void;
}
const CustomMobileMenuItem: FC<CustomMenuItemProps> = ({
  children,
  link,
  setIsMenuOpen,
}) => {
  return (
    <NavbarMenuItem
      className="navbar-menu-item"
      title={link?.name ? link.name : undefined}
    >
      {children ?? (
        <Link
          href={link.href}
          onClick={() => setIsMenuOpen(false)}
          className="block w-full text-lg font-medium text-gray-800 dark:text-gray-200"
          data-testid={`navbar-menu-item-${link.testId}`}
        >
          {link.name}
        </Link>
      )}
    </NavbarMenuItem>
  );
};

export default CustomMobileMenuItem;
