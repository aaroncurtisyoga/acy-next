"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import HeaderMenuItems from "@/_components/HeaderMenuItems";
import { adminLinks, authenticatedLinks, userLinks } from "@/_lib/constants";

const MobileNavigation = () => {
  const { signOut } = useClerk();
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
      <HeaderMenuItems
        pathname={pathname}
        menuItems={menuItems}
        isMenu={true}
      />
      <SignedIn>
        <button
          type="button"
          onClick={() => signOut()}
          className="w-full text-lg font-medium text-gray-800"
        >
          Logout
        </button>
      </SignedIn>
      <SignedOut>
        <Link
          href="/sign-in"
          className="block w-full text-lg font-medium text-gray-800"
        >
          Login
        </Link>
      </SignedOut>
    </>
  );
};

export default MobileNavigation;
