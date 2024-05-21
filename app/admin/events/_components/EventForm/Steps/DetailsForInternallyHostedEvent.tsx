"use client";

import { useRouter } from "next/navigation";
import { FC } from "react";
import { Button } from "@nextui-org/react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link as NextUiLink } from "@nextui-org/link";
import { Event } from "@prisma/client";
import DescriptionRichTextEditor from "@/app/admin/events/_components/EventForm/Fields/DescriptionRichTextEditor";
import ImagePicker from "@/app/admin/events/_components/EventForm/Fields/ImagePicker";
import MaxAttendees from "@/app/admin/events/_components/EventForm/Fields/MaxAttendees";
import PriceInput from "@/app/admin/events/_components/EventForm/Fields/PriceInput";
import { EventFormDetailsForInternallyHostedEventSchema } from "@/lib/schema";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  selectEventType,
  selectFormValues,
  setFormData,
} from "@/lib/redux/features/eventFormSlice";

export type Inputs = z.infer<
  typeof EventFormDetailsForInternallyHostedEventSchema
>;

interface BasicInfoProps {
  event?: Event;
}
const DetailsForInternallyHostedEvent: FC<BasicInfoProps> = ({ event }) => {
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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(EventFormDetailsForInternallyHostedEventSchema),
    defaultValues: eventInitialValues,
  });

  const onSubmit = async (data) => {
    dispatch(setFormData(data));
    router.push("/admin/events/create/submit");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={"grid grid-cols-2 gap-5"}>
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
      <div className={"grid grid-cols-1 gap-5 mt-5"}>
        <DescriptionRichTextEditor control={control} errors={errors} />
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

export default DetailsForInternallyHostedEvent;
