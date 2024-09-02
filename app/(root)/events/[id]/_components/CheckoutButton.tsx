"use client";

import { useRouter } from "next/navigation";
import React, { FC } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Event } from "@prisma/client";
import Checkout from "@/app/(root)/events/[id]/_components/Checkout";
import { Button } from "@nextui-org/react";

interface ICheckoutButtonProps {
  event: Event;
  className?: string;
}

const CheckoutButton: FC<ICheckoutButtonProps> = ({ event }) => {
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const hasEventFinished = new Date(event.endDateTime) < new Date();

  if (hasEventFinished) {
    return <p>Sorry, tickets are no longer available.</p>;
  }

  return (
    <>
      <SignedOut>
        <Button
          type="button"
          fullWidth={true}
          color={"primary"}
          onPress={() => {
            // After sign in, redirect to the checkout page
            router.push("/sign-in");
          }}
        >
          Sign Up
        </Button>
      </SignedOut>

      <SignedIn>
        <Checkout event={event} userId={userId} />
      </SignedIn>
    </>
  );
};

export default CheckoutButton;
