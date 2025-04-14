"use client";

import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignIn, useAuth } from "@clerk/nextjs";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";

const WelcomePage: FC = () => {
  const router = useRouter();
  const { goToNextStep } = useWizardForm();
  const { isSignedIn, isLoaded } = useAuth();

  // Handle redirects after authentication
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      goToNextStep();
      router.push("/private-sessions/select-package");
    }
  }, [isSignedIn, isLoaded, goToNextStep, router]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-10">
        <p className="text-lg mb-6 max-w-[300px] mx-auto">
          Sign in or create an account to book your private yoga sessions.
        </p>
      </div>

      {/* Embedded Clerk SignIn component */}
      {/* Todo: fix styles here so that no shadow... no border line */}
      <SignIn
        routing="path"
        path="/private-sessions/welcome"
        signUpUrl="/private-sessions/welcome"
        // Falls back to this page, then handle redirect via useEffect
        fallbackRedirectUrl="/private-sessions/welcome"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "w-full shadow-none p-0",
          },
        }}
      />
    </div>
  );
};

export default WelcomePage;
