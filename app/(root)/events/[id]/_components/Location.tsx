"use client";

import { FC } from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { Location as LocationPrisma } from "@prisma/client";
import DirectionLinks from "@/app/(root)/events/[id]/_components/DirectionLinks";
import GoogleMap from "@/_components/GoogleMap";

interface LocationProps {
  location: LocationPrisma;
}
const Location: FC<LocationProps> = ({ location }) => {
  return (
    <div className={"mb-6 md:mb-8"}>
      <h2 className={"text-2xl font-bold mb-3"}>Location</h2>
      <div className={"flex gap-4"}>
        <MapPin size={14} className={"mt-1"} />
        <div className={"text-sm"}>
          <p className={"mb-2"}>
            <b>{location.name}</b>
          </p>
          <p className={"mb-2"}>{location.formattedAddress}</p>
          <Accordion className={"p-0"}>
            <AccordionItem
              key="1"
              aria-label="Show Map Accordion"
              title={<p>Show Map</p>}
              classNames={{
                indicator: "text-primary",
                trigger: "w-auto py-0",
                title: "text-sm font-semibold cursor-pointer text-primary",
              }}
              indicator={({ isOpen }) =>
                isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />
              }
              disableIndicatorAnimation={true}
            >
              <GoogleMap lat={location.lat} lng={location.lng} />
              <DirectionLinks lat={location.lat} lng={location.lng} />
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Location;
