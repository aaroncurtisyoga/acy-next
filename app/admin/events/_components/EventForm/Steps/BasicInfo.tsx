"use client";

import { useRouter } from "next/navigation";
import { FC, useCallback, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import {
  now,
  getLocalTimeZone,
  parseZonedDateTime,
} from "@internationalized/date";

import Category from "@/app/admin/events/_components/EventForm/Fields/Category";
import EndDatePickerInput from "@/app/admin/events/_components/EventForm/Fields/EndDatePickerInput";
import IsHostedExternallyCheckbox from "@/app/admin/events/_components/EventForm/Fields/IsHostedExternallyCheckbox";
import LocationInput from "@/app/admin/events/_components/EventForm/Fields/LocationInput";
import StartDatePickerInput from "@/app/admin/events/_components/EventForm/Fields/StartDatePickerInput";
import TitleInput from "@/app/admin/events/_components/EventForm/Fields/TitleInput";
import { EventFormBasicInfoSchema } from "@/_lib/schema";
import { useAppDispatch, useAppSelector } from "@/_lib/redux/hooks";
import {
  selectFormValues,
  setFormData,
} from "@/_lib/redux/features/eventFormSlice";
import { PlaceDetails } from "@/_lib/types";

export type Inputs = z.infer<typeof EventFormBasicInfoSchema>;

const BasicInfo: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const formValuesFromRedux = useAppSelector(selectFormValues);
  const eventInitialValues = {
    ...formValuesFromRedux,
    startDateTime: formValuesFromRedux.startDateTime
      ? parseZonedDateTime(formValuesFromRedux.startDateTime)
      : now(getLocalTimeZone()),
    endDateTime: formValuesFromRedux.endDateTime
      ? parseZonedDateTime(formValuesFromRedux.endDateTime)
      : now(getLocalTimeZone()),
  };
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(EventFormBasicInfoSchema),
    defaultValues: eventInitialValues,
  });

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

  useEffect(() => {
    formValuesFromRedux.location?.formattedAddress &&
      setLocationValueInReactHookForm(formValuesFromRedux.location);
  }, [formValuesFromRedux.location, setLocationValueInReactHookForm, setValue]);

  const onSubmit = async (data) => {
    // Convert Date objects to ISO strings
    const payload = {
      ...data,
      startDateTime: data.startDateTime.toISOString(),
      endDateTime: data.endDateTime.toISOString(),
    };

    dispatch(setFormData(payload));
    router.push("/admin/events/create/details");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={"grid grid-cols-2 gap-5"}>
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
      <div className="flex justify-end">
        <Button type={"submit"} className={"mt-5"}>
          Next
        </Button>
      </div>
    </form>
  );
};

export default BasicInfo;
