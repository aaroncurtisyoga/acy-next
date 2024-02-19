import { MapPin } from "lucide-react";
import Map from "@/components/shared/Map";
const Location = ({ location }) => {
  return (
    <>
      <h2 className={"text-2xl font-bold mb-3"}>Location</h2>
      <div className={"flex mb-6 gap-4 md:mb-8"}>
        <MapPin size={14} className={"mt-1"} />
        <div>
          <p className={"text-sm"}>{location.name}</p>
          <p className={"text-sm"}>{location.formattedAddress}</p>
          <p className={"text-sm"}>Show map</p>
        </div>
        <Map geometry={location.geometry} />
      </div>
    </>
  );
};

export default Location;
