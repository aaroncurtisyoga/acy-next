"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, addToast } from "@heroui/react";
import { Link as HeroUiLink } from "@heroui/react";
import { X } from "lucide-react";
import { createEvent, updateEvent } from "@/app/_lib/actions/event.actions";
import { handleError } from "@/app/_lib/utils";
import { useEventForm } from "@/app/admin/events/_components/EventForm/useEventForm";

const SubmitStep = () => {
  const router = useRouter();
  const { getValues, reset, mode } = useEventForm();
  const values = getValues();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "edit" && values.id) {
        const updated = await updateEvent({
          event: values,
          path: `/admin/events`,
        });
        if (updated) {
          reset();
          addToast({
            title: "Success",
            description: "Event updated successfully",
            color: "success",
            timeout: 3000,
            shouldShowTimeoutProgress: true,
          });
          router.push("/admin/events");
        }
      } else {
        const created = await createEvent({
          event: values as any,
          path: "/events",
        });
        if (created) {
          reset();
          addToast({
            title: "Success",
            description: "Event created successfully",
            color: "success",
            timeout: 3000,
            shouldShowTimeoutProgress: true,
          });
          router.push("/admin/events");
        }
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <section className="wrapper relative">
      {/* Close button in top-right corner */}
      <Button
        isIconOnly
        variant="light"
        className="absolute -top-2 -right-2 z-10"
        onPress={() => router.push("/admin/events")}
        aria-label="Close"
      >
        <X size={20} />
      </Button>

      <h1>Review Event</h1>
      <form onSubmit={onSubmit}>
        <div className="flex justify-between mt-5">
          <Button type="button">
            <HeroUiLink
              href={
                mode === "edit"
                  ? `/events/${values.id}/edit/details`
                  : "/events/create/details"
              }
              className="text-default-foreground"
            >
              Previous
            </HeroUiLink>
          </Button>
          <Button type="submit" color="primary">
            {mode === "edit" ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default SubmitStep;
