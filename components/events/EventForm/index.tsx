"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import * as z from "zod";
import Category from "@/components/events/EventForm/Category";
import Description from "@/components/events/EventForm/Description";
import EndDate from "@/components/events/EventForm/EndDate";
import Location from "@/components/events/EventForm/Location";
import Price from "@/components/events/EventForm/Price";
import StartDate from "@/components/events/EventForm/StartDate";
import Title from "@/components/events/EventForm/Dates";
import { EventFormSchema } from "@/lib/schema";
import { eventDefaultValues } from "@/constants";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import "react-datepicker/dist/react-datepicker.css";

type EventFormProps = {
  event?: IEvent;
  type: "Create" | "Update";
};

const EventForm = ({ event, type }: EventFormProps) => {
  const router = useRouter();
  const isUpdateAndEventExists = type === "Update" && event;
  const eventInitialValues = isUpdateAndEventExists
    ? {
        ...event,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
      }
    : eventDefaultValues;
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof EventFormSchema>>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: eventInitialValues,
  });
  const watchStartDateTime = watch("startDateTime");

  useEffect(() => {
    if (watchStartDateTime > getValues("endDateTime")) {
      const startTimeStamp = watchStartDateTime.getTime();
      const oneHourInMilliseconds = 3600000;
      setValue("endDateTime", new Date(startTimeStamp + oneHourInMilliseconds));
    }
  }, [getValues, setValue, watchStartDateTime]);

  const onSubmit = async (data: z.infer<typeof EventFormSchema>) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Title control={control} isSubmitting={isSubmitting} errors={errors} />
      <Category control={control} errors={errors} />
      <Description
        control={control}
        isSubmitting={isSubmitting}
        errors={errors}
      />
      <Price control={control} isSubmitting={isSubmitting} errors={errors} />
      <StartDate control={control} isSubmitting={isSubmitting} />
      <EndDate control={control} isSubmitting={isSubmitting} />
      <Location control={control} setValue={setValue} />

      <Button color={"primary"} type="submit">
        {type} Event
      </Button>
    </form>
  );
};

export default EventForm;
