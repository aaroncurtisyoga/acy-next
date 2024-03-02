"use server";

import {
  Client,
  PlaceAutocompleteResponse,
} from "@googlemaps/google-maps-services-js";

const client = new Client({});

export const autocompleteSuggestions = async (search) => {
  console.log("autocompleteSuggestions called", search);
  return await client
    .placeAutocomplete({
      params: {
        input: search,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    })
    .then((r: PlaceAutocompleteResponse) => {
      return r.data.predictions;
    })
    .catch((e) => {
      console.log(e.response.data.error_message);
      return e.response.data.error_message;
    });
};

export const placeDetails = async (placeId) => {
  return await client
    .placeDetails({
      params: {
        place_id: placeId,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        fields: ["formatted_address", "geometry", "name", "place_id"],
      },
    })
    .then((r) => {
      return r.data.result;
    })
    .catch((e) => {
      console.log(e.response.data.error_message);
      return e.response.data.error_message;
    });
};
