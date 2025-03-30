"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { ProgressStepper } from "../_components/ProgressStepper";
import { useWizardForm } from "../_context/FormContext";

const WelcomePage: FC = () => {
  const router = useRouter();
  const { goToNextStep } = useWizardForm();

  const handleContinue = () => {
    goToNextStep();
    router.push("/private-sessions/auth");
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <ProgressStepper currentStep={1} totalSteps={4} />

      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-4xl font-bold mb-6 tracking-tight text-primary-500">
          Train With Me
        </h1>

        <p className="text-lg mb-6">
          Create or sign up your account to start purchasing private yoga
          sessions.
        </p>

        <p className="text-gray-600 mb-8">
          Private sessions allow me to connect with you on a personal level,
          focusing on your unique needs. Whether we're working on specific
          postures, meditation, improving movement, or mentoring for teaching,
          my goal is to share everything I've learned to help you achieve your
          goals.
        </p>
      </div>

      <div className="border-t border-b py-8 my-8">
        <h2 className="text-xl font-semibold text-center mb-6">
          What to expect:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-500 font-semibold">1</span>
            </div>
            <h3 className="font-medium mb-2">Create Account</h3>
            <p className="text-sm text-gray-600">
              Sign up or sign in to your account
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-500 font-semibold">2</span>
            </div>
            <h3 className="font-medium mb-2">Select Package</h3>
            <p className="text-sm text-gray-600">
              Choose the session that fits your needs
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-500 font-semibold">3</span>
            </div>
            <h3 className="font-medium mb-2">Complete Payment</h3>
            <p className="text-sm text-gray-600">
              Secure checkout with instant confirmation
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[440px] mx-auto mt-10 mb-16">
        <Button
          type="button"
          radius="sm"
          className="text-base"
          fullWidth={true}
          color="primary"
          onClick={handleContinue}
        >
          Continue to Sign In
        </Button>
      </div>
    </div>
  );
};

export default WelcomePage;
