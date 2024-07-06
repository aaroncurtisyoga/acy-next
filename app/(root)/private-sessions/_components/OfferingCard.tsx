"use client";

import React from "react";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { CircleCheck } from "lucide-react";
import { OfferingType } from "@/app/(root)/private-sessions/types";

interface PurchaseCardProps {
  offering: OfferingType;
}

const OfferingCard = ({ offering }) => {
  return (
    <Card className="max-w-[312px] pt-8 px-9 pb-7">
      <CardHeader>
        <div className="flex flex-col">
          <p className="text-xl font-semibold text-md">{offering.title}</p>
          <p className="text-small text-default-500">{offering.description}</p>
        </div>
      </CardHeader>
      <CardBody>
        <p className={"text-4xl font-semibold"}>{offering.price}</p>
        <Button
          className={"text-base"}
          fullWidth={true}
          onPress={() => {
            // Add purchase logic here
            console.log("Purchase button clicked");
          }}
          color={"primary"}
        >
          Sign Up
        </Button>

        <p>This includes:</p>
        <ul>
          {offering.features.map((feature) => (
            <li key={feature} className={"flex"}>
              <CircleCheck strokeWidth={1.5} />
              {feature}
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
};

export default OfferingCard;
