import React, { FC } from "react";
import {
  INDIVIDUAL_OFFERINGS,
  GROUP_OFFERINGS,
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
    <div
      className={
        "flex flex-col items-center md:items-stretch md:flex-row gap-16" +
        " justify-center" +
        " mt-4" +
        " pb-40"
      }
    >
      {offerings.map((offering) => (
        <OfferingCard key={offering.title} offering={offering} />
      ))}
    </div>
  );
};

export default PrivateSessionOfferings;
