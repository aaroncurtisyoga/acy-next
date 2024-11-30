"use client";

import Link from "next/link";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import HeaderMenuItems from "@/_components/HeaderMenuItems";

const Navigation = () => {
  const { signOut } = useClerk();

  return (
    <>
      <HeaderMenuItems isMenu={true} />
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

export default Navigation;
