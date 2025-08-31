"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
  useEffect,
  useMemo,
} from "react";
import { usePathname } from "next/navigation";
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
  const [formData, setFormData] = useState<PrivateSessionFormData>(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("privateSessionFormData");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return {};
        }
      }
    }
    return {};
  });
  const { isSignedIn } = useAuth();
  const pathname = usePathname();

  const totalSteps = 4; // Welcome -> Sign-in -> Package Selection -> Checkout

  // Map routes to steps - memoized to prevent useEffect dependency issues
  const stepRoutes = useMemo(
    () => ({
      "/private-sessions/welcome": 1,
      "/private-sessions/sign-in": 2,
      "/private-sessions/select-package": 3,
      "/private-sessions/checkout": 4,
      "/private-sessions/confirmation": 5,
    }),
    [],
  );

  // Update current step based on pathname
  useEffect(() => {
    const step = stepRoutes[pathname as keyof typeof stepRoutes];
    if (step) {
      setCurrentStep(step);
    }
  }, [pathname, stepRoutes]);

  const goToNextStep = () =>
    setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
  const goToPreviousStep = () =>
    setCurrentStep((prev) => Math.max(1, prev - 1));
  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };
  const updateFormData = (data: Partial<PrivateSessionFormData>) => {
    const newData = (prev: PrivateSessionFormData) => ({ ...prev, ...data });
    setFormData(newData);
    // Save to localStorage
    if (typeof window !== "undefined") {
      const updatedData = newData(formData);
      localStorage.setItem(
        "privateSessionFormData",
        JSON.stringify(updatedData),
      );
    }
  };

  const resetFormData = () => {
    setFormData({});
    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("privateSessionFormData");
    }
  };

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
