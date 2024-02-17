"use server";

import {
  Client,
  PlaceAutocompleteResponse,
} from "@googlemaps/google-maps-services-js";

const client = new Client({});

export const autocompleteSuggestions = async (search) => {
  console.log("autocompleteSuggestions fired");
  return await client
    .placeAutocomplete({
      params: {
        input: search,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    })
    .then((r: PlaceAutocompleteResponse) => {
      console.log("r.data.predictions", r.data.predictions);
      return r.data.predictions;
    })
    .catch((e) => {
      console.log(
        "e.response.data.error_message",
        e.response.data.error_message,
      );
      return e.response.data.error_message;
    });
};
