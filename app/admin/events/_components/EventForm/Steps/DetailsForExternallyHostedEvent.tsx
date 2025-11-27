"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Link as HeroUiLink } from "@heroui/link";
import { useFormContext } from "react-hook-form";
import {
  EventFormValues,
  useEventFormContext,
} from "@/app/admin/events/_components/EventForm/EventFormProvider";
// External registration URL is now handled in BasicInfo step

const DetailsForExternallyHostedEvent: FC = () => {
  const router = useRouter();
  const { mode } = useEventFormContext();
  const { handleSubmit } = useFormContext<EventFormValues>();

  const onSubmit = async (data: EventFormValues) => {
    const eventId = data.id;
    const nextStepUrl =
      mode === "edit"
        ? `/admin/events/${eventId}/edit/submit`
        : `/admin/events/create/submit`;
    router.push(nextStepUrl);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-5">
        <div className="p-4 bg-default-100 rounded-lg">
          <p className="text-default-600">
            For externally hosted events, you&apos;ve already specified the
            registration URL in the previous step. Click Next to proceed to the
            final review.
          </p>
        </div>
      </div>
      <div className="flex justify-between mt-5">
        <Button type="button">
          <HeroUiLink
            href={mode === "edit" ? "../" : "/admin/events/create"}
            className="text-default-foreground"
          >
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
