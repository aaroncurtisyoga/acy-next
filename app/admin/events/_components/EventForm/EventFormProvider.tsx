"use client";

import { createContext, useContext } from "react";
import { ReactNode } from "react";
import { useForm, FormProvider } from "react-hook-form";

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
  externalRegistrationUrl?: string;
};

interface EventFormContextValue {
  mode: "create" | "edit";
  defaultValues?: EventFormValues;
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
  const methods = useForm<EventFormValues>({ defaultValues });

  return (
    <EventFormContext.Provider value={{ mode, defaultValues }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </EventFormContext.Provider>
  );
};
