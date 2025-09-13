"use client";

import { createContext, useContext, useEffect } from "react";
import { ReactNode } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  now,
  getLocalTimeZone,
  parseZonedDateTime,
} from "@internationalized/date";

const FORM_STORAGE_KEY = "eventFormData";

// Helper functions for form persistence
const saveFormDataToStorage = (data: EventFormValues) => {
  if (typeof window !== "undefined") {
    try {
      // Convert ZonedDateTime objects to strings for storage
      const serializable = {
        ...data,
        startDateTime: data.startDateTime?.toString?.(),
        endDateTime: data.endDateTime?.toString?.(),
      };
      sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(serializable));
    } catch (error) {
      console.error("Failed to save form data:", error);
    }
  }
};

const loadFormDataFromStorage = (): EventFormValues | null => {
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem(FORM_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to ZonedDateTime objects
        if (parsed.startDateTime && typeof parsed.startDateTime === "string") {
          try {
            parsed.startDateTime = parseZonedDateTime(parsed.startDateTime);
          } catch (e) {
            console.warn("Failed to parse startDateTime:", e);
            delete parsed.startDateTime;
          }
        }
        if (parsed.endDateTime && typeof parsed.endDateTime === "string") {
          try {
            parsed.endDateTime = parseZonedDateTime(parsed.endDateTime);
          } catch (e) {
            console.warn("Failed to parse endDateTime:", e);
            delete parsed.endDateTime;
          }
        }
        return parsed;
      }
      return null;
    } catch (error) {
      console.error("Failed to load form data, clearing storage:", error);
      // Clear corrupted data
      clearFormDataFromStorage();
      return null;
    }
  }
  return null;
};

const clearFormDataFromStorage = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(FORM_STORAGE_KEY);
  }
};

export type EventFormValues = {
  // add all fields here, from all steps
  id?: string;
  title?: string;
  location?: {
    formattedAddress?: string;
    lat?: number;
    lng?: number;
    name?: string;
    placeId?: string;
  };
  startDateTime?: any;
  endDateTime?: any;
  category?: string;
  isHostedExternally?: boolean;
  description?: string;
  image?: string;
  imageUrl?: string;
  maxAttendees?: number;
  price?: string;
  isFree?: boolean;
  externalRegistrationUrl?: string;
  isExternal?: boolean;
  sourceType?: string;
  sourceId?: string;
};

interface EventFormContextValue {
  mode: "create" | "edit";
  defaultValues?: EventFormValues;
  clearFormData: () => void;
}

const EventFormContext = createContext<EventFormContextValue | null>(null);

export const useEventFormContext = () => {
  const context = useContext(EventFormContext);
  if (!context)
    throw new Error("useEventFormContext must be used within provider");
  return context;
};

export const EventFormProvider = ({
  children,
  mode,
  defaultValues = {},
}: {
  children: ReactNode;
  mode: "create" | "edit";
  defaultValues?: EventFormValues;
}) => {
  // Round up to the nearest hour for better UX
  const currentTime = now(getLocalTimeZone());
  const roundedStartTime = currentTime
    .set({
      minute: 0,
      second: 0,
      millisecond: 0,
    })
    .add({ hours: 1 });

  // Load stored form data if in create mode
  const storedData = mode === "create" ? loadFormDataFromStorage() : null;

  // Set proper default values for form initialization
  const formDefaultValues: EventFormValues = {
    startDateTime: roundedStartTime,
    endDateTime: roundedStartTime.add({ hours: 1 }),
    isHostedExternally: false,
    isFree: false,
    ...defaultValues,
  };

  // Only merge stored data if it has valid dates
  if (storedData) {
    // Validate that stored dates are valid ZonedDateTime objects
    const hasValidStartDate =
      storedData.startDateTime &&
      typeof storedData.startDateTime === "object" &&
      typeof storedData.startDateTime.toDate === "function";

    const hasValidEndDate =
      storedData.endDateTime &&
      typeof storedData.endDateTime === "object" &&
      typeof storedData.endDateTime.toDate === "function";

    // Merge stored data, but use defaults for invalid dates
    Object.assign(formDefaultValues, {
      ...storedData,
      startDateTime: hasValidStartDate
        ? storedData.startDateTime
        : formDefaultValues.startDateTime,
      endDateTime: hasValidEndDate
        ? storedData.endDateTime
        : formDefaultValues.endDateTime,
    });
  }

  const methods = useForm<EventFormValues>({
    defaultValues: formDefaultValues,
    mode: "onChange", // Enable onChange validation for better UX
  });

  // Auto-save form data when it changes (only in create mode)
  useEffect(() => {
    if (mode === "create") {
      const subscription = methods.watch((data) => {
        // Only save if we have valid data
        if (data && typeof data === "object") {
          saveFormDataToStorage(data as EventFormValues);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [methods, mode]);

  const clearFormData = () => {
    clearFormDataFromStorage();
    methods.reset(formDefaultValues);
  };

  return (
    <EventFormContext.Provider
      value={{ mode, defaultValues: formDefaultValues, clearFormData }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </EventFormContext.Provider>
  );
};
