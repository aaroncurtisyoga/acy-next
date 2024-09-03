import React, { FC } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Event } from "@prisma/client";
import Checkout from "@/app/(root)/events/[id]/_components/Checkout";
import { Button } from "@nextui-org/react";

interface ICheckoutButtonProps {
  event: Event;
  className?: string;
}

const CheckoutButton: FC<ICheckoutButtonProps> = ({ event }) => {
  const hasEventFinished = new Date(event.endDateTime) < new Date();

  if (hasEventFinished) {
    return <p>Sorry, tickets are no longer available.</p>;
  }

  return (
    <>
      <SignedOut>
        <SignInButton>
          <Button type="button" fullWidth={true} color={"primary"}>
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <Checkout event={event} />
      </SignedIn>
    </>
  );
};

export default CheckoutButton;
