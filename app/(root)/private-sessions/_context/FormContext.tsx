import React, { createContext, useContext, useState, ReactNode } from "react";
import { useForm, FormProvider } from "react-hook-form";

// Define your wizard form types
interface WizardFormData {
  // Will add more fields as we add more steps
  package?: string;
}

interface FormContextType {
  currentStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useWizardForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useWizardForm must be used within a WizardFormProvider");
  }
  return context;
};

interface WizardFormProviderProps {
  children: ReactNode;
}

export const WizardFormProvider: React.FC<WizardFormProviderProps> = ({
  children,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const methods = useForm<WizardFormData>({
    defaultValues: {
      package: "",
    },
  });

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <FormContext.Provider
      value={{ currentStep, goToNextStep, goToPreviousStep, goToStep }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </FormContext.Provider>
  );
};
