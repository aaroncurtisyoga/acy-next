"use client";

import { selectIsHostedExternally } from "@/app/_lib/redux/features/eventFormSlice";
import { useAppSelector } from "@/app/_lib/redux/hooks";
import DetailsForExternallyHostedEvent from "@/app/admin/events/_components/EventForm/Steps/DetailsForExternallyHostedEvent";
import DetailsForInternallyHostedEvent from "@/app/admin/events/_components/EventForm/Steps/DetailsForInternallyHostedEvent";

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
