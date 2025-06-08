"use client";

import { ReactNode } from "react";
import {
  EventFormProvider,
  EventFormValues,
} from "@/app/admin/events/_components/EventForm/EventFormProvider";

export default function EventFormWrapper({
  children,
  mode,
  defaultValues,
}: {
  children: ReactNode;
  mode: "create" | "edit";
  defaultValues?: EventFormValues;
}) {
  return (
    <EventFormProvider mode={mode} defaultValues={defaultValues}>
      {children}
    </EventFormProvider>
  );
}
