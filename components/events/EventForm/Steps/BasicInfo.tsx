"use client";

import { useRouter } from "next/navigation";
import { FC, useCallback, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { Event } from "@prisma/client";
import Category from "@/components/events/EventForm/Fields/Category";
import EndDatePickerInput from "@/components/events/EventForm/Fields/EndDatePickerInput";
import IsHostedExternallyCheckbox from "@/components/events/EventForm/Fields/IsHostedExternallyCheckbox";
import LocationInput from "@/components/events/EventForm/Fields/LocationInput";
import StartDatePickerInput from "@/components/events/EventForm/Fields/StartDatePickerInput";
import TitleInput from "@/components/events/EventForm/Fields/TitleInput";
import { EventFormBasicInfoSchema } from "@/lib/schema";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  selectFormValues,
  selectEventType,
  setFormData,
} from "@/lib/redux/features/eventFormSlice";
import "react-datepicker/dist/react-datepicker.css";
import { PlaceDetails } from "@/types";

export type Inputs = z.infer<typeof EventFormBasicInfoSchema>;

interface EventFormStepOneProps {
  event?: Event;
}

const BasicInfo: FC<EventFormStepOneProps> = ({ event }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const eventType = useAppSelector(selectEventType);
  const formValuesFromRedux = useAppSelector(selectFormValues);
  const isUpdateAndEventExists = eventType === "Update" && event;
  const eventInitialValues = isUpdateAndEventExists
    ? {
        ...event,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
      }
    : {
        ...formValuesFromRedux,
        startDateTime: new Date(formValuesFromRedux.startDateTime),
        endDateTime: new Date(formValuesFromRedux.endDateTime),
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
