"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Link as NextUiLink } from "@nextui-org/react";
import { Event } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  selectFormValues,
  setFormData,
} from "@/app/_lib/redux/features/eventFormSlice";
import { useAppDispatch, useAppSelector } from "@/app/_lib/redux/hooks";
import { EventFormDetailsForExternallyHostedEventSchema } from "@/app/_lib/schema";
import ExternalRegistrationUrlInput from "@/app/admin/events/_components/EventForm/Fields/ExternalRegistrationUrlInput";

export type Inputs = z.infer<
  typeof EventFormDetailsForExternallyHostedEventSchema
>;

interface BasicInfoProps {
  event?: Event;
}
const DetailsForExternallyHostedEvent: FC<BasicInfoProps> = ({ event }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  // todo: only select the items that I need here, not the whole form
  const eventInitialValues = useAppSelector(selectFormValues);
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
        <Button type={"submit"} color={"primary"}>
          Next
        </Button>
      </div>
    </form>
  );
};

export default DetailsForExternallyHostedEvent;
