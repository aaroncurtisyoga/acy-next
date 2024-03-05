"use client";

import Link from "next/link";
import React from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Checkout from "@/components/events/EventPage/Checkout";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import { Button } from "@nextui-org/react";

const CheckoutButton = ({ event }: { event: IEvent; className?: string }) => {
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
            <Button type="button">
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
