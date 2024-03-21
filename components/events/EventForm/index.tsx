"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import * as z from "zod";
import Category from "@/components/events/EventForm/Category";
import EndDate from "@/components/events/EventForm/EndDate";
import Location from "@/components/events/EventForm/Location";
import Price from "@/components/events/EventForm/Price";
import StartDate from "@/components/events/EventForm/StartDate";
import Title from "@/components/events/EventForm/Title";
import { EventFormSchema } from "@/lib/schema";
import { eventDefaultValues } from "@/constants";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import "react-datepicker/dist/react-datepicker.css";
import ImagePicker from "@/components/events/EventForm/ImagePicker";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import Description from "@/components/events/EventForm/Description";

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

  async function createNewEvent(values: z.infer<typeof EventFormSchema>) {
    try {
      const newEvent = await createEvent({ event: values, path: "/events" });

      if (newEvent) {
        reset();
        router.push(`/events/${newEvent._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function updateExistingEvent(values: z.infer<typeof EventFormSchema>) {
    try {
      const updatedEvent = await updateEvent({
        event: { ...values, _id: event._id },
        path: `/events/${event._id}`,
      });

      if (updatedEvent) {
        reset();
        router.push(`/events/${updatedEvent._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onSubmit = async (values: z.infer<typeof EventFormSchema>) => {
    if (type === "Create") {
      await createNewEvent(values);
    }

    if (type === "Update") {
      if (event._id) {
        await updateExistingEvent(values);
      } else {
        router.back();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col gap-5"}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        <Title control={control} isSubmitting={isSubmitting} errors={errors} />
        <Category
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
        />
        <Location control={control} setValue={setValue} errors={errors} />
        <StartDate
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
        />
        <EndDate
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
        />
        <Price control={control} isSubmitting={isSubmitting} errors={errors} />
        <ImagePicker errors={errors} setValue={setValue} />
      </div>
      <Description
        control={control}
        isSubmitting={isSubmitting}
        errors={errors}
      />
      <Button color={"primary"} type="submit" className={"w-full"}>
        {type} Event
      </Button>
    </form>
  );
};

export default EventForm;
