"use client";

import { useRouter } from "next/navigation";
import { FC } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Event } from "@prisma/client";
import { EventFormDetailsForExternallyHostedEventSchema } from "@/lib/schema";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  selectEventType,
  selectFormValues,
  setFormData,
} from "@/lib/redux/features/eventFormSlice";
import ExternalRegistrationUrlInput from "@/components/events/EventForm/Fields/ExternalRegistrationUrlInput";
import { Button, Link as NextUiLink } from "@nextui-org/react";

export type Inputs = z.infer<
  typeof EventFormDetailsForExternallyHostedEventSchema
>;

interface BasicInfoProps {
  event?: Event;
}
const DetailsForExternallyHostedEvent: FC<BasicInfoProps> = ({ event }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const eventType = useAppSelector(selectEventType);
  const formValuesFromRedux = useAppSelector(selectFormValues);
  const isUpdateAndEventExists = eventType === "Update" && event;
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
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(EventFormDetailsForExternallyHostedEventSchema),
    defaultValues: eventInitialValues,
  });
  const onSubmit = async (data) => {
    dispatch(setFormData(data));
    router.push("/admin/events/create/submit");
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
      <div className="flex justify-between mt-5">
        <Button type={"button"}>
          <NextUiLink
            href={"/events/create/submit"}
            className={"text-default-foreground"}
          >
            Previous
          </NextUiLink>
        </Button>
        <Button type={"submit"}>Next</Button>
      </div>
    </form>
  );
};

export default DetailsForExternallyHostedEvent;
