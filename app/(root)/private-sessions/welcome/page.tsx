"use client";

import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignIn, useAuth, useUser } from "@clerk/nextjs";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";

const WelcomePage: FC = () => {
  const router = useRouter();
  const { goToNextStep } = useWizardForm();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

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
          {isSignedIn
            ? "Welcome back! Continue to book your session."
            : "Please sign in to book your private yoga sessions."}
        </p>
      </div>

      {/* Embedded Clerk SignIn component with custom appearance */}
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
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            formFieldLabel: "text-gray-700 text-sm font-medium",
            formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
            // Update subtitle text based on authentication state
            headerSubtitleText: isSignedIn
              ? `Continue as ${user?.primaryEmailAddress?.emailAddress}`
              : "Please log in to get started",
            // Handle the footer action text for switching accounts
            footerActionText: isSignedIn
              ? "Switch to a different account"
              : undefined,
          },
          layout: {
            // You can also customize layout properties
            logoPlacement: "inside",
            socialButtonsVariant: "iconButton",
          },
        }}
      />
    </div>
  );
};

export default WelcomePage;
