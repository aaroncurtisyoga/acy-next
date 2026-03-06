"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import {
  EventFormValues,
  useEventFormContext,
} from "@/app/admin/events/_components/EventForm/EventFormProvider";
import DescriptionRichTextEditor from "@/app/admin/events/_components/EventForm/Fields/DescriptionRichTextEditor";
import ImagePicker from "@/app/admin/events/_components/EventForm/Fields/ImagePicker";
import MaxAttendees from "@/app/admin/events/_components/EventForm/Fields/MaxAttendees";

const DetailsForInternallyHostedEvent: FC = () => {
  const router = useRouter();
  const { mode } = useEventFormContext();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useFormContext<EventFormValues>();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateNow = async (data: EventFormValues) => {
    if (mode !== "edit" || !data.id) return;

    setIsUpdating(true);
    try {
      const { updateEvent } = await import("@/app/_lib/actions/event.actions");
      const updated = await updateEvent({
        event: data,
        path: `/admin/events`,
      });
      if (updated) {
        toast.success("Event updated successfully");
        router.push("/admin/events");
      }
    } catch (error) {
      console.error("Failed to update event:", error);
      toast.error("Failed to update event. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const onSubmit = async (data: EventFormValues) => {
    const eventId = data.id;
    const nextStepUrl =
      mode === "edit"
        ? `/admin/events/${eventId}/edit/submit`
        : `/admin/events/create/submit`;
    router.push(nextStepUrl);
  };

  return (
    <div className="relative">
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-5">
            <MaxAttendees
              control={control}
              errors={errors}
              isSubmitting={isSubmitting}
            />
          </div>
          <div className="space-y-5">
            <ImagePicker
              errors={errors}
              setValue={setValue}
              control={control}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 mt-5">
          <DescriptionRichTextEditor control={control} errors={errors} />
        </div>
        <div className="flex justify-between mt-5">
          <Button type="button" asChild>
            <Link href={mode === "edit" ? "../" : "/admin/events/create"}>
              Previous
            </Link>
          </Button>
          <div className="flex gap-2">
            {mode === "edit" && (
              <Button
                type="button"
                variant="secondary"
                className="text-green-600 hover:text-green-700"
                onClick={() => handleSubmit(handleUpdateNow)()}
                disabled={isUpdating || !isDirty || isSubmitting}
              >
                {isUpdating && <Loader2 className="animate-spin" size={16} />}
                Update Now
              </Button>
            )}
            <Button type="submit" disabled={isUpdating}>
              Next
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DetailsForInternallyHostedEvent;
