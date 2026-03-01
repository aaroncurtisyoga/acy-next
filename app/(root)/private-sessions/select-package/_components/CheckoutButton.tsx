"use client";

import { FC } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import CheckoutButtonSkeleton from "@/app/(root)/private-sessions/select-package/_components/CheckoutButtonSkeleton";
import { track } from "@vercel/analytics";

const CheckoutButton: FC = () => {
  const { isLoaded: isUserLoaded } = useUser();

  if (!isUserLoaded) {
    return <CheckoutButtonSkeleton />;
  }

  return (
    <div className={"w-full max-w-[440px] mx-auto"}>
      <SignedOut>
        <SignInButton>
          <Button
            type="button"
            className="w-full font-medium rounded-lg"
            onClick={() => {
              track("private_sessions", {
                action: "sign_in_to_purchase_click",
                step: "select_package",
              });
            }}
          >
            Sign In to Purchase
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <Button
          type="submit"
          className="w-full text-base font-medium rounded-lg"
          onClick={() => {
            track("private_sessions", {
              action: "purchase_click",
              step: "select_package",
            });
          }}
        >
          Purchase
        </Button>
      </SignedIn>
    </div>
  );
};

export default CheckoutButton;
