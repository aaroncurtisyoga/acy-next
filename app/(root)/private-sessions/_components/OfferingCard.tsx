import React, { FC } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Check } from "lucide-react";
import CheckoutButton from "@/app/(root)/private-sessions/_components/CheckoutButton";
import { OfferingType } from "@/app/(root)/private-sessions/_lib/types";

interface PurchaseCardProps {
  offering: OfferingType;
}

const OfferingCard: FC<PurchaseCardProps> = ({ offering }) => {
  return (
    <Card className="w-[312px] pt-8 px-7 pb-7">
      <CardHeader>
        <div className="flex flex-col">
          <p className="text-xl font-semibold text-md mb-1">{offering.title}</p>
          <p className="text-small text-default-500">{offering.description}</p>
        </div>
      </CardHeader>
      <CardBody className={"pt-1"}>
        <p className={"text-4xl font-semibold"}>{offering.price}</p>
        <CheckoutButton />
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
