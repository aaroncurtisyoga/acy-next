import React, { FC } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { placeDetails } from "@/lib/actions/google.actions";
import useAutocompleteSuggestions from "@/lib/hooks/useAutocompleteSuggestions";
import { Inputs } from "@/components/events/EventForm/Steps/BasicInfo";

interface LocationInputProps {
  control: Control;
  setValue: (
    name: string,
    value: any,
    options?: Partial<{ shouldDirty: boolean; shouldValidate: boolean }>,
  ) => void;
  errors: FieldErrors<Inputs>;
}

const LocationInput: FC<LocationInputProps> = ({
  control,
  setValue,
  errors,
}) => {
  const [selectedKey, setSelectedKey] = React.useState(""); // Add this line
  const { setSearchValue, suggestions } = useAutocompleteSuggestions();

  const handleSelectLocation = async (placeId: string) => {
    await placeDetails(placeId).then((place) => {
      setLocationValueInReactHookForm(place);
      setSelectedKey(place.formatted_address); // Update the selectedKey state here
    });
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
          selectedKey={field.value.formattedAddress}
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
