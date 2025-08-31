"use client";

import { FC, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import {
  parseZonedDateTime,
  now,
  getLocalTimeZone,
} from "@internationalized/date";
import { useFormContext, useWatch } from "react-hook-form";
import { PlaceDetails } from "@/app/_lib/types";
import {
  EventFormValues,
  useEventFormContext,
} from "@/app/admin/events/_components/EventForm/EventFormProvider";
import Category from "@/app/admin/events/_components/EventForm/Fields/Category";
import EndDatePickerInput from "@/app/admin/events/_components/EventForm/Fields/EndDatePickerInput";
import IsHostedExternallyCheckbox from "@/app/admin/events/_components/EventForm/Fields/IsHostedExternallyCheckbox";
import LocationInput from "@/app/admin/events/_components/EventForm/Fields/LocationInput";
import StartDatePickerInput from "@/app/admin/events/_components/EventForm/Fields/StartDatePickerInput";
import TitleInput from "@/app/admin/events/_components/EventForm/Fields/TitleInput";

const BasicInfo: FC = () => {
  const router = useRouter();
  const { mode } = useEventFormContext();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useFormContext<EventFormValues>();

  const currentValues = useWatch({ control });

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

  // Automatically normalize date values for UI if needed
  useEffect(() => {
    if (!currentValues.startDateTime) {
      setValue("startDateTime", now(getLocalTimeZone()));
    } else {
      setValue(
        "startDateTime",
        parseZonedDateTime(currentValues.startDateTime),
      );
    }

    if (!currentValues.endDateTime) {
      setValue("endDateTime", now(getLocalTimeZone()));
    } else {
      setValue("endDateTime", parseZonedDateTime(currentValues.endDateTime));
    }

    if (currentValues.location?.formattedAddress) {
      setLocationValueInReactHookForm({
        formattedAddress: currentValues.location.formattedAddress,
        lat: currentValues.location.lat || 0,
        lng: currentValues.location.lng || 0,
        name: currentValues.location.name || "",
        placeId: currentValues.location.placeId || "",
      });
    }
  }, [currentValues, setLocationValueInReactHookForm, setValue]);

  const onSubmit = async (data: EventFormValues) => {
    // Go to next step - dynamic based on mode
    const eventId = data.id;
    const nextStepUrl =
      mode === "edit"
        ? `/admin/events/${eventId}/edit/details`
        : `/admin/events/create/details`;
    router.push(nextStepUrl);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-5">
        <TitleInput
          control={control}
          isSubmitting={isSubmitting}
          errors={errors}
        />
        <LocationInput
          control={control}
          setLocationValueInReactHookForm={setLocationValueInReactHookForm}
          errors={errors}
        />
        <StartDatePickerInput
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
        />
        <EndDatePickerInput
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
        />
        <Category
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
        />
        <IsHostedExternallyCheckbox
          control={control}
          isSubmitting={isSubmitting}
        />
      </div>
      <div className="flex justify-between mt-5">
        <Button type="button" className="mr-5" onPress={() => reset()}>
          Reset Form
        </Button>
        <Button type="submit" color="primary">
          Next
        </Button>
      </div>
    </form>
  );
};

export default BasicInfo;
