import React, { FC } from "react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator: FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
      STEP <span className="font-bold">{currentStep}</span> OF{" "}
      <span className="font-bold">{totalSteps}</span>
    </div>
  );
};
