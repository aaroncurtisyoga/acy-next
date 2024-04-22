"use client";

import { useRouter } from "next/navigation";
import { FC } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventFormDetailsSchema } from "@/lib/schema";
import { eventFormStepOneDefaultValues } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setFormData } from "@/lib/redux/eventForm/eventFormSlice";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import ExternalRegistrationUrlInput from "@/components/events/EventForm/Fields/ExternalRegistrationUrlInput";
import Category from "@/components/events/EventForm/Fields/Category";
import PriceInput from "@/components/events/EventForm/Fields/PriceInput";
import MaxAttendees from "@/components/events/EventForm/Fields/MaxAttendees";
import ImagePicker from "@/components/events/EventForm/Fields/ImagePicker";
import DescriptionRichTextEditor from "@/components/events/EventForm/Fields/DescriptionRichTextEditor";
export type Inputs = z.infer<typeof EventFormDetailsSchema>;

interface EventFormStepOneProps {
  event?: IEvent;
  type: "Create" | "Update";
}
const BasicInfo: FC<EventFormStepOneProps> = ({ event, type }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isUpdateAndEventExists = type === "Update" && event;
  const eventInitialValues = isUpdateAndEventExists
    ? {
        ...event,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
      }
    : eventFormStepOneDefaultValues;
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(EventFormDetailsSchema),
    defaultValues: eventInitialValues,
  });
  const onSubmit = async (data) => {
    dispatch(setFormData(data));
    router.push("/events/create/details");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* todo: grab that value from store */}
      {isHostedExternally ? (
        <div className={"grid grid-cols-2 gap-5"}>
          <ExternalRegistrationUrlInput
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
          />
          <Category
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
          />
        </div>
      ) : (
        <>
          <div className={"grid grid-cols-2 gap-5"}>
            <Category
              control={control}
              errors={errors}
              isSubmitting={isSubmitting}
            />
            <PriceInput
              control={control}
              isSubmitting={isSubmitting}
              errors={errors}
            />
            <MaxAttendees
              control={control}
              errors={errors}
              isSubmitting={isSubmitting}
            />
            <ImagePicker errors={errors} setValue={setValue} />
          </div>
          <div className={"grid grid-cols-1 gap-5 my-5"}>
            <DescriptionRichTextEditor control={control} errors={errors} />
          </div>
        </>
      )}
      <button type={"submit"}>submit</button>
    </form>
  );
};

export default BasicInfo;
