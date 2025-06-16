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

  // Determine current step based on the URL path (4-step flow)
  const getCurrentStep = () => {
    if (pathname?.includes("/welcome")) return 1;
    if (pathname?.includes("/sign-in")) return 2;
    if (pathname?.includes("/select-package")) return 3;
    if (pathname?.includes("/checkout")) return 4;
    if (pathname?.includes("/confirmation")) return 4; // Confirmation shows step 4 completed
    return 1; // Default to step 1 (welcome)
  };

  const currentStep = getCurrentStep();

  // Show stepper for all steps except confirmation (which shows its own step indicator)
  const showStepper = !pathname?.includes("/confirmation");

  return (
    <WizardFormProvider>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {showStepper && (
          <ProgressStepper currentStep={currentStep} totalSteps={4} />
        )}
        {children}
      </div>
    </WizardFormProvider>
  );
};

export default PrivateSessionsLayout;
