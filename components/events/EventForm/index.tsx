"use client";

import { eventFormDefaultValues } from "@/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import TitleInput from "@/components/events/EventForm/Fields/TitleInput";
import LocationInput from "@/components/events/EventForm/Fields/LocationInput";
import StartDatePickerInput from "@/components/events/EventForm/Fields/StartDatePickerInput";
import EndDatePickerInput from "@/components/events/EventForm/Fields/EndDatePickerInput";
import IsHostedExternallyCheckbox from "@/components/events/EventForm/Fields/IsHostedExternallyCheckbox";
import { EventFormBasicInfoSchema } from "@/lib/schema";

export type Inputs = z.infer<typeof EventFormBasicInfoSchema>;
type FieldName = keyof Inputs;
interface EventFormProps extends Inputs {
  type: "Create" | "Update";
}

const EventForm = ({ event, type }: EventFormProps) => {
  const isUpdateAndEventExists = type === "Update" && event;
  const eventInitialValues = isUpdateAndEventExists
    ? {
        ...event,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
      }
    : eventFormDefaultValues;
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(EventFormBasicInfoSchema),
    defaultValues: eventInitialValues,
  });

  const onSubmit = async () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col gap-5"}>
      <div className={"grid grid-cols-2 gap-5"}>
        <TitleInput
          control={control}
          isSubmitting={isSubmitting}
          errors={errors}
        />
        <LocationInput control={control} setValue={setValue} errors={errors} />
        <StartDatePickerInput
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
        />
        <EndDatePickerInput
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
        />
        <IsHostedExternallyCheckbox
          control={control}
          isSubmitting={isSubmitting}
        />
      </div>
    </form>
  );
};

export default EventForm;
