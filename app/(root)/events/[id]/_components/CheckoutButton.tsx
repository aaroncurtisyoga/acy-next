"use client";

import React, { FC } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Event } from "@prisma/client";
import { Button } from "@nextui-org/react";
import Checkout from "@/app/(root)/events/[id]/_components/Checkout";
import SkeletonButton from "@/app/(root)/events/[id]/_components/SkeletonButton";

interface ICheckoutButtonProps {
  event: Event;
  className?: string;
}

const CheckoutButton: FC<ICheckoutButtonProps> = ({ event }) => {
  const { user, isLoaded } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const hasEventFinished = new Date(event.endDateTime) < new Date();

  if (hasEventFinished) {
    return <p>Sorry, tickets are no longer available.</p>;
  }

  if (!isLoaded) {
    return <SkeletonButton />;
  }

  return (
    <div
      id={"event-checkout"}
      className={
        "flex-1 w-full border-t-2 h-[140px] p-[24px] fixed bottom-0 z-10 bg-white" +
        " md:border-[1px] md:rounded-2xl md:relative" +
        " md:max-w-[360px]"
      }
    >
      <p className={"text-center text-lg mb-3"}>
        {event.isFree ? "Free" : `$${event.price}`}
      </p>
      <SignedOut>
        <SignInButton>
          <Button type="button" fullWidth={true} color={"primary"}>
            Sign In to Purchase
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <Checkout event={event} userId={userId} />
      </SignedIn>
    </div>
  );
};

export default CheckoutButton;
