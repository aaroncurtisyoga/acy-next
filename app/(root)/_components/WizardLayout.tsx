"use client";

import React, { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";
import { ProgressStepper } from "@/app/(root)/private-sessions/select-package/_components/ProgressStepper";

const pathToStepMap = {
  "/private-sessions/welcome": 1,
  "/private-sessions/select-package": 2,
  "/private-sessions/checkout": 3,
  "/private-sessions/confirmation": 4,
};

interface WizardLayoutProps {
  children: ReactNode;
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { currentStep, totalSteps, goToStep } = useWizardForm();

  useEffect(() => {
    // Update current step based on the current path
    const stepFromPath =
      pathToStepMap[pathname as keyof typeof pathToStepMap] || 2;
    if (stepFromPath !== currentStep) {
      goToStep(stepFromPath);
    }
  }, [pathname, currentStep, goToStep]);

  return (
    <>
      <ProgressStepper currentStep={currentStep} totalSteps={totalSteps} />
      {children}
    </>
  );
};
