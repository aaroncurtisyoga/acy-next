import React, { FC } from "react";
import { useController, useFormContext } from "react-hook-form";
import {
  GROUP_OFFERINGS,
  INDIVIDUAL,
  INDIVIDUAL_OFFERINGS,
} from "@/app/(root)/private-sessions/_lib/constants";
import { SessionType } from "@/app/(root)/private-sessions/_lib/types";
import OfferingCard from "@/app/(root)/private-sessions/select-package/_components/OfferingCard";

interface OfferingsProps {
  privateSessionType: SessionType;
  name: string;
}

const PrivateSessionOfferings: FC<OfferingsProps> = ({
  privateSessionType,
  name,
}) => {
  const { control } = useFormContext();
  const { field } = useController({ name, control });

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
        <OfferingCard
          key={offering.title}
          offering={offering}
          isSelected={field.value === offering.package}
          onChange={(value) => field.onChange(value)}
        />
      ))}
    </div>
  );
};

export default PrivateSessionOfferings;
