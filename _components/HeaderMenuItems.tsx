import React from "react";
import Link from "next/link";
import { NavbarItem, NavbarMenuItem } from "@nextui-org/react";

interface MenuItemsProps {
  menuItems: Array<{ href: string; name: string; testId: string }>;
  isMenu: boolean; // true for `NavbarMenuItem`, false for `NavbarItem`
  pathname: string;
}

const HeaderMenuItems: React.FC<MenuItemsProps> = ({
  menuItems,
  isMenu,
  pathname,
}) => {
  return (
    <>
      {menuItems.map((link, index) =>
        isMenu ? (
          <NavbarMenuItem
            key={`${link.name}-${index}`}
            data-testid={`menu-item-${link.testId}`}
            className="py-3 px-4 w-full text-right border-b border-gray-400 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <Link
              href={link.href}
              className="block w-full text-lg font-medium text-gray-800"
            >
              {link.name}
            </Link>
          </NavbarMenuItem>
        ) : (
          <NavbarItem
            key={`${link.name}-${index}`}
            data-testid={`navbar-item-${link.testId}`}
            isActive={pathname.includes(link.href)}
          >
            <Link className="w-full" href={link.href}>
              {link.name}
            </Link>
          </NavbarItem>
        ),
      )}
    </>
  );
};

export default HeaderMenuItems;
