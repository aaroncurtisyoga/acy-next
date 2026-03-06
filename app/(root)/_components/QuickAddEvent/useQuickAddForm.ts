import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
      startDateTime: new Date(Date.now() + 3600000),
      endDateTime: new Date(Date.now() + 7200000),
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

      if (newStartDate && currentEndDate) {
        const start =
          newStartDate instanceof Date ? newStartDate : new Date(newStartDate);
        const end =
          currentEndDate instanceof Date
            ? currentEndDate
            : new Date(currentEndDate);
        if (start >= end) {
          setValue("endDateTime", new Date(start.getTime() + 3600000));
        }
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
        startDateTime:
          data.startDateTime instanceof Date
            ? data.startDateTime.toISOString()
            : data.startDateTime,
        endDateTime:
          data.endDateTime instanceof Date
            ? data.endDateTime.toISOString()
            : data.endDateTime,
        description: "",
        maxAttendees: 100,
      };

      const created = await createEvent({
        event: eventData as any,
        path: "/",
      });

      if (created) {
        toast.success("Event created successfully");
        reset();
        onClose();
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create event:", error);
      toast.error("Failed to create event. Please try again.");
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
