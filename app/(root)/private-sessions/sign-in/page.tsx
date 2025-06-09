"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignIn, useAuth, useUser, SignOutButton } from "@clerk/nextjs";
import { Button } from "@heroui/react";
import { ArrowRight, User } from "lucide-react";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";

const SignInPage: React.FC = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { goToNextStep } = useWizardForm();
  const router = useRouter();

  const handleContinue = () => {
    goToNextStep();
    router.push("/private-sessions/select-package");
  };

  if (isSignedIn && user) {
    return (
      <div className="max-w-md mx-auto p-6 mt-[60px]">
        <div className="text-center mb-8">
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-600">
              STEP <b>2</b> OF <b>4</b>
            </span>
          </div>
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Welcome back!</h2>
          <p className="text-gray-600 mb-6">
            Continue as <strong>{user.emailAddresses[0]?.emailAddress}</strong>
          </p>
        </div>

        <div className="space-y-4">
          <Button
            color="primary"
            size="lg"
            fullWidth
            onPress={handleContinue}
            className="group"
            endContent={
              <ArrowRight
                size={18}
                className="transition-transform duration-300 ease-out group-hover:translate-x-1"
              />
            }
          >
            Continue
          </Button>

          <div className="text-center">
            <SignOutButton redirectUrl="/private-sessions/sign-in">
              <Button
                variant="light"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                Sign in with a different account
              </Button>
            </SignOutButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-[60px]">
      <div className="text-center mb-8">
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-600">
            STEP <b>2</b> OF <b>4</b>
          </span>
        </div>
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
