"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { CheckCircle } from "lucide-react";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";

const WelcomePage: React.FC = () => {
  const { goToNextStep } = useWizardForm();
  const router = useRouter();

  const handleGetStarted = () => {
    goToNextStep();
    router.push("/private-sessions/sign-in");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-[60px]">
      {/* Step Header */}
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-[32px] font-medium text-gray-900">
          Choose your
          <br />
          private yoga training.
        </h1>
      </div>

      {/* Benefits List */}
      <div className="mb-12">
        <div className="flex flex-col items-center justify-center gap-6 max-w-md mx-auto">
          <div className="flex flex-col gap-4 w-full items-center">
            <div className="flex items-center justify-start gap-3 w-full max-w-[280px]">
              <CheckCircle className="w-6 h-6 text-primary-500 flex-shrink-0" />
              <span className="text-gray-700">
                Personalized 1-on-1 training
              </span>
            </div>
            <div className="flex items-center justify-start gap-3 w-full max-w-[280px]">
              <CheckCircle className="w-6 h-6 text-primary-500 flex-shrink-0" />
              <span className="text-gray-700">Flexible scheduling</span>
            </div>
            <div className="flex items-center justify-start gap-3 w-full max-w-[280px]">
              <CheckCircle className="w-6 h-6 text-primary-500 flex-shrink-0" />
              <span className="text-gray-700">Expert guidance</span>
            </div>
          </div>
          <Button
            color="primary"
            size="lg"
            className="w-full max-w-[320px] font-medium [&:hover]:bg-[#2d4a9e] [&:hover]:text-white transition-colors"
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
