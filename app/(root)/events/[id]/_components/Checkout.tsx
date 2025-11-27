"use client";

import { FC } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@heroui/button";
import { Event } from "@prisma/client";
import CheckoutButton from "@/app/(root)/events/[id]/_components/CheckoutButton";
import CheckoutSkeleton from "@/app/(root)/events/[id]/_components/CheckoutSkeleton";

interface ICheckoutButtonProps {
  event: Event;
  className?: string;
}

const Checkout: FC<ICheckoutButtonProps> = ({ event }) => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const hasEventFinished = new Date(event.endDateTime) < new Date();

  if (hasEventFinished) {
    return <p>Sorry, tickets are no longer available.</p>;
  }

  if (!isUserLoaded) {
    return <CheckoutSkeleton />;
  }

  return (
    <div
      id={"event-checkout"}
      className={
        "flex-1 w-full border-t-2 h-[140px] p-[24px] bg-white" +
        " md:border-[1px] md:rounded-2xl" +
        " md:max-w-[360px]"
      }
    >
      <p className={"text-center text-lg mb-3"}>
        {event.isFree ? "Free" : `$${event.price}`}
      </p>
      {event.isExternal && event.externalUrl ? (
        <Button
          as="a"
          href={event.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          fullWidth={true}
          color={"primary"}
        >
          Register at Bright Bear
        </Button>
      ) : (
        <>
          <SignedOut>
            <SignInButton>
              <Button type="button" fullWidth={true} color={"primary"}>
                Sign In to Purchase
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <CheckoutButton event={event} userId={userId} />
          </SignedIn>
        </>
      )}
    </div>
  );
};

export default Checkout;
