"use client";

import { FC, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, addToast } from "@heroui/react";
import { parseZonedDateTime } from "@internationalized/date";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { PlaceDetails } from "@/app/_lib/types";
import {
  EventFormValues,
  useEventFormContext,
} from "@/app/admin/events/_components/EventForm/EventFormProvider";
import Category from "@/app/admin/events/_components/EventForm/Fields/Category";
import EndDatePickerInput from "@/app/admin/events/_components/EventForm/Fields/EndDatePickerInput";
import LocationInput from "@/app/admin/events/_components/EventForm/Fields/LocationInput";
import StartDatePickerInput from "@/app/admin/events/_components/EventForm/Fields/StartDatePickerInput";
import TitleInput from "@/app/admin/events/_components/EventForm/Fields/TitleInput";
import PriceInput from "@/app/admin/events/_components/EventForm/Fields/PriceInput";
import ExternalHostingInput from "@/app/admin/events/_components/EventForm/Fields/ExternalHostingInput";

const BasicInfo: FC = () => {
  const router = useRouter();
  const { mode, defaultValues } = useEventFormContext();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useFormContext<EventFormValues>();
  const [isUpdating, setIsUpdating] = useState(false);

  // Watch only specific fields we need instead of all values
  const endDateTime = watch("endDateTime");

  const setLocationValueInReactHookForm = useCallback(
    (placeDetails: PlaceDetails) => {
      setValue("location", {
        formattedAddress: placeDetails.formattedAddress,
        lat: placeDetails.lat,
        lng: placeDetails.lng,
        name: placeDetails.name,
        placeId: placeDetails.placeId,
      });
    },
    [setValue],
  );

  // Handle start date change and auto-update end date
  const handleStartDateChange = useCallback(
    (newStartDate: any) => {
      setValue("startDateTime", newStartDate);

      const currentEndDate = endDateTime;
      if (newStartDate && currentEndDate) {
        const startTime =
          typeof newStartDate === "string"
            ? parseZonedDateTime(newStartDate)
            : newStartDate;
        const endTime =
          typeof currentEndDate === "string"
            ? parseZonedDateTime(currentEndDate)
            : currentEndDate;

        if (
          startTime &&
          endTime &&
          typeof startTime !== "string" &&
          typeof endTime !== "string" &&
          startTime.compare(endTime) >= 0
        ) {
          // If start time is same or after end time, set end time to start time + 1 hour
          const newEndTime = startTime.add({ hours: 1 });
          setValue("endDateTime", newEndTime);
        }
      }
    },
    [setValue, endDateTime],
  );

  // No need for initialization useEffect - handled in EventFormProvider

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
    // Go to next step - dynamic based on mode and hosting type
    const eventId = data.id;

    // Skip details step for externally hosted events since all required info is already collected
    if (data.isHostedExternally) {
      const nextStepUrl =
        mode === "edit"
          ? `/admin/events/${eventId}/edit/submit`
          : `/admin/events/create/submit`;
      router.push(nextStepUrl);
    } else {
      const nextStepUrl =
        mode === "edit"
          ? `/admin/events/${eventId}/edit/details`
          : `/admin/events/create/details`;
      router.push(nextStepUrl);
    }
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
        {defaultValues?.isExternal && (
          <div className="mb-4 p-3 bg-default-100 rounded-lg flex items-center gap-2">
            <span className="text-sm text-default-600">
              This event was synced from an external source
              {defaultValues.sourceType && ` (${defaultValues.sourceType})`}.
              You can still edit all fields including the category.
            </span>
          </div>
        )}
        {/* Title - Full width */}
        <div className="mb-5">
          <TitleInput
            control={control}
            isSubmitting={isSubmitting}
            errors={errors}
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Row 1 */}
          <LocationInput
            control={control}
            setLocationValueInReactHookForm={setLocationValueInReactHookForm}
            errors={errors}
          />
          <Category
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
          />

          {/* Row 2 */}
          <StartDatePickerInput
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
            onChange={handleStartDateChange}
          />
          <EndDatePickerInput
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
          />

          {/* Row 3 - Both fields with checkboxes */}
          <PriceInput
            control={control}
            isSubmitting={isSubmitting}
            errors={errors}
          />
          <ExternalHostingInput
            control={control}
            isSubmitting={isSubmitting}
            errors={errors}
          />
        </div>
        <div className="flex justify-between mt-5">
          <Button type="button" onPress={() => reset()} variant="flat">
            Reset Form
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

export default BasicInfo;
