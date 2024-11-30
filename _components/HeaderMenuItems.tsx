"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { NavbarItem, NavbarMenuItem } from "@nextui-org/react";
import { adminLinks, authenticatedLinks, userLinks } from "@/_lib/constants";

interface MenuItemsProps {
  isMenu: boolean; // true for Mobile, false for Desktop
}

const HeaderMenuItems: React.FC<MenuItemsProps> = ({ isMenu }) => {
  const pathname = usePathname();
  const { isSignedIn, isLoaded, user } = useUser();
  const [menuItems, setMenuItems] = useState([...userLinks]);

  useEffect(() => {
    if (!isLoaded) return;

    const isAdmin = user?.publicMetadata.role === "admin";
    setMenuItems([
      ...userLinks,
      ...(isSignedIn ? authenticatedLinks : []),
      ...(isAdmin ? adminLinks : []),
    ]);
  }, [isSignedIn, isLoaded, user]);

  if (!isLoaded) {
    return <span>Loading...</span>;
  }

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
