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
    <Card className="max-w-[312px]">
      <CardHeader>
        <div className="flex flex-col">
          <p className="text-xl font-semibold text-md">1 Session</p>
          <p className="text-small text-default-500">1 hour of training</p>
        </div>
      </CardHeader>
      <CardBody>
        <p className={"text-4xl font-semibold"}>$125</p>
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
          <li className={"flex"}>
            <CircleCheck />
            Personalized programming
          </li>
          <li className={"flex"}>
            <CircleCheck />
            Virtual or In Person
          </li>
          <li className={"flex"}>
            <CircleCheck />
            Breathwork
          </li>
          <li className={"flex"}>
            <CircleCheck />
            Meditation
          </li>
        </ul>
      </CardBody>
    </Card>
  );
};

export default OfferingCard;
