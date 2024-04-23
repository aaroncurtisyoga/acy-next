"use client";

import { useRouter } from "next/navigation";
import { FC } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventFormDetailsForExternallyHostedEventSchema } from "@/lib/schema";
import { eventFormDetailsForExternallyHostedEventDefaultValues } from "@/constants";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setFormData } from "@/lib/redux/eventForm/eventFormSlice";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import ExternalRegistrationUrlInput from "@/components/events/EventForm/Fields/ExternalRegistrationUrlInput";

export type Inputs = z.infer<
  typeof EventFormDetailsForExternallyHostedEventSchema
>;

interface BasicInfoProps {
  event?: IEvent;
  type: "Create" | "Update";
}
const DetailsForExternallyHostedEvent: FC<BasicInfoProps> = ({
  event,
  type,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isUpdateAndEventExists = type === "Update" && event;
  const eventInitialValues = isUpdateAndEventExists
    ? {
        ...event,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
      }
    : eventFormDetailsForExternallyHostedEventDefaultValues;
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(EventFormDetailsForExternallyHostedEventSchema),
    defaultValues: eventInitialValues,
  });
  const onSubmit = async (data) => {
    dispatch(setFormData(data));
    router.push("/events/create/details");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={"grid grid-cols-2 gap-5"}>
        <ExternalRegistrationUrlInput
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
        />
      </div>
      <button type={"submit"}>submit</button>
    </form>
  );
};

export default DetailsForExternallyHostedEvent;
