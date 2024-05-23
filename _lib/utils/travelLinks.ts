import { TravelMode } from "@/types";

export const generateDirectionsUrl = (
  lat: number,
  lng: number,
  travelmode: TravelMode,
) => {
  // Docs: https://developers.google.com/maps/documentation/urls/get-started
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=${travelmode}`;
  return encodeURI(directionsUrl);
};
