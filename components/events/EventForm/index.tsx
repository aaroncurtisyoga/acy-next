"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Pagination, Button } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { EventFormSchema } from "@/lib/schema";
import { eventDefaultValues } from "@/constants";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import "react-datepicker/dist/react-datepicker.css";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import EventFormStepOne from "@/components/events/EventForm/Steps/EventFormStepOne";

type EventFormProps = {
  event?: IEvent;
  type: "Create" | "Update";
};

const steps = [
  {
    id: "Step 1",
    name: "Event Overview",
  },
  {
    id: "Step 2",
    name: "Event Details",
  },
  {
    id: "Step 3",
    name: "Form Complete",
  },
];
const EventForm = ({ event, type }: EventFormProps) => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
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

  const next = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prev = () => {
    if (activeStep > 0) {
      setActiveStep((step) => step + 1);
    }
  };

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
      <Pagination total={3} color="primary" page={activeStep + 1} />
      <div className="grid grid-cols-2 gap-5">
        <EventFormStepOne
          control={control}
          isSubmitting={isSubmitting}
          errors={errors}
          setValue={setValue}
        />
      </div>
      <div className="flex justify-between mt-8">
        <Button size="sm" variant="flat" color="primary" onPress={() => prev()}>
          Previous
        </Button>
        <Button size="sm" variant="flat" color="primary" onPress={() => next()}>
          Next
        </Button>
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
