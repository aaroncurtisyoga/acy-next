"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import EventFormStepOne from "@/components/events/EventForm/Steps/EventFormStepOne";
import EventFormStepTwo from "@/components/events/EventForm/Steps/EventFormStepTwo";
import EventFormStepThree from "@/components/events/EventForm/Steps/EventFormStepThree";

import {
  EventFormSchemaForExternalRegistration,
  EventFormSchemaForInternalRegistration,
} from "@/lib/schema";
import { eventDefaultValues, eventFormSteps } from "@/constants";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import "react-datepicker/dist/react-datepicker.css";
import EventFormStepButtons from "@/components/events/EventForm/Steps/EventFormStepButtons";

const EventFormSchema = z.discriminatedUnion("isHostedExternally", [
  EventFormSchemaForExternalRegistration,
  EventFormSchemaForInternalRegistration,
]);

type Inputs = z.infer<typeof EventFormSchema>;
type FieldName = keyof Inputs;

type EventFormProps = {
  event?: IEvent;
  type: "Create" | "Update";
};

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
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: eventInitialValues,
  });
  const watchStartDateTime = watch("startDateTime");

  const next = async () => {
    const fields = eventFormSteps[activeStep].fields;
    const formStepValid = await trigger(fields as FieldName[], {
      shouldFocus: true,
    });
    if (formStepValid === false) {
      return;
    }

    if (activeStep < eventFormSteps.length - 1) {
      if (activeStep === eventFormSteps.length - 2) {
        await handleSubmit(onSubmit)();
      }
      setActiveStep(activeStep + 1);
    }
  };

  const prev = () => {
    if (activeStep > 0) {
      setActiveStep((step) => step - 1);
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
      <p className={"text-xl font-semibold leading-7 text-gray-900"}>
        {eventFormSteps[activeStep].id} - {eventFormSteps[activeStep].name}
      </p>

      {activeStep === 0 && (
        <EventFormStepOne
          control={control}
          isSubmitting={isSubmitting}
          errors={errors}
          setValue={setValue}
        />
      )}

      {activeStep === 1 && (
        <EventFormStepTwo
          control={control}
          isHostedExternally={getValues("isHostedExternally")}
          errors={errors}
          isSubmitting={isSubmitting}
          setValue={setValue}
        />
      )}

      {activeStep === 2 && <EventFormStepThree />}

      <EventFormStepButtons next={next} prev={prev} />
    </form>
  );
};

export default EventForm;
