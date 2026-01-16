"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";
import DetailsForExternallyHostedEvent from "@/app/admin/events/_components/EventForm/Steps/DetailsForExternallyHostedEvent";
import DetailsForInternallyHostedEvent from "@/app/admin/events/_components/EventForm/Steps/DetailsForInternallyHostedEvent";

/**
 * Edit event - Details step
 * Data is fetched once in the layout and passed via EventFormProvider context
 * This page conditionally renders based on isHostedExternally form value
 */
export default function EditDetailsPage() {
  const { control } = useFormContext<EventFormValues>();
  const isHostedExternally = useWatch({ control, name: "isHostedExternally" });

  return isHostedExternally ? (
    <DetailsForExternallyHostedEvent />
  ) : (
    <DetailsForInternallyHostedEvent />
  );
}
