import React from "react";
import { Controller } from "react-hook-form";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

const Location = ({ control }) => {
  const animals = [
    { label: "Dog", value: "dog" },
    { label: "Cat", value: "cat" },
    { label: "Horse", value: "horse" },
  ];

  return (
    <Controller
      control={control}
      name={"location"}
      render={({ field }) => (
        <Autocomplete
          defaultItems={animals}
          description="Select an address from the dropdown"
          // isLoading={}
          label="Location"
          placeholder="Search for a location"
          variant={"bordered"}
        >
          {(animal) => (
            <AutocompleteItem key={animal.value}>
              {animal.label}
            </AutocompleteItem>
          )}
        </Autocomplete>
      )}
    />
  );
};

export default Location;
