"use client";

import React, { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ProgressStepper } from "@/app/(root)/private-sessions/(select-package)/_components/ProgressStepper";
import { useWizardForm } from "@/app/(root)/private-sessions/_context/FormContext";

const pathToStepMap = {
  "/private-sessions/welcome": 1,
  "/private-sessions/auth": 2,
  "/private-sessions/select-package": 3,
  "/private-sessions/payment": 4,
  "/private-sessions/confirmation": 4,
};

interface WizardLayoutProps {
  children: ReactNode;
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { goToStep } = useWizardForm();

  useEffect(() => {
    // Update current step based on the current path
    const currentStep = pathToStepMap[pathname] || 1;
    goToStep(currentStep);
  }, [pathname, goToStep]);

  return (
    <>
      <ProgressStepper />
      {children}
    </>
  );
};
