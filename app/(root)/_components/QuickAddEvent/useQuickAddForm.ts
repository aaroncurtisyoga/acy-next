import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { addToast } from "@heroui/toast";
import { now, getLocalTimeZone } from "@internationalized/date";
import { createEvent } from "@/app/_lib/actions/event.actions";
import { PlaceDetails } from "@/app/_lib/types";

export type QuickEventFormData = {
  title: string;
  location?: {
    formattedAddress?: string;
    lat?: number;
    lng?: number;
    name?: string;
    placeId?: string;
  };
  startDateTime: any;
  endDateTime: any;
  category: string;
  price?: string;
  isFree: boolean;
  isHostedExternally: boolean;
  externalUrl?: string;
  externalRegistrationUrl?: string;
};

export function useQuickAddForm(onClose: () => void) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuickEventFormData>({
    defaultValues: {
      isFree: false,
      isHostedExternally: true,
      startDateTime: now(getLocalTimeZone()).add({ hours: 1 }),
      endDateTime: now(getLocalTimeZone()).add({ hours: 2 }),
    },
  });

  const { setValue, watch, reset } = form;

  const isHostedExternally = watch("isHostedExternally");
  const isFree = watch("isFree");

  const setLocationValue = useCallback(
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

  const handleStartDateChange = useCallback(
    (newStartDate: any) => {
      setValue("startDateTime", newStartDate);
      const currentEndDate = watch("endDateTime");

      if (
        newStartDate &&
        currentEndDate &&
        newStartDate.compare(currentEndDate) >= 0
      ) {
        const newEndTime = newStartDate.add({ hours: 1 });
        setValue("endDateTime", newEndTime);
      }
    },
    [setValue, watch],
  );

  const onSubmit = async (data: QuickEventFormData) => {
    setIsSubmitting(true);
    try {
      const eventData = {
        ...data,
        price: data.isFree ? "0" : data.price || "0",
        startDateTime: data.startDateTime.toString(),
        endDateTime: data.endDateTime.toString(),
        description: "",
        maxAttendees: 100,
      };

      const created = await createEvent({
        event: eventData as any,
        path: "/",
      });

      if (created) {
        addToast({
          title: "Success",
          description: "Event created successfully",
          color: "success",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
        reset();
        onClose();
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create event:", error);
      addToast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdvancedCreate = () => {
    onClose();
    router.push("/admin/events/create");
  };

  return {
    form,
    isSubmitting,
    isHostedExternally,
    isFree,
    setLocationValue,
    handleStartDateChange,
    onSubmit,
    handleAdvancedCreate,
  };
}
