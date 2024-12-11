"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";

const AuthButtons = () => {
  const router = useRouter();
  const { signOut } = useClerk();

  return (
    <>
      <SignedIn>
        <button
          type="button"
          onClick={() => signOut(() => router.push("/"))}
          className="w-full text-lg font-medium text-gray-800 text-right"
        >
          Log out
        </button>
      </SignedIn>
      <SignedOut>
        <Link
          href={"/sign-in"}
          className="block w-full text-lg font-medium text-gray-800"
        >
          Log in
        </Link>
      </SignedOut>
    </>
  );
};

export default AuthButtons;
