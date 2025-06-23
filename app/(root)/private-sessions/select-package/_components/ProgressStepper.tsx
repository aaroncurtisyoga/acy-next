import React, { FC } from "react";

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressStepper: FC<ProgressStepperProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="text-left mb-4">
      <p className="text-sm font-medium text-gray-500">
        STEP <span className="font-bold">{currentStep}</span> OF{" "}
        <span className="font-bold">{totalSteps}</span>
      </p>
    </div>
  );
};
