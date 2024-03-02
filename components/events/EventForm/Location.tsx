import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { placeDetails } from "@/lib/actions/google.actions";
import useAutocompleteSuggestions from "@/lib/hooks/useAutocompleteSuggestions";

const Location = ({ control, setValue }) => {
  const [, setIsOpen] = useState(false);
  const { setSearchValue, suggestions } = useAutocompleteSuggestions();

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
    // setLocationSearch(placeDetails.formatted_address);
    setIsOpen(false);
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
          description="Select an address from the dropdown"
          label="Location"
          placeholder="Search for a location"
          variant={"bordered"}
          onOpenChange={setIsOpen}
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

export default Location;
