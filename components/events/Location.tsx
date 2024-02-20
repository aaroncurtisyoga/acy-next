import { MapPin } from "lucide-react";
import Map from "@/components/shared/Map";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Location = ({ location }) => {
  return (
    <>
      <h2 className={"text-2xl font-bold mb-3"}>Location</h2>
      <div className={"flex mb-6 gap-4 md:mb-8"}>
        <MapPin size={14} className={"mt-1"} />
        <div>
          <p className={"text-sm"}>{location.name}</p>
          <p className={"text-sm"}>{location.formattedAddress}</p>
          <Accordion type="multiple">
            <AccordionItem
              value={"googleMap"}
              className={"border-none text-blue-700"}
            >
              <AccordionTrigger>Show Map</AccordionTrigger>
              <AccordionContent>
                <Map geometry={location.geometry} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default Location;
