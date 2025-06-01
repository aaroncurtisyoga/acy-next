"use client";

import { FC } from "react";
import { SignIn } from "@clerk/nextjs";

const WelcomePage: FC = () => {
  return (
    <div className="max-w-3xl mx-auto flex justify-center items-center flex-col px-4">
      <div className="text-center max-w-xl mx-auto mb-10">
        <p className="text-lg mb-6 max-w-[300px] mx-auto">
          Please sign in to book your private yoga sessions.
        </p>
      </div>

      {/* Clerk SignIn component with custom appearance */}
      <SignIn
        routing="hash"
        signUpUrl="/private-sessions/welcome"
        fallbackRedirectUrl="/private-sessions/select-package"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-none border-none p-0",
            cardBox: "shadow-none border-none bg-transparent",
            card__main: "shadow-none border-none mx-auto",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            formFieldLabel: "text-gray-700 text-sm font-medium",
            formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
            headerSubtitleText: "Please log in to get started",
            footer: "bg-white",
            footerAction: "bg-white",
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
            socialButtonsBlockButton: "w-full",
            socialButtonsBlockButtonArrow: "hidden",
            socialButtonsBlockButtonText: "w-full text-center",
          },
          layout: {
            showOptionalFields: false,
            shimmer: false,
            logoPlacement: "none",
          },
          variables: {
            borderRadius: "0.25rem",
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
