import { FC } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Check } from "lucide-react";
import { OfferingType } from "@/app/(root)/private-sessions/_lib/types";

interface PurchaseCardProps {
  offering: OfferingType;
  isSelected: boolean;
  onChange: (value: string) => void;
}

const OfferingCard: FC<PurchaseCardProps> = ({
  offering,
  isSelected,
  onChange,
}) => {
  const handleCardClick = () => {
    onChange(offering.package);
  };

  return (
    <Card
      className={`w-[312px] pt-8 px-3 pb-7 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/30 shadow-md ring-2 ring-blue-600 dark:ring-blue-400"
          : "hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md bg-white dark:bg-gray-900"
      }`}
      onPress={handleCardClick}
      isPressable
      data-selected={isSelected ? "true" : "false"}
    >
      <CardHeader className="flex flex-row justify-between items-start gap-2 pointer-events-none">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
            {offering.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {offering.description}
          </p>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            isSelected
              ? "border-blue-600 dark:border-blue-400 bg-blue-600 dark:bg-blue-400 shadow-sm"
              : "border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500"
          }`}
        >
          {isSelected && (
            <Check
              size={12}
              className="text-white dark:text-gray-900"
              strokeWidth={3}
            />
          )}
        </div>
      </CardHeader>
      <CardBody className={"pt-1 px-7 pointer-events-none"}>
        <p
          className={"text-4xl font-semibold text-gray-900 dark:text-gray-200"}
        >
          ${offering.price}
        </p>
        <p className={"text-sm mt-4 mb-1 text-gray-700 dark:text-gray-400"}>
          This includes:
        </p>
        <ul>
          {offering.features.map((feature) => (
            <li
              key={feature}
              className={
                "flex text-sm items-center text-gray-700 dark:text-gray-400"
              }
            >
              <Check
                strokeWidth={1.5}
                className={"mr-2 text-green-600 dark:text-green-400"}
                size={14}
              />
              {feature}
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
};

export default OfferingCard;
