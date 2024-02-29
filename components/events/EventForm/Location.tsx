import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import {
  autocompleteSuggestions,
  placeDetails,
} from "@/lib/actions/google.actions";
import _ from "lodash";

const Location = ({ control, setValue }) => {
  const [, setIsOpen] = React.useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  useEffect(() => {
    if (!locationSearch || locationSearch.trim().length <= 3) return;
    const debouncedAutocomplete = _.debounce(autocompleteSuggestions, 2000);
    debouncedAutocomplete(locationSearch).then((result) => {
      setLocationSuggestions(result);
      setIsOpen(true);
    });
  }, [locationSearch]);

  const handleSelectLocation = async (placeId: string) => {
    await placeDetails(placeId).then((r) => setLocationValueInReactHookForm(r));
  };

  const setLocationValueInReactHookForm = async (placeDetails) => {
    setValue("location", {
      formattedAddress: placeDetails.formatted_address,
      geometry: placeDetails.geometry.location,
      name: placeDetails.name,
      placeId: placeDetails.place_id,
    });
    setLocationSearch(placeDetails.formatted_address);
    setIsOpen(false);
  };

  const onInputChange = (value: string) => {
    setLocationSearch(value);
  };

  return (
    <Controller
      control={control}
      name={"location"}
      render={({ field }) => (
        <Autocomplete
          description="Select an address from the dropdown"
          label="Location"
          placeholder="Search for a location"
          variant={"bordered"}
          onOpenChange={setIsOpen}
          onInputChange={onInputChange}
          onKeyDown={(e) => e.continuePropagation()}
        >
          {locationSuggestions.map((location) => (
            <AutocompleteItem
              value={location.description}
              key={location.place_id}
              onPress={() => {
                handleSelectLocation(location.place_id);
              }}
            >
              {location.description}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      )}
    />
  );
};

export default Location;
