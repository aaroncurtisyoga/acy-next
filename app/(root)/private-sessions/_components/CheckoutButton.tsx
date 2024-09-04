"use client";

import React, { FC } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import CheckoutButtonSkeleton from "@/app/(root)/private-sessions/_components/CheckoutButtonSkeleton";

const CheckoutButton: FC = () => {
  const { user, isLoaded: isUserLoaded } = useUser();

  if (!isUserLoaded) {
    return <CheckoutButtonSkeleton />;
  }

  return (
    <>
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
          className={"text-base mt-4"}
          fullWidth={true}
          onPress={() => {
            console.log("Purchase button clicked");
          }}
          color={"primary"}
        >
          Purchase
        </Button>
      </SignedIn>
    </>
  );
};

export default CheckoutButton;
