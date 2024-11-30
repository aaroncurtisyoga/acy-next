"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import { NavbarMenuItem } from "@nextui-org/react";
import {
  adminLinks,
  authenticatedLinks,
  unauthenticatedLinks,
} from "@/_lib/constants";

const MenuItems = () => {
  const { signOut } = useClerk();
  const { isSignedIn, isLoaded, user } = useUser();
  const [menuItems, setMenuItems] = useState([...unauthenticatedLinks]);

  useEffect(() => {
    if (!isLoaded) return;

    const isAdmin = user?.publicMetadata.role === "admin";

    // Update menu items based on user state
    setMenuItems((prev) => [
      ...prev,
      ...(isSignedIn ? authenticatedLinks : []),
      ...(isAdmin ? adminLinks : []),
    ]);
  }, [isLoaded, isSignedIn, user]);

  return (
    <div className="flex flex-col items-end w-full space-y-4">
      {/* Render Menu Items */}
      {menuItems.map((link, index) => (
        <NavbarMenuItem
          key={`${link.name}-${index}`}
          data-testid={`menu-item-${link.testId}`}
          className="py-3 px-4 w-full text-right border-b border-gray-400 hover:bg-primary/10 focus:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
        >
          <Link
            href={link.href}
            className="block w-full text-lg font-medium text-gray-800"
          >
            {link.name}
          </Link>
        </NavbarMenuItem>
      ))}

      {/* The Login/Logout button using Clerk's API */}
      <div className="w-full">
        <SignedIn>
          <button
            type="button"
            onClick={() => signOut()}
            className="w-full text-lg font-medium text-gray-800 py-3 px-4 border-b border-gray-400 hover:bg-primary/10 focus:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          >
            Logout
          </button>
        </SignedIn>
        <SignedOut>
          <Link
            href="/sign-in"
            className="text-right block w-full text-lg  font-medium text-gray-800 py-3 px-4 border-b border-gray-400 hover:bg-primary/10 focus:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          >
            Login
          </Link>
        </SignedOut>
      </div>
    </div>
  );
};

export default MenuItems;
