"use client";

import { FC } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Location as LocationPrisma } from "@prisma/client";
import { MapPin } from "lucide-react";
import DirectionLinks from "@/app/(root)/events/[id]/_components/DirectionLinks";
import GoogleMap from "@/app/_components/GoogleMap";

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
          <Accordion type="single" collapsible className="p-0 border-none">
            <AccordionItem value="map" className="border-none">
              <AccordionTrigger className="w-auto py-0 text-sm font-semibold text-primary hover:no-underline">
                Show Map
              </AccordionTrigger>
              <AccordionContent>
                <GoogleMap lat={location.lat} lng={location.lng} />
                <DirectionLinks lat={location.lat} lng={location.lng} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Location;
