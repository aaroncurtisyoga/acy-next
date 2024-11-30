"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import HeaderMenuItems from "@/_components/HeaderMenuItems";
import { adminLinks, authenticatedLinks, userLinks } from "@/_lib/constants";

const DesktopNavigation = () => {
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
        isMenu={false}
      />
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in">Login</Link>
      </SignedOut>
    </>
  );
};

export default DesktopNavigation;
