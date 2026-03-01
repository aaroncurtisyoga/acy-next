"use client";

import { FC, useState, useCallback, useRef, useEffect } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { cn } from "@/app/_lib/utils";
import { Loader2 } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLocation = async (placeId: string) => {
    if (!placeId || isLoadingDetails) return;

    setIsLoadingDetails(true);
    setIsOpen(false);
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
      setIsOpen(value.length > 0);
    },
    [setSearchValue],
  );

  return (
    <Controller
      control={control}
      name={"location" satisfies keyof EventFormValues}
      render={({ field }) => {
        const displayValue =
          inputValue !== undefined
            ? inputValue
            : field.value?.name || field.value?.formattedAddress || "";

        return (
          <FormField label="Location" error={errors.location?.message}>
            <div ref={containerRef} className="relative">
              <Input
                placeholder="Search for a location"
                disabled={isDisabled}
                value={displayValue}
                onChange={(e) => onInputChange(e.target.value)}
                onFocus={() => {
                  if (displayValue.length > 0 && suggestions?.length > 0) {
                    setIsOpen(true);
                  }
                }}
                className={cn(
                  errors.location && "border-destructive",
                  (isLoading || isLoadingDetails) && "pr-8",
                )}
              />
              {(isLoading || isLoadingDetails) && (
                <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}

              {/* Suggestions dropdown */}
              {isOpen && suggestions?.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-y-auto">
                  {suggestions.map((location: LocationSuggestion) => (
                    <button
                      key={location.place_id}
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => handleSelectLocation(location.place_id)}
                    >
                      {location.description}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </FormField>
        );
      }}
    />
  );
};

export default LocationInput;
