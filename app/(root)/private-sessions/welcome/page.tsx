"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Check } from "lucide-react";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";
import { ProgressStepper } from "@/app/(root)/private-sessions/select-package/_components/ProgressStepper";

const WelcomePage: React.FC = () => {
  const { goToNextStep } = useWizardForm();
  const router = useRouter();

  const handleGetStarted = () => {
    goToNextStep();
    router.push("/private-sessions/sign-in");
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Stepper - Centered to match content */}
      <div className="mt-[60px] mb-6 text-center">
        <ProgressStepper currentStep={1} totalSteps={4} />
      </div>

      {/* Step Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-[32px] font-medium text-gray-900">
          Choose your
          <br />
          private yoga training.
        </h1>
      </div>

      {/* Benefits List */}
      <div className="mb-12">
        <div className="flex flex-col items-center justify-center gap-8 max-w-md mx-auto">
          <div className="flex flex-col gap-4 w-full items-center">
            <div className="flex items-center justify-start gap-3 w-full max-w-[280px]">
              <div className="w-7 h-7 rounded-full bg-white border-2 border-primary flex items-center justify-center transition-all duration-200 shadow-sm">
                <Check size={16} className="text-primary" />
              </div>
              <span className="text-gray-700">Custom programming</span>
            </div>
            <div className="flex items-center justify-start gap-3 w-full max-w-[280px]">
              <div className="w-7 h-7 rounded-full bg-white border-2 border-primary flex items-center justify-center transition-all duration-200 shadow-sm">
                <Check size={16} className="text-primary" />
              </div>
              <span className="text-gray-700">Flexible scheduling</span>
            </div>
            <div className="flex items-center justify-start gap-3 w-full max-w-[280px]">
              <div className="w-7 h-7 rounded-full bg-white border-2 border-primary flex items-center justify-center transition-all duration-200 shadow-sm">
                <Check size={16} className="text-primary" />
              </div>
              <span className="text-gray-700">Expert guidance</span>
            </div>
          </div>
          <Button
            color="primary"
            size="lg"
            className="w-full max-w-[340px] font-medium [&:hover]:bg-[#2d4a9e] [&:hover]:text-white transition-colors"
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
