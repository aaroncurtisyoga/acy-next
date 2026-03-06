"use client";

import { createContext, useContext, useEffect } from "react";
import { ReactNode } from "react";
import { useForm, FormProvider } from "react-hook-form";

const FORM_STORAGE_KEY = "eventFormData";

// Helper functions for form persistence
const saveFormDataToStorage = (data: EventFormValues) => {
  if (typeof window !== "undefined") {
    try {
      const serializable = {
        ...data,
        startDateTime:
          data.startDateTime instanceof Date
            ? data.startDateTime.toISOString()
            : data.startDateTime,
        endDateTime:
          data.endDateTime instanceof Date
            ? data.endDateTime.toISOString()
            : data.endDateTime,
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
        // Convert date strings back to Date objects
        if (parsed.startDateTime && typeof parsed.startDateTime === "string") {
          try {
            parsed.startDateTime = new Date(parsed.startDateTime);
          } catch (e) {
            console.warn("Failed to parse startDateTime:", e);
            delete parsed.startDateTime;
          }
        }
        if (parsed.endDateTime && typeof parsed.endDateTime === "string") {
          try {
            parsed.endDateTime = new Date(parsed.endDateTime);
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
  const now = new Date();
  const roundedStart = new Date(now);
  roundedStart.setMinutes(0, 0, 0);
  roundedStart.setHours(roundedStart.getHours() + 1);

  const roundedEnd = new Date(roundedStart);
  roundedEnd.setHours(roundedEnd.getHours() + 1);

  // Load stored form data if in create mode
  const storedData = mode === "create" ? loadFormDataFromStorage() : null;

  // Set proper default values for form initialization
  const formDefaultValues: EventFormValues = {
    startDateTime: roundedStart,
    endDateTime: roundedEnd,
    isHostedExternally: false,
    isFree: false,
    ...defaultValues,
  };

  // Only merge stored data if it has valid dates
  if (storedData) {
    const hasValidStartDate =
      storedData.startDateTime instanceof Date &&
      !isNaN(storedData.startDateTime.getTime());

    const hasValidEndDate =
      storedData.endDateTime instanceof Date &&
      !isNaN(storedData.endDateTime.getTime());

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
    mode: "onChange",
  });

  // Auto-save form data when it changes (only in create mode)
  useEffect(() => {
    if (mode === "create") {
      // eslint-disable-next-line react-hooks/incompatible-library -- react-hook-form watch is safe here
      const subscription = methods.watch((data) => {
        if (data && typeof data === "object") {
          saveFormDataToStorage(data as EventFormValues);
        }
      });
      return () => subscription.unsubscribe();
    }
    return () => {};
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
