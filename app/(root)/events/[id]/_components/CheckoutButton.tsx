"use client";

import Link from "next/link";
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
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const hasEventFinished = new Date(event.endDateTime) < new Date();

  return (
    <div>
      {hasEventFinished ? (
        <p>Sorry, tickets are no longer available.</p>
      ) : (
        <>
          <SignedOut>
            <Button type="button" fullWidth={true} color={"primary"}>
              <Link href="/sign-in">Sign Up</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Checkout event={event} userId={userId} />
          </SignedIn>
        </>
      )}
    </div>
  );
};

export default CheckoutButton;
