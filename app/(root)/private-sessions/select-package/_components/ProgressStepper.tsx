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
    <div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        Step {currentStep} of {totalSteps}
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};
