"use client";

import { createContext, useContext, useState, ReactNode, FC } from "react";
import { useAuth } from "@clerk/nextjs";
import { SessionPurchase, SessionType } from "../types";

interface PrivateSessionFormData {
  sessionType?: SessionType;
  sessionCount?: number;
  sessionPurchase?: SessionPurchase;
  package?: string; // Legacy support
  packageDetails?: {
    title: string;
    price: string;
    description: string;
    features: string[];
    package: string;
  }; // Legacy support
  customerInfo?: {
    email: string;
    name: string;
  };
}

interface WizardFormContextProps {
  currentStep: number;
  totalSteps: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
  formData: PrivateSessionFormData;
  updateFormData: (data: Partial<PrivateSessionFormData>) => void;
  resetFormData: () => void;
  isAuthenticated: boolean;
  isComplete: boolean;
}

const WizardFormContext = createContext<WizardFormContextProps | undefined>(
  undefined,
);

export const WizardFormProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PrivateSessionFormData>({});
  const { isSignedIn } = useAuth();

  const totalSteps = 4; // Welcome -> Package Selection -> Checkout -> Confirmation

  const goToNextStep = () =>
    setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
  const goToPreviousStep = () =>
    setCurrentStep((prev) => Math.max(1, prev - 1));
  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };
  const updateFormData = (data: Partial<PrivateSessionFormData>) =>
    setFormData((prev) => ({ ...prev, ...data }));
  const resetFormData = () => setFormData({});

  const isComplete = currentStep === totalSteps;

  return (
    <WizardFormContext.Provider
      value={{
        currentStep,
        totalSteps,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        formData,
        updateFormData,
        resetFormData,
        isAuthenticated: !!isSignedIn,
        isComplete,
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
