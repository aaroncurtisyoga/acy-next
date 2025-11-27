"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { X } from "lucide-react";
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
  const router = useRouter();

  return (
    <section className={"wrapper"}>
      <div className="flex items-center justify-between mb-6">
        <h1>Create Event</h1>
        <Button
          isIconOnly
          variant="light"
          onPress={() => router.push("/admin/events")}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      <div className={"my-8"}>
        <EventFormWrapper mode="create">
          <DetailsStep />
        </EventFormWrapper>
      </div>
    </section>
  );
};

export default CreateEventFormDetails;
