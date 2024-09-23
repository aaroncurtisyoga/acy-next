"use client";

import React, { FC, FormEvent } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import { OrderType } from "@prisma/client";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutButtonSkeleton from "@/app/(root)/private-sessions/(select-package)/_components/CheckoutButtonSkeleton";

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutButton: FC = () => {
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
          type={"submit"}
          radius={"sm"}
          className={"text-base"}
          fullWidth={true}
          color={"primary"}
        >
          Purchase
        </Button>
      </SignedIn>
    </div>
  );
};

export default CheckoutButton;
