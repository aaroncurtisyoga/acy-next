"use client";

import { FC, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  now,
  getLocalTimeZone,
  parseZonedDateTime,
} from "@internationalized/date";
import { Button } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Category from "@/app/admin/events/_components/EventForm/Fields/Category";
import EndDatePickerInput from "@/app/admin/events/_components/EventForm/Fields/EndDatePickerInput";
import IsHostedExternallyCheckbox from "@/app/admin/events/_components/EventForm/Fields/IsHostedExternallyCheckbox";
import LocationInput from "@/app/admin/events/_components/EventForm/Fields/LocationInput";
import StartDatePickerInput from "@/app/admin/events/_components/EventForm/Fields/StartDatePickerInput";
import TitleInput from "@/app/admin/events/_components/EventForm/Fields/TitleInput";
import {
  resetFormData,
  selectFormValues,
  setFormData,
} from "@/_lib/redux/features/eventFormSlice";
import { useAppDispatch, useAppSelector } from "@/_lib/redux/hooks";
import { EventFormBasicInfoSchema } from "@/_lib/schema";
import { PlaceDetails } from "@/_lib/types";

export type Inputs = z.infer<typeof EventFormBasicInfoSchema>;

const BasicInfo: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const formValuesFromRedux = useAppSelector(selectFormValues);
  const eventFormInitialValues = {
    ...formValuesFromRedux,
    startDateTime: formValuesFromRedux.startDateTime
      ? parseZonedDateTime(formValuesFromRedux.startDateTime)
      : now(getLocalTimeZone()),
    endDateTime: formValuesFromRedux.endDateTime
      ? parseZonedDateTime(formValuesFromRedux.endDateTime)
      : now(getLocalTimeZone()),
  };
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(EventFormBasicInfoSchema),
    defaultValues: eventFormInitialValues,
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
      startDateTime: data.startDateTime.toString(),
      endDateTime: data.endDateTime.toString(),
    };

    dispatch(setFormData(payload));
    router.push("/admin/events/create/details");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
      }}
    >
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
      <div className="flex justify-between mt-5">
        <Button
          type={"button"}
          className={"mr-5"}
          onPress={() => {
            // Rest react hook form
            reset();
            // Reset redux store
            dispatch(resetFormData());
          }}
        >
          Reset Form
        </Button>
        <Button type={"submit"} color={"primary"}>
          Next
        </Button>
      </div>
    </form>
  );
};

export default BasicInfo;
