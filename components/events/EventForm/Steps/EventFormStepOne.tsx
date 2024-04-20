"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EndDatePickerInput from "@/components/events/EventForm/Fields/EndDatePickerInput";
import IsHostedExternallyCheckbox from "@/components/events/EventForm/Fields/IsHostedExternallyCheckbox";
import LocationInput from "@/components/events/EventForm/Fields/LocationInput";
import StartDatePickerInput from "@/components/events/EventForm/Fields/StartDatePickerInput";
import TitleInput from "@/components/events/EventForm/Fields/TitleInput";
import { EventFormStepOneSchema } from "@/lib/schema";
import { eventFormStepOneDefaultValues } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setFormData } from "@/lib/redux/eventForm/eventFormSlice";
export type Inputs = z.infer<typeof EventFormStepOneSchema>;

const EventFormStepOne = ({ event, type }) => {
  const dispatch = useAppDispatch();
  const isUpdateAndEventExists = type === "Update" && event;
  const eventInitialValues = isUpdateAndEventExists
    ? {
        ...event,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
      }
    : eventFormStepOneDefaultValues;
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(EventFormStepOneSchema),
    defaultValues: eventInitialValues,
  });
  const onSubmit = async (data) => {
    console.log(data);
    dispatch(setFormData(data));
    //   todo: push to the next step
    //   router.push("/events/create/details");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
        <button type={"submit"}>submit</button>
      </div>
    </form>
  );
};

export default EventFormStepOne;
