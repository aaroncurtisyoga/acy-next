"use client";

import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignIn, useUser } from "@clerk/nextjs";
import { ProgressStepper } from "@/app/(root)/private-sessions/(select-package)/_components/ProgressStepper";
import { useWizardForm } from "@/app/(root)/private-sessions/_context/FormContext";

const AuthPage: FC = () => {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const { currentStep } = useWizardForm();

  // Redirect if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/private-sessions/select-package");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="max-w-3xl mx-auto px-4">
      <ProgressStepper currentStep={2} totalSteps={4} />

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 tracking-tight text-primary-500">
          Sign In to Your Account
        </h1>

        <p className="text-gray-600 max-w-xl mx-auto">
          Sign in to your existing account or create a new one to continue with
          your private session booking.
        </p>
      </div>

      <div className="flex justify-center">
        <SignIn
          routing="path"
          path="/sign-in"
          afterSignInUrl="/private-sessions/select-package"
          afterSignUpUrl="/private-sessions/select-package"
        />
      </div>
    </div>
  );
};

export default AuthPage;
