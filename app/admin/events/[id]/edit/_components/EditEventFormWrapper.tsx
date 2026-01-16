"use client";

import { ReactNode } from "react";
import { fromDate, getLocalTimeZone } from "@internationalized/date";
import {
  EventFormProvider,
  EventFormValues,
} from "@/app/admin/events/_components/EventForm/EventFormProvider";
import type { SerializedEventData } from "../_types";

interface EditEventFormWrapperProps {
  children: ReactNode;
  eventData: SerializedEventData;
}

/**
 * Client component that transforms serialized event data into form values.
 * This handles the conversion of ISO date strings to ZonedDateTime objects.
 */
export default function EditEventFormWrapper({
  children,
  eventData,
}: EditEventFormWrapperProps) {
  // Transform serialized data to form values
  const defaultValues: EventFormValues = {
    id: eventData.id,
    title: eventData.title,
    description: eventData.description ?? undefined,
    imageUrl: eventData.imageUrl ?? undefined,
    price: eventData.price ?? undefined,
    isFree: eventData.isFree,
    isHostedExternally: eventData.isHostedExternally,
    externalRegistrationUrl: eventData.externalRegistrationUrl ?? undefined,
    maxAttendees: eventData.maxAttendees ?? undefined,
    category: eventData.categoryId ?? undefined,
    location: eventData.location
      ? {
          formattedAddress: eventData.location.formattedAddress,
          lat: eventData.location.lat ?? undefined,
          lng: eventData.location.lng ?? undefined,
          name: eventData.location.name,
          placeId: eventData.location.placeId ?? undefined,
        }
      : undefined,
    // Convert ISO strings to ZonedDateTime objects
    startDateTime: eventData.startDateTime
      ? fromDate(new Date(eventData.startDateTime), getLocalTimeZone())
      : undefined,
    endDateTime: eventData.endDateTime
      ? fromDate(new Date(eventData.endDateTime), getLocalTimeZone())
      : undefined,
  };

  return (
    <EventFormProvider mode="edit" defaultValues={defaultValues}>
      {children}
    </EventFormProvider>
  );
}
