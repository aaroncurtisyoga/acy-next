"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Link as HeroUiLink, addToast } from "@heroui/react";
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
        addToast({
          title: "Success",
          description: "Event updated successfully",
          color: "success",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
        router.push("/admin/events");
      }
    } catch (error) {
      console.error("Failed to update event:", error);
      addToast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
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
        isIconOnly
        variant="light"
        className="absolute -top-2 -right-2 z-10"
        onPress={() => router.push("/admin/events")}
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
          <Button type="button">
            <HeroUiLink
              href={mode === "edit" ? "../" : "/admin/events/create"}
              className="text-default-foreground"
            >
              Previous
            </HeroUiLink>
          </Button>
          <div className="flex gap-2">
            {mode === "edit" && (
              <Button
                type="button"
                color="success"
                variant="flat"
                onPress={() => handleSubmit(handleUpdateNow)()}
                isLoading={isUpdating}
                isDisabled={!isDirty || isSubmitting}
              >
                Update Now
              </Button>
            )}
            <Button type="submit" color="primary" isDisabled={isUpdating}>
              Next
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DetailsForInternallyHostedEvent;
