import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { placeDetails } from "@/lib/actions/google.actions";
import useAutocompleteSuggestions from "@/lib/hooks/useAutocompleteSuggestions";

const LocationInput = ({ control, setValue, errors }) => {
  const { setSearchValue, suggestions } = useAutocompleteSuggestions();

  const handleSelectLocation = async (placeId: string) => {
    await placeDetails(placeId).then((place) =>
      setLocationValueInReactHookForm(place),
    );
  };

  const setLocationValueInReactHookForm = async (placeDetails) => {
    setValue("location", {
      formattedAddress: placeDetails.formatted_address,
      geometry: placeDetails.geometry.location,
      name: placeDetails.name,
      placeId: placeDetails.place_id,
    });
  };

  const onInputChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <Controller
      control={control}
      name={"location"}
      render={({ field }) => (
        <Autocomplete
          errorMessage={errors.location?.formattedAddress?.message}
          label="Location"
          placeholder="Search for a location"
          variant={"bordered"}
          onInputChange={onInputChange}
          onKeyDown={(e) => e.continuePropagation()}
        >
          {suggestions?.map((location) => (
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

export default LocationInput;
