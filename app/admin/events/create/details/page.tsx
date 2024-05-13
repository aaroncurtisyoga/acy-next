"use client";

import DetailsForInternallyHostedEvent from "@/components/events/EventForm/Steps/DetailsForInternallyHostedEvent";
import DetailsForExternallyHostedEvent from "@/components/events/EventForm/Steps/DetailsForExternallyHostedEvent";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectIsHostedExternally } from "@/lib/redux/features/eventFormSlice";

const CreateEvent = () => {
  const isHostedExternally = useAppSelector(selectIsHostedExternally);

  return (
    <section className={"wrapper"}>
      <h1>Create Event</h1>
      <div className={"my-8"}>
        {isHostedExternally ? (
          <DetailsForExternallyHostedEvent />
        ) : (
          <DetailsForInternallyHostedEvent />
        )}
      </div>
    </section>
  );
};

export default CreateEvent;
