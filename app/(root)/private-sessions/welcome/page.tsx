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
    <div className="max-w-3xl mx-auto flex justify-center items-center flex-col">
      <div className="text-center max-w-xl mx-auto mb-10">
        <p className="text-lg mb-6 max-w-[300px] mx-auto">
          {isSignedIn
            ? "Welcome back! Continue to book your session."
            : "Please sign in to book your private yoga sessions."}
        </p>
      </div>

      {/* Clerk SignIn component with custom appearance */}
      <SignIn
        routing="path"
        path="/private-sessions/welcome"
        signUpUrl="/private-sessions/welcome"
        // Falls back to this page, then handle redirect via useEffect
        fallbackRedirectUrl="/private-sessions/welcome"
        appearance={{
          elements: {
            rootBox: "w-full max-w-md mx-auto",
            card: "w-full shadow-none border-none p-0",
            cardBox: "w-full shadow-none border-none bg-transparent",
            card__main: "shadow-none border-none",
            headerTitle: "hidden", // Hide the default "Sign in to Aaron Curtis Yoga" title
            headerSubtitle: "hidden", // Hide the default "Welcome back! Please sign in to continue" subtitle
            formFieldLabel: "text-gray-700 text-sm font-medium",
            formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
            // Update subtitle text based on authentication state
            headerSubtitleText: isSignedIn
              ? `Continue as ${user?.primaryEmailAddress?.emailAddress}`
              : "Please log in to get started",
            // Handle the footer action text for switching accounts
            footer: "bg-white",
            footerAction: "bg-white",
            footerActionText: isSignedIn
              ? "Switch to a different account"
              : undefined,
            form: "shadow-none border-none",
            formContainer: "shadow-none border-none",
            formFieldInput: "bg-white border border-gray-300",
            formFieldAction__password: "shadow-none",
            formFieldLabelRow: "font-medium",
            formResendCodeLink: "text-indigo-600",
            footerActionLink: "text-indigo-600",
            identityPreview: "border-none shadow-none",
            identityPreviewText: "font-normal",
            identityPreviewEditButton: "text-indigo-600",
            otpCodeFieldInput: "shadow-none",
          },
          layout: {
            showOptionalFields: false,
            shimmer: false,
            logoPlacement: "none", // Removes the logo entirely
          },
          variables: {
            borderRadius: "0.25rem",
            // Making the component blend with  background
            colorBackground: "transparent",
            colorInputBackground: "white",
            colorShimmer: "transparent",
          },
        }}
      />
    </div>
  );
};

export default WelcomePage;
