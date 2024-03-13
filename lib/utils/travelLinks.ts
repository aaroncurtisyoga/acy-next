import { TravelMode } from "@/types";

export const generateDirectionsUrl = (
  location: { geometry: { lat: any; lng: any } },
  travelmode: TravelMode,
) => {
  // Docs: https://developers.google.com/maps/documentation/urls/get-started
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.geometry.lat},${location.geometry.lng}&travelmode=${travelmode}`;
  return encodeURI(directionsUrl);
};
