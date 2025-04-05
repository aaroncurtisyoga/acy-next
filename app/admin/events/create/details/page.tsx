"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";
import EventFormWrapper from "@/app/admin/events/_components/EventForm/EventFormWrapper";
import DetailsForExternallyHostedEvent from "@/app/admin/events/_components/EventForm/Steps/DetailsForExternallyHostedEvent";
import DetailsForInternallyHostedEvent from "@/app/admin/events/_components/EventForm/Steps/DetailsForInternallyHostedEvent";

const CreateDetailsPage = () => {
  const { control } = useFormContext<EventFormValues>();
  const isHostedExternally = useWatch({
    control,
    name: "isHostedExternally",
  });

  return (
    <section className={"wrapper"}>
      <h1>Create Event</h1>
      <div className={"my-8"}>
        <EventFormWrapper mode="create">
          {isHostedExternally ? (
            <DetailsForExternallyHostedEvent />
          ) : (
            <DetailsForInternallyHostedEvent />
          )}
        </EventFormWrapper>
      </div>
    </section>
  );
};

export default CreateDetailsPage;
