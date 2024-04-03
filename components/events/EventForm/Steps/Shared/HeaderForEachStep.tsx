import { eventFormSteps } from "@/constants";

interface HeaderForEachStepProps {
  currentStep: number;
}
const HeaderForEachStep = ({ currentStep }: HeaderForEachStepProps) => {
  return (
    <h1 className={"text-xl font-semibold leading-7 text-gray-900"}>
      {eventFormSteps[currentStep].id} - {eventFormSteps[currentStep].name}
    </h1>
  );
};

export default HeaderForEachStep;
