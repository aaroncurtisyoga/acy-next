import React, { FC } from "react";
import {
  INDIVIDUAL_OFFERINGS,
  GROUP_OFFERINGS,
  GROUP,
  INDIVIDUAL,
} from "@/app/(root)/private-sessions/constants";
import { SessionType } from "@/app/(root)/private-sessions/types";
import OfferingCard from "@/app/(root)/private-sessions/_components/OfferingCard";

interface OfferingsProps {
  privateSessionType: SessionType;
}

const PrivateSessionOfferings: FC<OfferingsProps> = ({
  privateSessionType,
}) => {
  const offerings =
    privateSessionType === INDIVIDUAL ? INDIVIDUAL_OFFERINGS : GROUP_OFFERINGS;
  return (
    <div className={"flex justify-center"}>
      {offerings.map((offering) => (
        <OfferingCard key={offering.title} offering={offering} />
      ))}
    </div>
  );
};

export default PrivateSessionOfferings;
