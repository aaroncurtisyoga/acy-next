"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Button, Link as HeroUiLink } from "@heroui/react";
import { useFormContext } from "react-hook-form";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";
import ExternalRegistrationUrlInput from "@/app/admin/events/_components/EventForm/Fields/ExternalRegistrationUrlInput";

const DetailsForExternallyHostedEvent: FC = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useFormContext<EventFormValues>();

  const onSubmit = async () => {
    router.push("/events/create/submit"); // dynamic if needed
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-5">
        <ExternalRegistrationUrlInput
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
        />
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

export default DetailsForExternallyHostedEvent;
