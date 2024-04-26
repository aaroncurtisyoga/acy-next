import React, { FC } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { placeDetails } from "@/lib/actions/google.actions";
import useAutocompleteSuggestions from "@/lib/hooks/useAutocompleteSuggestions";
import { Inputs } from "@/components/events/EventForm/Steps/BasicInfo";

interface LocationInputProps {
  control: Control;
  // todo: fix this type
  setLocationValueInReactHookForm: any;
  errors: FieldErrors<Inputs>;
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
        geometry: place.geometry.location,
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
