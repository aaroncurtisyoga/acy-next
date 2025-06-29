"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Button, Link as HeroUiLink } from "@heroui/react";
import { useFormContext } from "react-hook-form";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";
import DescriptionRichTextEditor from "@/app/admin/events/_components/EventForm/Fields/DescriptionRichTextEditor";
import ImagePicker from "@/app/admin/events/_components/EventForm/Fields/ImagePicker";
import MaxAttendees from "@/app/admin/events/_components/EventForm/Fields/MaxAttendees";
import PriceInput from "@/app/admin/events/_components/EventForm/Fields/PriceInput";

const DetailsForInternallyHostedEvent: FC = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useFormContext<EventFormValues>();

  const onSubmit = async () => {
    router.push("/events/create/submit"); // dynamic if needed
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-5">
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
      <div className="grid grid-cols-1 gap-5 mt-5">
        <DescriptionRichTextEditor control={control} errors={errors} />
      </div>
      <div className="flex justify-between mt-5">
        <Button type="button">
          <HeroUiLink href="/events/create" className="text-default-foreground">
            Previous
          </HeroUiLink>
        </Button>
        <Button type="submit" color="primary">
          Next
        </Button>
      </div>
    </form>
  );
};

export default DetailsForInternallyHostedEvent;
