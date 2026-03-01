"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
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
          toast.success("Event updated successfully");
          router.push("/admin/events");
        }
      } else {
        const created = await createEvent({
          event: values as any,
          path: "/events",
        });
        if (created) {
          reset();
          toast.success("Event created successfully");
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
        size="icon"
        variant="ghost"
        className="absolute -top-2 -right-2 z-10"
        onClick={() => router.push("/admin/events")}
        aria-label="Close"
      >
        <X size={20} />
      </Button>

      <h1>Review Event</h1>
      <form onSubmit={onSubmit}>
        <div className="flex justify-between mt-5">
          <Button type="button" asChild>
            <Link
              href={
                mode === "edit"
                  ? `/events/${values.id}/edit/details`
                  : "/events/create/details"
              }
            >
              Previous
            </Link>
          </Button>
          <Button type="submit">
            {mode === "edit" ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default SubmitStep;
