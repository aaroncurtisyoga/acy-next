"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SignIn, useAuth, useUser, SignOutButton } from "@clerk/nextjs";
import { Button } from "@heroui/react";
import { User } from "lucide-react";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";
import { StepIndicator } from "@/app/(root)/private-sessions/select-package/_components/StepIndicator";

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
        {/* Step indicator */}
        <div className="mt-[60px] mb-6 text-center">
          <StepIndicator currentStep={2} totalSteps={4} />
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">
            Welcome back!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Continue as <strong>{user.emailAddresses[0]?.emailAddress}</strong>
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <Button
              color="primary"
              size="lg"
              className="w-full max-w-[340px] font-medium bg-primary text-white [&:hover]:bg-[#1a5bb8] [&:hover]:text-white transition-colors rounded-lg"
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
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline underline-offset-2 transition-colors duration-200 rounded-lg"
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
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-2xl md:text-[32px] font-medium text-gray-900 dark:text-gray-100 mb-2 mt-[60px]">
        Sign in to book
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Please sign in to continue with your private session booking
      </p>

      <SignIn
        routing="hash"
        signUpUrl="/private-sessions/sign-in"
        fallbackRedirectUrl="/private-sessions/select-package"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-none border-none p-0 dark:bg-transparent",
            cardBox: "shadow-none border-none bg-transparent",
            card__main: "shadow-none border-none mx-auto",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            formFieldLabel:
              "text-gray-700 dark:text-gray-300 text-sm font-medium",
            formButtonPrimary:
              "w-full max-w-[440px] font-medium bg-primary hover:bg-[#1a5bb8] text-white transition-colors duration-200 border-none shadow-none rounded-lg py-3 px-4 text-base",
            footer: "bg-white dark:bg-transparent",
            footerAction: "bg-white dark:bg-transparent",
            form: "shadow-none border-none",
            formContainer: "shadow-none border-none",
            formFieldInput:
              "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md dark:text-white",
            formFieldAction__password: "shadow-none",
            formFieldLabelRow: "font-medium",
            formResendCodeLink: "text-primary-600 dark:text-primary-400",
            footerActionLink: "text-primary-600 dark:text-primary-400",
            identityPreview: "border-none shadow-none",
            identityPreviewText: "font-normal dark:text-gray-300",
            identityPreviewEditButton: "text-primary-600 dark:text-primary-400",
            otpCodeFieldInput:
              "shadow-none dark:bg-gray-900 dark:border-gray-700 dark:text-white",
            socialButtonsBlockButton:
              "w-full max-w-[440px] border border-gray-300 dark:border-gray-700 rounded-md font-medium py-3 px-4 text-base hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 dark:bg-gray-900",
            socialButtonsBlockButtonArrow: "hidden",
            socialButtonsBlockButtonText:
              "w-full text-center text-gray-700 dark:text-gray-300",
          },
        }}
      />
    </div>
  );
};

export default SignInPage;
