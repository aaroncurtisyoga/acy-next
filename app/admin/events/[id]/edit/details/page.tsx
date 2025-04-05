"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormContext, useWatch } from "react-hook-form";
import { getEventById } from "@/app/_lib/actions/event.actions";
import { handleError } from "@/app/_lib/utils";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";
import EventFormWrapper from "@/app/admin/events/_components/EventForm/EventFormWrapper";
import DetailsForExternallyHostedEvent from "@/app/admin/events/_components/EventForm/Steps/DetailsForExternallyHostedEvent";
import DetailsForInternallyHostedEvent from "@/app/admin/events/_components/EventForm/Steps/DetailsForInternallyHostedEvent";

const DetailsStep = () => {
  const { control } = useFormContext<EventFormValues>();
  const isHostedExternally = useWatch({ control, name: "isHostedExternally" });

  return isHostedExternally ? (
    <DetailsForExternallyHostedEvent />
  ) : (
    <DetailsForInternallyHostedEvent />
  );
};

const EditDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<EventFormValues | null>(
    null,
  );

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const event = await getEventById(id);
        setDefaultValues(event);
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
      <DetailsStep />
    </EventFormWrapper>
  );
};

export default EditDetailsPage;
