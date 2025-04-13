import React, { FC } from "react";

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressStepper: FC<ProgressStepperProps> = ({
  currentStep,
  totalSteps,
}) => {
  const steps = [
    { id: 1, label: "Welcome" },
    { id: 2, label: "Select Package" },
    { id: 3, label: "Payment" },
  ];

  return (
    <div className="mb-10">
      <div className="text-center mb-4">
        <p className="text-sm font-medium text-gray-500">
          STEP <span className="font-bold">{currentStep}</span> OF{" "}
          <span className="font-bold">{totalSteps}</span>
        </p>
      </div>

      <div className="flex justify-between items-center max-w-3xl mx-auto">
        {steps.map((step) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.id === currentStep
                    ? "bg-primary-500 text-white"
                    : step.id < currentStep
                      ? "bg-primary-200 text-primary-700"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.id < currentStep ? "✓" : step.id}
              </div>
              <p className="mt-2 text-sm">{step.label}</p>
            </div>

            {step.id < steps.length && (
              <div
                className={`h-1 w-24 md:w-32 lg:w-40 ${
                  step.id < currentStep ? "bg-primary-500" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
