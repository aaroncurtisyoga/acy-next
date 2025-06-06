"use client";

import { FC, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { WizardFormProvider } from "@/app/(root)/private-sessions/_lib/_context/FormContext";
import { ProgressStepper } from "@/app/(root)/private-sessions/select-package/_components/ProgressStepper";

interface PrivateSessionsLayoutProps {
  children: ReactNode;
}

const PrivateSessionsLayout: FC<PrivateSessionsLayoutProps> = ({
  children,
}) => {
  const pathname = usePathname();

  // Determine current step based on the URL path
  const getCurrentStep = () => {
    if (pathname?.includes("/welcome")) return 1;
    if (pathname?.includes("/select-package")) return 2;
    if (pathname?.includes("/checkout")) return 3;
    if (pathname?.includes("/confirmation")) return 4;
    return 2; // Default to step 2 (package selection)
  };

  const currentStep = getCurrentStep();

  return (
    <WizardFormProvider>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 tracking-tight text-primary-500 text-center">
          Train With Me
        </h1>
        <ProgressStepper currentStep={currentStep} totalSteps={4} />
        {children}
      </div>
    </WizardFormProvider>
  );
};

export default PrivateSessionsLayout;
