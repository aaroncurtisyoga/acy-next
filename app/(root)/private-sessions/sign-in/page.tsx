"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SignIn, useAuth, useUser, SignOutButton } from "@clerk/nextjs";
import { Button } from "@heroui/react";
import { User } from "lucide-react";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";
import { ProgressStepper } from "@/app/(root)/private-sessions/select-package/_components/ProgressStepper";

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
      <div className="max-w-md mx-auto">
        {/* Progress Stepper - Centered to match content */}
        <div className="mt-[60px] mb-6 text-center">
          <ProgressStepper currentStep={2} totalSteps={4} />
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Welcome back!</h2>
          <p className="text-gray-600 mb-6">
            Continue as <strong>{user.emailAddresses[0]?.emailAddress}</strong>
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <Button
              color="primary"
              size="lg"
              className="w-full max-w-[340px] font-medium [&:hover]:bg-[#2d4a9e] [&:hover]:text-white transition-colors rounded-lg"
              onPress={handleContinue}
            >
              Continue
            </Button>
          </div>

          <div className="text-center">
            <SignOutButton redirectUrl="/private-sessions/sign-in">
              <Button
                variant="light"
                size="sm"
                className="text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors duration-200 rounded-lg"
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
    <div className="max-w-md mx-auto">
      {/* Progress Stepper - Centered to match content */}
      <div className="mt-[60px] mb-6 text-center">
        <ProgressStepper currentStep={2} totalSteps={4} />
      </div>

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
            formButtonPrimary:
              "w-full max-w-[440px] font-medium bg-primary hover:bg-[#2d4a9e] text-white transition-colors duration-200 border-none shadow-none rounded-lg py-3 px-4 text-base",
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
              "w-full max-w-[440px] border border-gray-300 rounded-md font-medium py-3 px-4 text-base hover:bg-gray-50 transition-colors duration-200",
            socialButtonsBlockButtonArrow: "hidden",
            socialButtonsBlockButtonText: "w-full text-center text-gray-700",
          },
        }}
      />
    </div>
  );
};

export default SignInPage;
