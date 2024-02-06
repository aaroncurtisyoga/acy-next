"use client";

import Link from "next/link";
import React from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
// import Checkout from './Checkout'
// import { IEvent } from '@/lib/database/models/event.model'
import { Button } from "../ui/button";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import Checkout from "@/components/events/Checkout";
import { cn } from "@/lib/utils";

const CheckoutButton = ({
  event,
  className,
}: {
  event: IEvent;
  className?: string;
}) => {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const hasEventFinished = new Date(event.endDateTime) < new Date();

  return (
    <div className={cn("flex items-center", className)}>
      {hasEventFinished ? (
        <p className="p-2 text-red-400">
          Sorry, tickets are no longer available.
        </p>
      ) : (
        <>
          <SignedOut>
            <Button asChild className="w-full md:w-auto " size="lg">
              <Link href="/sign-in">Get Ticket</Link>
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
