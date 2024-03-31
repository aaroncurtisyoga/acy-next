"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import * as z from "zod";

import Category from "@/components/events/EventForm/Category";
import Description from "@/components/events/EventForm/Description";
import EndDateTime from "@/components/events/EventForm/EndDate";
import ImagePicker from "@/components/events/EventForm/ImagePicker";
import IsHostedExternally from "@/components/events/EventForm/IsHostedExternally";
import Location from "@/components/events/EventForm/Location";
import Price from "@/components/events/EventForm/Price";
import StartDateTime from "@/components/events/EventForm/StartDateTime";
import Title from "@/components/events/EventForm/Title";

import { EventFormSchema } from "@/lib/schema";
import { eventDefaultValues } from "@/constants";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import "react-datepicker/dist/react-datepicker.css";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";

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
      <div className="grid grid-cols-2 gap-5">
        <Title control={control} isSubmitting={isSubmitting} errors={errors} />
        <Location control={control} setValue={setValue} errors={errors} />
        <StartDateTime
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
        />
        <EndDateTime
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
        />
        <IsHostedExternally
          control={control}
          isSubmitting={isSubmitting}
          errors={errors}
        />
      </div>

      {/* <Category
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
        />
        <Price control={control} isSubmitting={isSubmitting} errors={errors} />
        <ImagePicker errors={errors} setValue={setValue} />
      <Description
        control={control}
        isSubmitting={isSubmitting}
        errors={errors}
      />
      <Button color={"primary"} type="submit" className={"w-full"}>
        {type} Event
      </Button>*/}
    </form>
  );
};

export default EventForm;
