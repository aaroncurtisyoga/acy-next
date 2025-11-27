"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { X } from "lucide-react";
import EventFormWrapper from "@/app/admin/events/_components/EventForm/EventFormWrapper";
import BasicInfo from "@/app/admin/events/_components/EventForm/Steps/BasicInfo";

const CreateEventFormBasicInfo: FC = () => {
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
          <BasicInfo />
        </EventFormWrapper>
      </div>
    </section>
  );
};

export default CreateEventFormBasicInfo;
