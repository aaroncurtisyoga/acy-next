"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import EventFormStepButtons from "@/components/events/EventForm/Steps/Shared/EventFormStepButtons";
import BasicInfo from "@/components/events/EventForm/Steps/BasicInfo";
import EventFormStepThree from "@/components/events/EventForm/Steps/EventFormStepThree";
import EventFormStepTwo from "@/components/events/EventForm/Steps/DetailsForInternallyHostedEvent";
import HeaderForEachStep from "@/components/events/EventForm/Steps/Shared/HeaderForEachStep";

import {} from "@/lib/schema";
import { eventFormDefaultValues, getEventFormSteps } from "@/constants";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import { handleError } from "@/lib/utils";
import "react-datepicker/dist/react-datepicker.css";

type Inputs = z.infer<typeof EventFormSchema>;
type FieldName = keyof Inputs;

type EventFormProps = {
  event?: IEvent;
  type: "Create" | "Update";
};

const EventForm = ({ event, type }: EventFormProps) => {
  const router = useRouter();
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;
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
    const eventFormSteps = getEventFormSteps(getValues("isHostedExternally"));
    const fields = eventFormSteps[currentStep].fields;

    const formStepValid = await trigger(fields as FieldName[], {
      shouldFocus: true,
    });
    if (formStepValid === false) {
      return;
    }

    if (currentStep < eventFormSteps.length - 1) {
      if (currentStep === eventFormSteps.length - 2) {
        await handleSubmit(onSubmit)();
      }
      setPreviousStep(currentStep);
      setCurrentStep(currentStep + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
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
        values.isHostedExternally
          ? router.push(`/`)
          : router.push(`/events/${newEvent._id}`);
      }
    } catch (error) {
      handleError(error);
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
      {currentStep === 0 && (
        <motion.div
          initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <HeaderForEachStep currentStep={currentStep} />
          <BasicInfo
            control={control}
            isSubmitting={isSubmitting}
            errors={errors}
            setValue={setValue}
          />
        </motion.div>
      )}

      {currentStep === 1 && (
        <motion.div
          initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <HeaderForEachStep currentStep={currentStep} />
          <EventFormStepTwo
            control={control}
            isHostedExternally={getValues("isHostedExternally")}
            errors={errors}
            isSubmitting={isSubmitting}
            setValue={setValue}
          />
        </motion.div>
      )}

      {currentStep === 2 && <EventFormStepThree />}

      <EventFormStepButtons next={next} prev={prev} />
    </form>
  );
};

export default EventForm;
