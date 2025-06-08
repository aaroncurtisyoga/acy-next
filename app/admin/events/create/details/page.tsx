"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";
import EventFormWrapper from "@/app/admin/events/_components/EventForm/EventFormWrapper";
import DetailsForExternallyHostedEvent from "@/app/admin/events/_components/EventForm/Steps/DetailsForExternallyHostedEvent";
import DetailsForInternallyHostedEvent from "@/app/admin/events/_components/EventForm/Steps/DetailsForInternallyHostedEvent";

const DetailsStep = () => {
  const { control } = useFormContext<EventFormValues>();
  const isHostedExternally = useWatch({
    control,
    name: "isHostedExternally",
  });

  return isHostedExternally ? (
    <DetailsForExternallyHostedEvent />
  ) : (
    <DetailsForInternallyHostedEvent />
  );
};

const CreateEventFormDetails = () => {
  return (
    <section className={"wrapper"}>
      <h1>Create Event</h1>
      <div className={"my-8"}>
        <EventFormWrapper mode="create">
          <DetailsStep />
        </EventFormWrapper>
      </div>
    </section>
  );
};

export default CreateEventFormDetails;
