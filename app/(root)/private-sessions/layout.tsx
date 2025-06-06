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
    if (pathname?.includes("/sign-in")) return 2;
    if (pathname?.includes("/select-package")) return 3;
    if (pathname?.includes("/checkout")) return 4;
    if (pathname?.includes("/confirmation")) return 5;
    return 2; // Default to step 2 (sign-in)
  };

  const currentStep = getCurrentStep();
  const isWelcomePage = pathname?.includes("/welcome");

  return (
    <WizardFormProvider>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {!isWelcomePage && (
          <>
            <h1 className="text-4xl font-bold mb-6 tracking-tight text-primary-500 text-center">
              Train With Me
            </h1>
            <ProgressStepper currentStep={currentStep} totalSteps={5} />
          </>
        )}
        {children}
      </div>
    </WizardFormProvider>
  );
};

export default PrivateSessionsLayout;
