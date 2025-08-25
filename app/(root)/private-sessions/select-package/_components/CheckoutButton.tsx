"use client";

import React, { FC } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@heroui/react";
import CheckoutButtonSkeleton from "@/app/(root)/private-sessions/select-package/_components/CheckoutButtonSkeleton";

const CheckoutButton: FC = () => {
  const { isLoaded: isUserLoaded } = useUser();

  if (!isUserLoaded) {
    return <CheckoutButtonSkeleton />;
  }

  return (
    <div className={"w-full max-w-[440px] mx-auto"}>
      <SignedOut>
        <SignInButton>
          <Button
            type="button"
            fullWidth={true}
            color="primary"
            className="font-medium [&:hover]:bg-[#1a5bb8] [&:hover]:text-white transition-colors rounded-lg"
          >
            Sign In to Purchase
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <Button
          type="submit"
          radius="sm"
          className="text-base font-medium [&:hover]:bg-[#1a5bb8] [&:hover]:text-white transition-colors rounded-lg"
          fullWidth={true}
          color="primary"
        >
          Purchase
        </Button>
      </SignedIn>
    </div>
  );
};

export default CheckoutButton;
