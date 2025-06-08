"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Link as HeroUiLink } from "@heroui/react";
import { useFormContext } from "react-hook-form";
import { updateEvent, getEventById } from "@/app/_lib/actions/event.actions";
import { handleError } from "@/app/_lib/utils";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";
import EventFormWrapper from "@/app/admin/events/_components/EventForm/EventFormWrapper";

const SubmitStep = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { getValues, reset } = useFormContext<EventFormValues>();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = getValues();

    try {
      const updated = await updateEvent({
        event: { ...values, id }, // assuming your backend expects `id`
        path: `/events/${id}`,
      });

      if (updated) {
        reset();
        router.push(`/events/${id}`);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <section className="wrapper">
      <h1>Review Event</h1>
      <form onSubmit={onSubmit}>
        <div className="flex justify-between mt-5">
          <Button type="button">
            <HeroUiLink
              href={`/events/${id}/edit/details`}
              className="text-default-foreground"
            >
              Previous
            </HeroUiLink>
          </Button>
          <Button type="submit" color="primary">
            Update Event
          </Button>
        </div>
      </form>
    </section>
  );
};

const EditSubmitPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<EventFormValues | null>(
    null,
  );

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const event = await getEventById(id);
        // Transform database event to form values
        const formValues: EventFormValues = {
          ...event,
          category:
            typeof event.category === "object"
              ? event.category.id
              : event.category,
          location: event.location
            ? {
                formattedAddress: event.location.formattedAddress,
                lat: event.location.lat,
                lng: event.location.lng,
                name: event.location.name,
                placeId: event.location.placeId,
              }
            : undefined,
        };
        setDefaultValues(formValues);
      } catch (err) {
        handleError(err);
        router.push("/");
      }
    };

    loadEvent();
  }, [id, router]);

  if (!defaultValues) return null;

  return (
    <EventFormWrapper mode="edit" defaultValues={defaultValues}>
      <SubmitStep />
    </EventFormWrapper>
  );
};

export default EditSubmitPage;
