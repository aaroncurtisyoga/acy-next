"use client";

import React, { FC } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useUser,
  useAuth,
} from "@clerk/nextjs";
import { Event } from "@prisma/client";
import { Button } from "@nextui-org/react";
import Checkout from "@/app/(root)/events/[id]/_components/Checkout";
import SkeletonButton from "@/app/(root)/events/[id]/_components/SkeletonButton";

interface ICheckoutButtonProps {
  event: Event;
  className?: string;
}

const CheckoutButton: FC<ICheckoutButtonProps> = ({ event }) => {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const { isLoaded } = useAuth();
  const hasEventFinished = new Date(event.endDateTime) < new Date();

  if (hasEventFinished) {
    return <p>Sorry, tickets are no longer available.</p>;
  }

  if (!isLoaded) {
    return <SkeletonButton />;
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
        <Checkout event={event} userId={userId} />
      </SignedIn>
    </>
  );
};

export default CheckoutButton;
