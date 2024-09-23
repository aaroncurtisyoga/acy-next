"use client";

import React, { FC } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { placeDetails } from "@/_lib/actions/google.actions";
import useAutocompleteSuggestions from "@/_lib/hooks/useAutocompleteSuggestions";
import { Inputs } from "@/app/admin/events/_components/EventForm/Steps/BasicInfo";

interface LocationInputProps {
  control: Control;
  setLocationValueInReactHookForm: any;
  errors: FieldErrors<Inputs>;
}

const LocationInput: FC<LocationInputProps> = ({
  control,
  setLocationValueInReactHookForm,
  errors,
}) => {
  const { setSearchValue, suggestions } = useAutocompleteSuggestions();

  const handleSelectLocation = async (placeId: any) => {
    await placeDetails(placeId).then((place) => {
      setLocationValueInReactHookForm({
        formattedAddress: place.formatted_address,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        name: place.name,
        placeId: place.place_id,
      });
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
          isInvalid={!!errors.location?.formattedAddress}
          label="Location"
          placeholder="Search for a location"
          variant={"bordered"}
          onInputChange={onInputChange}
          onSelectionChange={(value) => handleSelectLocation(value)}
        >
          {suggestions?.map((location) => (
            <AutocompleteItem
              value={location.description}
              key={location.place_id}
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
