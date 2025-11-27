"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Check } from "lucide-react";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";
import { StepIndicator } from "@/app/(root)/private-sessions/select-package/_components/StepIndicator";

const WelcomePage: React.FC = () => {
  const { goToNextStep } = useWizardForm();
  const router = useRouter();

  const handleGetStarted = () => {
    goToNextStep();
    router.push("/private-sessions/sign-in");
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="mt-[60px] mb-6 text-center">
        <StepIndicator currentStep={1} totalSteps={4} />
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-[32px] font-medium text-gray-900 dark:text-gray-100">
          Choose your
          <br />
          private yoga training.
        </h1>
      </div>

      {/* Benefits */}
      <div className="mb-12">
        <div className="flex flex-col items-center justify-center gap-8 max-w-md mx-auto">
          <div className="flex flex-col gap-4 w-full items-center">
            <div className="flex items-center justify-start gap-3 w-full max-w-[280px]">
              <Check size={20} className="text-primary flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300 md:text-lg">
                Custom programming
              </span>
            </div>
            <div className="flex items-center justify-start gap-3 w-full max-w-[280px]">
              <Check size={20} className="text-primary flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300 md:text-lg">
                Flexible scheduling
              </span>
            </div>
            <div className="flex items-center justify-start gap-3 w-full max-w-[280px]">
              <Check size={20} className="text-primary flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300 md:text-lg">
                Expert guidance
              </span>
            </div>
          </div>
          <Button
            color="primary"
            size="lg"
            className="w-full max-w-[340px] font-medium [&:hover]:bg-[#1a5bb8] [&:hover]:text-white transition-colors rounded-lg"
            onPress={handleGetStarted}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
