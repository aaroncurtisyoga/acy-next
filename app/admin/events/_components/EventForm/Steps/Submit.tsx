"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Link as HeroUiLink } from "@heroui/react";
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
          path: `/events/${values.id}`,
        });
        if (updated) {
          reset();
          router.push(`/events/${updated.id}`);
        }
      } else {
        const created = await createEvent({
          event: values,
          path: "/events",
        });
        if (created) {
          reset();
          router.push("/");
        }
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <section className="wrapper">
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
