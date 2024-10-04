"use client";

import DetailsForExternallyHostedEvent from "@/app/admin/events/_components/EventForm/Steps/DetailsForExternallyHostedEvent";
import DetailsForInternallyHostedEvent from "@/app/admin/events/_components/EventForm/Steps/DetailsForInternallyHostedEvent";
import { selectIsHostedExternally } from "@/_lib/redux/features/eventFormSlice";
import { useAppSelector } from "@/_lib/redux/hooks";

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
