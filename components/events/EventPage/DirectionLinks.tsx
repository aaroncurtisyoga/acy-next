import { Bike, Car, Footprints, TramFront } from "lucide-react";

interface DirectionLinksProps {
  location: { geometry: { lat: any; lng: any } };
}
const DirectionLinks = ({ location }: DirectionLinksProps) => {
  const generateDirectionsUrl = (
    location: { geometry: { lat: any; lng: any } },
    travelmode: "driving" | "walking" | "transit" | "bicycling",
  ) => {
    // Docs: https://developers.google.com/maps/documentation/urls/get-started
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.geometry.lat},${location.geometry.lng}&travelmode=${travelmode}`;
    return encodeURI(directionsUrl);
  };

  return (
    <div className={"w-full"}>
      <p className={"text-center"}>How to get there</p>
      <div className=" text-primary-600">
        <ul className={"flex justify-center"}>
          <li>
            <a
              className={"px-unit-8 inline-block"}
              target="_blank"
              href={generateDirectionsUrl(location, "driving")}
            >
              <Car />
            </a>
          </li>
          <li>
            <a
              className={"px-unit-8 inline-block"}
              target="_blank"
              href={generateDirectionsUrl(location, "walking")}
            >
              <Footprints />
            </a>
          </li>
          <li>
            <a
              className={"px-unit-8 inline-block"}
              target="_blank"
              href={generateDirectionsUrl(location, "transit")}
            >
              <TramFront />
            </a>
          </li>
          <li>
            <a
              className={"px-unit-8 inline-block"}
              target="_blank"
              href={generateDirectionsUrl(location, "bicycling")}
            >
              <Bike />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DirectionLinks;
