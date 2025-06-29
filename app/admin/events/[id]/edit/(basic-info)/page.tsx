"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEventById } from "@/app/_lib/actions/event.actions";
import { handleError } from "@/app/_lib/utils";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";
import EventFormWrapper from "@/app/admin/events/_components/EventForm/EventFormWrapper";
import BasicInfo from "@/app/admin/events/_components/EventForm/Steps/BasicInfo";

const EditBasicInfoPage = () => {
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
      <BasicInfo />
    </EventFormWrapper>
  );
};

export default EditBasicInfoPage;
