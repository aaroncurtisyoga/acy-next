import React, { FC } from "react";
import OfferingCard from "@/app/(root)/private-sessions/_components/OfferingCard";
import {
  GROUP_OFFERINGS,
  INDIVIDUAL,
  INDIVIDUAL_OFFERINGS,
} from "@/app/(root)/private-sessions/_lib/constants";
import {
  OfferingType,
  SessionType,
} from "@/app/(root)/private-sessions/_lib/types";

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
        " justify-center mt-4"
      }
    >
      {offerings.map((offering) => (
        <OfferingCard key={offering.title} offering={offering} />
      ))}
    </div>
  );
};

export default PrivateSessionOfferings;
