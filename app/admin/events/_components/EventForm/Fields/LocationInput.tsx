"use client";

import { FC, useState, useCallback } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { placeDetails } from "@/app/_lib/actions/google.actions";
import useAutocompleteSuggestions from "@/app/_lib/hooks/useAutocompleteSuggestions";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";

interface LocationInputProps {
  control: Control<EventFormValues>;
  setLocationValueInReactHookForm: any;
  errors: FieldErrors<EventFormValues>;
  isDisabled?: boolean;
}

interface LocationSuggestion {
  place_id: string;
  description: string;
}

const LocationInput: FC<LocationInputProps> = ({
  control,
  setLocationValueInReactHookForm,
  errors,
  isDisabled = false,
}) => {
  const { setSearchValue, suggestions, isLoading } =
    useAutocompleteSuggestions();
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);

  const handleSelectLocation = async (placeId: string) => {
    if (!placeId || isLoadingDetails) return;

    setIsLoadingDetails(true);
    try {
      const place = await placeDetails(placeId);
      if (place) {
        setLocationValueInReactHookForm({
          formattedAddress: place.formatted_address,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          name: place.name,
          placeId: place.place_id,
        });
        // Update display value to show selected location
        setInputValue(place.name || place.formatted_address);
      }
    } catch (error) {
      console.error("Failed to get place details:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const onInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      setSearchValue(value);
    },
    [setSearchValue],
  );

  return (
    <Controller
      control={control}
      name={"location" satisfies keyof EventFormValues}
      render={({ field }) => {
        // Determine display value: use local inputValue if set, otherwise show current location
        const displayValue =
          inputValue !== undefined
            ? inputValue
            : field.value?.name || field.value?.formattedAddress || "";

        return (
          <Autocomplete
            errorMessage={errors.location?.message}
            isInvalid={!!errors.location}
            label="Location"
            placeholder="Search for a location"
            variant={"bordered"}
            isLoading={isLoading || isLoadingDetails}
            isDisabled={isDisabled}
            inputValue={displayValue}
            onInputChange={onInputChange}
            allowsCustomValue
            onSelectionChange={(key) => {
              // The key is already the place_id, use it directly
              const placeId = key?.toString();
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
        );
      }}
    />
  );
};

export default LocationInput;
