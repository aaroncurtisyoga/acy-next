"use client";

import { useRouter } from "next/navigation";
import { FC } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import Category from "@/components/events/EventForm/Fields/Category";
import EndDatePickerInput from "@/components/events/EventForm/Fields/EndDatePickerInput";
import IsHostedExternallyCheckbox from "@/components/events/EventForm/Fields/IsHostedExternallyCheckbox";
import LocationInput from "@/components/events/EventForm/Fields/LocationInput";
import StartDatePickerInput from "@/components/events/EventForm/Fields/StartDatePickerInput";
import TitleInput from "@/components/events/EventForm/Fields/TitleInput";
import { EventFormBasicInfoSchema } from "@/lib/schema";
import { eventFormBasicInfoDefaultValues } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  selectFormValues,
  setFormData,
} from "@/lib/redux/features/eventFormSlice";
import { IEvent } from "@/lib/mongodb/database/models/event.model";

export type Inputs = z.infer<typeof EventFormBasicInfoSchema>;

interface EventFormStepOneProps {
  event?: IEvent;
  type: "Create" | "Update";
}
const BasicInfo: FC<EventFormStepOneProps> = ({ event, type }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const formValuesFromRedux = useAppSelector(selectFormValues);
  const isUpdateAndEventExists = type === "Update" && event;
  const eventInitialValues = isUpdateAndEventExists
    ? {
        ...event,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
      }
    : formValuesFromRedux;
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(EventFormBasicInfoSchema),
    defaultValues: eventInitialValues,
  });
  const onSubmit = async (data) => {
    // Convert Date objects to ISO strings
    const payload = {
      ...data,
      startDateTime: data.startDateTime.toISOString(),
      endDateTime: data.endDateTime.toISOString(),
    };
    dispatch(setFormData(payload));
    router.push("/events/create/details");
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
        <Category
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
        />
        <IsHostedExternallyCheckbox
          control={control}
          isSubmitting={isSubmitting}
        />
      </div>
      <Button type={"submit"} className={"mt-5"}>
        Next
      </Button>
    </form>
  );
};

export default BasicInfo;
