"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import {
  fromDate,
  getLocalTimeZone,
  parseZonedDateTime,
} from "@internationalized/date";
import { X } from "lucide-react";

import { getEventById, updateEvent } from "@/app/_lib/actions/event.actions";
import { PlaceDetails } from "@/app/_lib/types";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";

// Import field components
import TitleInput from "@/app/admin/events/_components/EventForm/Fields/TitleInput";
import LocationInput from "@/app/admin/events/_components/EventForm/Fields/LocationInput";
import Category from "@/app/admin/events/_components/EventForm/Fields/Category";
import StartDatePickerInput from "@/app/admin/events/_components/EventForm/Fields/StartDatePickerInput";
import EndDatePickerInput from "@/app/admin/events/_components/EventForm/Fields/EndDatePickerInput";
import DescriptionRichTextEditor from "@/app/admin/events/_components/EventForm/Fields/DescriptionRichTextEditor";
import ImagePicker from "@/app/admin/events/_components/EventForm/Fields/ImagePicker";

export default function EditEventPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({
    defaultValues: {
      isFree: false,
      isHostedExternally: false,
    },
  });

  const isHostedExternally = watch("isHostedExternally");
  const isFree = watch("isFree");
  const endDateTime = watch("endDateTime");

  // Fetch event data on mount
  useEffect(() => {
    async function fetchEvent() {
      try {
        const event = await getEventById(id);

        if (!event) {
          setError("Event not found");
          setIsLoading(false);
          return;
        }

        // Reset form with fetched data
        reset({
          id: event.id,
          title: event.title,
          description: event.description ?? undefined,
          imageUrl: event.imageUrl ?? undefined,
          price: event.price ?? undefined,
          isFree: event.isFree,
          isHostedExternally: event.isHostedExternally,
          externalRegistrationUrl: event.externalRegistrationUrl ?? undefined,
          maxAttendees: event.maxAttendees ?? undefined,
          category: event.category?.id ?? undefined,
          location: event.location
            ? {
                formattedAddress: event.location.formattedAddress,
                lat: event.location.lat ?? undefined,
                lng: event.location.lng ?? undefined,
                name: event.location.name,
                placeId: event.location.placeId ?? undefined,
              }
            : undefined,
          startDateTime: event.startDateTime
            ? fromDate(new Date(event.startDateTime), getLocalTimeZone())
            : undefined,
          endDateTime: event.endDateTime
            ? fromDate(new Date(event.endDateTime), getLocalTimeZone())
            : undefined,
        });
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setError("Failed to load event data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvent();
  }, [id, reset]);

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

      // Auto-adjust end date if it's before start date
      if (newStartDate && endDateTime) {
        const startTime =
          typeof newStartDate === "string"
            ? parseZonedDateTime(newStartDate)
            : newStartDate;
        const endTime =
          typeof endDateTime === "string"
            ? parseZonedDateTime(endDateTime)
            : endDateTime;

        if (startTime?.compare && endTime?.compare) {
          if (startTime.compare(endTime) >= 0) {
            setValue("endDateTime", startTime.add({ hours: 1 }));
          }
        }
      }
    },
    [setValue, endDateTime],
  );

  const onSubmit = async (data: EventFormValues) => {
    setIsSubmitting(true);

    try {
      // Convert ZonedDateTime to UTC ISO strings
      const startDateTime = data.startDateTime?.toAbsoluteString
        ? data.startDateTime.toAbsoluteString()
        : data.startDateTime;
      const endDateTime = data.endDateTime?.toAbsoluteString
        ? data.endDateTime.toAbsoluteString()
        : data.endDateTime;

      const eventData = {
        ...data,
        startDateTime,
        endDateTime,
      };

      const updated = await updateEvent({
        event: eventData,
        path: `/events/${id}`,
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
      } else {
        addToast({
          title: "Error",
          description: "Failed to update event",
          color: "danger",
          timeout: 5000,
          shouldShowTimeoutProgress: true,
        });
      }
    } catch (err) {
      console.error("Error updating event:", err);
      addToast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to update event",
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" label="Loading event..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-danger">{error}</p>
        <Button onPress={() => router.push("/admin/events")}>
          Back to Events
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        {/* Close button */}
        <Button
          isIconOnly
          variant="light"
          className="absolute -top-2 -right-2 z-10"
          onPress={() => router.push("/admin/events")}
          aria-label="Close"
        >
          <X size={20} />
        </Button>

        <h1 className="text-2xl font-bold mb-6">Edit Event</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <TitleInput
            control={control}
            isSubmitting={isSubmitting}
            errors={errors}
            rules={{ required: "Event name is required" }}
          />

          {/* Location & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <LocationInput
              control={control}
              setLocationValueInReactHookForm={setLocationValue}
              errors={errors}
              isDisabled={isSubmitting}
            />
            <Category
              control={control}
              errors={errors}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Date/Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <StartDatePickerInput
              control={control}
              errors={errors}
              isSubmitting={isSubmitting}
              onChange={handleStartDateChange}
              rules={{ required: "Start date/time is required" }}
            />
            <EndDatePickerInput
              control={control}
              errors={errors}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Price */}
          <div className="max-w-xs">
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <Input
                  label="Price"
                  placeholder="0.00"
                  type="number"
                  min="0"
                  step="0.01"
                  variant="bordered"
                  isDisabled={isFree || isSubmitting}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  name={field.name}
                  startContent={
                    <span className="text-default-400 text-sm">$</span>
                  }
                />
              )}
            />
            <Controller
              name="isFree"
              control={control}
              render={({ field }) => (
                <Switch
                  isSelected={field.value ?? false}
                  onValueChange={(checked) => {
                    field.onChange(checked);
                    if (checked) {
                      setValue("price", "0");
                    }
                  }}
                  size="sm"
                  className="mt-2"
                >
                  Free event
                </Switch>
              )}
            />
          </div>

          {/* Hosting Toggle */}
          <div className="p-4 bg-default-100 rounded-lg space-y-4">
            <Controller
              name="isHostedExternally"
              control={control}
              render={({ field }) => (
                <Switch
                  isSelected={field.value ?? false}
                  onValueChange={field.onChange}
                  size="md"
                >
                  <span className="font-medium">Externally hosted event</span>
                </Switch>
              )}
            />
            <p className="text-sm text-default-500">
              {isHostedExternally
                ? "Registration is handled on an external website"
                : "Registration is handled through this platform"}
            </p>
          </div>

          {/* Conditional Fields based on hosting type */}
          {isHostedExternally ? (
            // External hosting fields
            <div className="space-y-4">
              <Controller
                name="externalRegistrationUrl"
                control={control}
                rules={{
                  required: isHostedExternally
                    ? "Registration URL is required for external events"
                    : false,
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message:
                      "Please enter a valid URL starting with http(s)://",
                  },
                }}
                render={({ field }) => (
                  <Input
                    label="External Registration URL"
                    placeholder="https://..."
                    type="url"
                    variant="bordered"
                    isRequired
                    isDisabled={isSubmitting}
                    isInvalid={!!errors.externalRegistrationUrl}
                    errorMessage={errors.externalRegistrationUrl?.message}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                )}
              />
            </div>
          ) : (
            // Internal hosting fields
            <div className="space-y-6">
              {/* Max Attendees */}
              <div className="max-w-xs">
                <Controller
                  name="maxAttendees"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Maximum Attendees"
                      placeholder="Leave empty for unlimited"
                      type="number"
                      min="1"
                      variant="bordered"
                      isDisabled={isSubmitting}
                      description="Set a limit on the number of registrations"
                      value={field.value?.toString() ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? parseInt(e.target.value, 10)
                            : undefined,
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  )}
                />
              </div>

              {/* Image */}
              <ImagePicker
                errors={errors}
                setValue={setValue}
                control={control}
              />

              {/* Description */}
              <DescriptionRichTextEditor
                control={control}
                errors={errors}
                isDisabled={isSubmitting}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="bordered"
              onPress={() => router.push("/admin/events")}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" color="primary" isLoading={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
