"use client";

import { useAppSelector } from "@/_lib/redux/hooks";
import { selectIsHostedExternally } from "@/_lib/redux/features/eventFormSlice";
import DetailsForExternallyHostedEvent from "@/app/admin/events/_components/EventForm/Steps/DetailsForExternallyHostedEvent";
import DetailsForInternallyHostedEvent from "@/app/admin/events/_components/EventForm/Steps/DetailsForInternallyHostedEvent";

const CreateEvent = () => {
  const isHostedExternally = useAppSelector(selectIsHostedExternally);

  return (
    <section className={"wrapper"}>
      <h1>Update Event</h1>
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
