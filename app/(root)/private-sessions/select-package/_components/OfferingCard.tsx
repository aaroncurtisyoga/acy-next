import React, { FC } from "react";
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
    if (!isSelected) {
      onChange(offering.package);
    }
  };

  return (
    <Card
      className="w-[312px] pt-8 px-3 pb-7 cursor-pointer hover:bg-gray-50 transition-colors"
      onPress={handleCardClick}
      data-selected={isSelected ? "true" : "false"}
      style={{
        borderColor: isSelected ? "var(--primary)" : "transparent",
        borderWidth: "2px",
      }}
    >
      <CardHeader className="flex flex-row justify-between items-start gap-2">
        <div>
          <h3 className="text-lg font-semibold">{offering.title}</h3>
          <p className="text-sm text-gray-600">{offering.description}</p>
        </div>
        <div 
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
            isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
          }`}
          onClick={() => onChange(offering.package)}
        >
          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </CardHeader>
      <CardBody className={"pt-1 px-7"}>
        <p className={"text-4xl font-semibold"}>${offering.price}</p>
        <p className={"text-sm mt-4 mb-1"}>This includes:</p>
        <ul>
          {offering.features.map((feature) => (
            <li key={feature} className={"flex text-sm items-center"}>
              <Check strokeWidth={1.5} className={"mr-2"} size={14} />
              {feature}
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
};

export default OfferingCard;
