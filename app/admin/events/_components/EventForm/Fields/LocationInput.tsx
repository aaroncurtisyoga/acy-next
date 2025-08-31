"use client";

import React, { FC } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { placeDetails } from "@/app/_lib/actions/google.actions";
import useAutocompleteSuggestions from "@/app/_lib/hooks/useAutocompleteSuggestions";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";

interface LocationInputProps {
  control: Control<EventFormValues>;
  setLocationValueInReactHookForm: any;
  errors: FieldErrors<EventFormValues>;
}

interface LocationSuggestion {
  place_id: string;
  description: string;
}

const LocationInput: FC<LocationInputProps> = ({
  control,
  setLocationValueInReactHookForm,
  errors,
}) => {
  const { setSearchValue, suggestions } = useAutocompleteSuggestions();

  const handleSelectLocation = async (placeId: string) => {
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

  // Map place IDs for lookup
  const placeIdMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    suggestions?.forEach((location: LocationSuggestion) => {
      map[location.place_id] = location.place_id;
    });
    return map;
  }, [suggestions]);

  return (
    <Controller
      control={control}
      name={"location" satisfies keyof EventFormValues}
      render={() => (
        <Autocomplete
          errorMessage={errors.location?.message}
          isInvalid={!!errors.location}
          label="Location"
          placeholder="Search for a location"
          variant={"bordered"}
          onInputChange={onInputChange}
          onSelectionChange={(key) => {
            // Convert the key to a string and use it to look up the place_id
            const placeId = placeIdMap[key.toString()];
            if (placeId) {
              handleSelectLocation(placeId);
            }
          }}
        >
          {suggestions?.map((location: LocationSuggestion) => (
            <AutocompleteItem key={location.place_id} id={location.place_id}>
              {location.description}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      )}
    />
  );
};

export default LocationInput;
