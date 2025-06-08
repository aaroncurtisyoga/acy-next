"use client";

import { FC, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Link as HeroUiLink } from "@heroui/react";
import { useFormContext } from "react-hook-form";
import { createEvent } from "@/app/_lib/actions/event.actions";
import { handleError } from "@/app/_lib/utils";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";
import EventFormWrapper from "@/app/admin/events/_components/EventForm/EventFormWrapper";

const SubmitStep: FC = () => {
  const router = useRouter();
  const { getValues, reset } = useFormContext<EventFormValues>();

  async function createNewEvent() {
    const formValues = getValues();

    try {
      const newEvent = await createEvent({
        event: formValues,
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

  return (
    <section className="wrapper">
      <h1>Review Event</h1>
      <form onSubmit={onSubmit}>
        <div className="flex justify-between mt-5">
          <Button type="button">
            <HeroUiLink
              href="/events/create/details"
              className="text-default-foreground"
            >
              Previous
            </HeroUiLink>
          </Button>
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
