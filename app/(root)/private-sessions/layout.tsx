"use client";

import { FC, ReactNode } from "react";
import { WizardFormProvider } from "@/app/(root)/private-sessions/_lib/_context/FormContext";

interface PrivateSessionsLayoutProps {
  children: ReactNode;
}

const PrivateSessionsLayout: FC<PrivateSessionsLayoutProps> = ({
  children,
}) => {
  return (
    <WizardFormProvider>
      <div className="w-full mx-auto px-4 pt-8 pb-24 min-h-screen">
        {children}
      </div>
    </WizardFormProvider>
  );
};

export default PrivateSessionsLayout;
