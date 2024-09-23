import React, { FC } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Check } from "lucide-react";
import { OfferingType } from "@/app/(root)/private-sessions/_lib/types";
import { CustomRadio } from "@/app/(root)/_components/FormInputs/CustomRadio";

interface PurchaseCardProps {
  offering: OfferingType;
}

const OfferingCard: FC<PurchaseCardProps> = ({ offering }) => {
  return (
    <Card className="w-[312px] pt-8 px-3 pb-7">
      <CardHeader>
        <CustomRadio
          description={offering.description}
          value={offering.package}
        >
          {offering.title}
        </CustomRadio>
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
