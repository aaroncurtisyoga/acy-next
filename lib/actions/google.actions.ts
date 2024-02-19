"use server";

import {
  Client,
  PlaceAutocompleteResponse,
} from "@googlemaps/google-maps-services-js";

const client = new Client({});

export const autocompleteSuggestions = async (search) => {
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
