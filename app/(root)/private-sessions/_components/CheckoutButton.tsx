"use client";

import React, { FC, FormEvent } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import CheckoutButtonSkeleton from "@/app/(root)/private-sessions/_components/CheckoutButtonSkeleton";
import { OrderType } from "@prisma/client";
import { loadStripe } from "@stripe/stripe-js";

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutButton: FC = () => {
  const { user, isLoaded: isUserLoaded } = useUser();

  const onCheckout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const order = {
      buyerId: user.publicMetadata.userId as string,
      // name: 'placeholder'
      type: OrderType.PRIVATE_SESSION,
    };
  };

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
