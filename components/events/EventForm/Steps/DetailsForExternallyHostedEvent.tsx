"use client";

import { useRouter } from "next/navigation";
import { FC } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventFormDetailsForExternallyHostedEventSchema } from "@/lib/schema";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  selectFormValues,
  setFormData,
} from "@/lib/redux/features/eventFormSlice";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import ExternalRegistrationUrlInput from "@/components/events/EventForm/Fields/ExternalRegistrationUrlInput";
import { Button, Link as NextUiLink } from "@nextui-org/react";

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
    resolver: zodResolver(EventFormDetailsForExternallyHostedEventSchema),
    defaultValues: eventInitialValues,
  });
  const onSubmit = async (data) => {
    dispatch(setFormData(data));
    router.push("/events/create/submit");
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
            href={"/events/create"}
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
