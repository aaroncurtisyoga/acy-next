"use client";

import { createContext, useContext, useState, ReactNode, FC } from "react";
import { useAuth } from "@clerk/nextjs";

interface WizardFormContextProps {
  currentStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  formData: any;
  updateFormData: (data: any) => void;
  isAuthenticated: boolean;
}

const WizardFormContext = createContext<WizardFormContextProps | undefined>(
  undefined,
);

export const WizardFormProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { isSignedIn } = useAuth();

  const goToNextStep = () => setCurrentStep((prev) => prev + 1);
  const goToPreviousStep = () =>
    setCurrentStep((prev) => Math.max(1, prev - 1));
  const updateFormData = (data: any) =>
    setFormData((prev) => ({ ...prev, ...data }));

  return (
    <WizardFormContext.Provider
      value={{
        currentStep,
        goToNextStep,
        goToPreviousStep,
        formData,
        updateFormData,
        isAuthenticated: !!isSignedIn,
      }}
    >
      {children}
    </WizardFormContext.Provider>
  );
};

export const useWizardForm = () => {
  const context = useContext(WizardFormContext);
  if (!context) {
    throw new Error("useWizardForm must be used within a WizardFormProvider");
  }
  return context;
};
