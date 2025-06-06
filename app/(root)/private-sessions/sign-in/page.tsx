"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignIn, useAuth } from "@clerk/nextjs";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";

const SignInPage: React.FC = () => {
  const { isSignedIn } = useAuth();
  const { goToNextStep } = useWizardForm();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      goToNextStep();
      router.push("/private-sessions/select-package");
    }
  }, [isSignedIn, goToNextStep, router]);

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Sign In to Continue</h2>
        <p className="text-gray-600">
          Please sign in to book your private yoga sessions with Aaron.
        </p>
      </div>

      <SignIn
        routing="hash"
        signUpUrl="/private-sessions/sign-in"
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
            formButtonPrimary: "bg-primary-600 hover:bg-primary-700",
            footer: "bg-white",
            footerAction: "bg-white",
            form: "shadow-none border-none",
            formContainer: "shadow-none border-none",
            formFieldInput: "bg-white border border-gray-300 rounded-md",
            formFieldAction__password: "shadow-none",
            formFieldLabelRow: "font-medium",
            formResendCodeLink: "text-primary-600",
            footerActionLink: "text-primary-600",
            identityPreview: "border-none shadow-none",
            identityPreviewText: "font-normal",
            identityPreviewEditButton: "text-primary-600",
            otpCodeFieldInput: "shadow-none",
            socialButtonsBlockButton:
              "w-full border border-gray-300 rounded-md",
            socialButtonsBlockButtonArrow: "hidden",
            socialButtonsBlockButtonText: "w-full text-center",
          },
        }}
      />
    </div>
  );
};

export default SignInPage;
