"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import HeaderMenuItems from "@/_components/HeaderMenuItems";

const DesktopNavigation = () => {
  return (
    <>
      <HeaderMenuItems isMenu={false} />
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
