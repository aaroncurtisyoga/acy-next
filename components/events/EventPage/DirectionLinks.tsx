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
    <div>
      <p>How to get there</p>
      <a target="_blank" href={generateDirectionsUrl(location, "driving")}>
        <Car />
      </a>
      <a target="_blank" href={generateDirectionsUrl(location, "walking")}>
        <Footprints />
      </a>
      <a target="_blank" href={generateDirectionsUrl(location, "transit")}>
        <TramFront />
      </a>
      <a target="_blank" href={generateDirectionsUrl(location, "bicycling")}>
        <Bike />
      </a>
    </div>
  );
};

export default DirectionLinks;
