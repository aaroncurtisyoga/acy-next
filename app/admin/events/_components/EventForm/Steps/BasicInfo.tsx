"use client";

import { FC, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { parseZonedDateTime } from "@internationalized/date";
import { useFormContext } from "react-hook-form";
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
    formState: { errors, isSubmitting },
  } = useFormContext<EventFormValues>();

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
    <form onSubmit={handleSubmit(onSubmit)}>
      {defaultValues?.isExternal && (
        <div className="mb-4 p-3 bg-default-100 rounded-lg flex items-center gap-2">
          <span className="text-sm text-default-600">
            This event was synced from an external source
            {defaultValues.sourceType && ` (${defaultValues.sourceType})`}. You
            can still edit all fields including the category.
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
        <div className="flex gap-2">
          <Button
            type="button"
            variant="light"
            onPress={() => router.push("/admin/events")}
          >
            Cancel
          </Button>
          <Button type="button" onPress={() => reset()}>
            Reset Form
          </Button>
        </div>
        <Button type="submit" color="primary">
          Next
        </Button>
      </div>
    </form>
  );
};

export default BasicInfo;
