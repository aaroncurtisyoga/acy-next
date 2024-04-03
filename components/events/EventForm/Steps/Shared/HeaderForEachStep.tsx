import { getEventFormSteps } from "@/constants";

interface HeaderForEachStepProps {
  currentStep: number;
}
const HeaderForEachStep = ({ currentStep }: HeaderForEachStepProps) => {
  let step = getEventFormSteps()[currentStep];
  return (
    <h1 className={"text-xl font-semibold leading-7 text-gray-900"}>
      {step.id} - {step.name}
    </h1>
  );
};

export default HeaderForEachStep;
