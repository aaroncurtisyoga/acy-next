"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link as NextUiLink } from "@nextui-org/link";
import { Button } from "@nextui-org/react";
import { Event } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  selectFormValues,
  setFormData,
} from "@/_lib/redux/features/eventFormSlice";
import { useAppDispatch, useAppSelector } from "@/_lib/redux/hooks";
import { EventFormDetailsForInternallyHostedEventSchema } from "@/_lib/schema";
import DescriptionRichTextEditor from "@/app/admin/events/_components/EventForm/Fields/DescriptionRichTextEditor";
import ImagePicker from "@/app/admin/events/_components/EventForm/Fields/ImagePicker";
import MaxAttendees from "@/app/admin/events/_components/EventForm/Fields/MaxAttendees";
import PriceInput from "@/app/admin/events/_components/EventForm/Fields/PriceInput";

export type Inputs = z.infer<
  typeof EventFormDetailsForInternallyHostedEventSchema
>;

interface BasicInfoProps {
  event?: Event;
}
const DetailsForInternallyHostedEvent: FC<BasicInfoProps> = ({ event }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  // todo: only select the items that I need here, not the whole form
  const eventInitialValues = useAppSelector(selectFormValues);
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
        <Button type={"submit"} color={"primary"}>
          Next
        </Button>
      </div>
    </form>
  );
};

export default DetailsForInternallyHostedEvent;
