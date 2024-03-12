"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";
import { MapPin } from "lucide-react";
import Map from "@/components/shared/Map";
import DirectionLinks from "@/components/events/EventPage/DirectionLinks";

const Location = ({ location }) => {
  return (
    <div className={"mb-6 md:mb-8"}>
      <h2 className={"text-2xl font-bold mb-3"}>Location</h2>
      <div className={"flex gap-4"}>
        <MapPin size={14} className={"mt-1"} />
        <div className={"text-sm"}>
          <p className={"mb-unit-2"}>
            <b>{location.name}</b>
          </p>
          <p className={"mb-unit-2"}>{location.formattedAddress}</p>
          <Accordion className={"p-0"}>
            <AccordionItem
              key="1"
              aria-label="Show Map Accordion"
              title={<p>Show Map</p>}
              classNames={{
                indicator: "text-primary-600 stroke-4",
                trigger: "py-0 w-auto",
                title: "text-sm font-semibold cursor-pointer text-primary-600",
              }}
            >
              <Map geometry={location.geometry} />
              <DirectionLinks location={location} />
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Location;

/*
<Map geometry={location.geometry} />

*/
