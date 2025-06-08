import { useFormContext } from "react-hook-form";
import { useEventFormContext } from "./EventFormProvider";
import { EventFormValues } from "./EventFormProvider";

export const useEventForm = () => {
  const form = useFormContext<EventFormValues>();
  const ctx = useEventFormContext();

  return {
    ...form,
    mode: ctx.mode,
    defaultValues: ctx.defaultValues,
  };
};
