"use client";

import { FC, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Link as HeroUiLink } from "@heroui/react";
import { useFormContext } from "react-hook-form";
import { createEvent } from "@/app/_lib/actions/event.actions";
import { CreateEventData } from "@/app/_lib/types/event";
import { handleError } from "@/app/_lib/utils";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";
import EventFormWrapper from "@/app/admin/events/_components/EventForm/EventFormWrapper";
import EventPreview from "@/app/admin/events/_components/EventPreview";

const SubmitStep: FC = () => {
  const router = useRouter();
  const { getValues, reset } = useFormContext<EventFormValues>();

  async function createNewEvent() {
    const formValues = getValues();

    try {
      const newEvent = await createEvent({
        event: formValues as CreateEventData,
        path: "/events",
      });

      if (newEvent) {
        reset(); // Clear form state
        router.push(`/`);
      }
    } catch (error) {
      handleError(error);
    }
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createNewEvent();
  };

  const handleCancel = () => {
    reset(); // Clear form state
    router.push("/admin/events"); // Go back to events list
  };

  const formValues = getValues();

  return (
    <section className="wrapper">
      <h1>Review Event</h1>

      {/* Display event preview */}
      <div className="my-6">
        <EventPreview event={formValues} />
      </div>

      <form onSubmit={onSubmit}>
        <div className="flex justify-between mt-5">
          <div className="flex gap-3">
            <Button type="button" variant="bordered" onPress={handleCancel}>
              Cancel
            </Button>
            <Button type="button">
              <HeroUiLink
                href="/admin/events/create/details"
                className="text-default-foreground"
              >
                Previous
              </HeroUiLink>
            </Button>
          </div>
          <Button type="submit" color="primary">
            Create Event
          </Button>
        </div>
      </form>
    </section>
  );
};

const CreateEventFormSubmit: FC = () => {
  return (
    <EventFormWrapper mode="create">
      <SubmitStep />
    </EventFormWrapper>
  );
};

export default CreateEventFormSubmit;
