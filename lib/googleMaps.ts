import { Loader } from "@googlemaps/js-api-loader";

/**
 * This is a wrapper around the Google Maps API client.
 * see https://developers.google.com/maps/documentation/javascript
 */

let googleApiClient;

export async function getGoogleMapsApiClient() {
  if (googleApiClient) {
    return googleApiClient;
  }

  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    version: "weekly",
    libraries: ["places", "geocoding"],
  });

  googleApiClient = await loader.load();

  return googleApiClient;
}
