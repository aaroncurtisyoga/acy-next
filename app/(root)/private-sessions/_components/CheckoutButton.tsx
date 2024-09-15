"use client";

import React, { FC } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import CheckoutButtonSkeleton from "@/app/(root)/private-sessions/_components/CheckoutButtonSkeleton";

interface CheckoutButtonProps {
  selectedPackage: String | null;
}

const CheckoutButton: FC<CheckoutButtonProps> = ({ selectedPackage }) => {
  // selecktedPackage is going to be a string... so i'll need to use that
  // string to find the whole object in the offerings array
  const { user, isLoaded: isUserLoaded } = useUser();

  if (!isUserLoaded) {
    return <CheckoutButtonSkeleton />;
  }

  return (
    <div className={"w-full max-w-[440px] mx-auto mt-1 mb-40"}>
      <SignedOut>
        <SignInButton>
          <Button type="button" fullWidth={true} color={"primary"}>
            Sign In to Purchase
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <Button
          radius={"sm"}
          className={"text-base"}
          fullWidth={true}
          onPress={() => {
            console.log("Purchase button clicked");
          }}
          color={"primary"}
        >
          Purchase
        </Button>
      </SignedIn>
    </div>
  );
};

export default CheckoutButton;
