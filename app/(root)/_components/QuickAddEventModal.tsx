"use client";

import { FC, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import { addToast } from "@heroui/toast";
import { Controller, useForm } from "react-hook-form";
import { now, getLocalTimeZone } from "@internationalized/date";
import { PlaceDetails } from "@/app/_lib/types";
import { createEvent } from "@/app/_lib/actions/event.actions";
import LocationInput from "@/app/admin/events/_components/EventForm/Fields/LocationInput";
import StartDatePickerInput from "@/app/admin/events/_components/EventForm/Fields/StartDatePickerInput";
import EndDatePickerInput from "@/app/admin/events/_components/EventForm/Fields/EndDatePickerInput";

interface QuickAddEventModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  categories: Array<{ id: string; name: string }>;
}

type QuickEventFormData = {
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

const QuickAddEventModal: FC<QuickAddEventModalProps> = ({
  isOpen,
  onOpenChange,
  categories,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<QuickEventFormData>({
    defaultValues: {
      isFree: false,
      isHostedExternally: true, // Default to external for quick add
      startDateTime: now(getLocalTimeZone()).add({ hours: 1 }),
      endDateTime: now(getLocalTimeZone()).add({ hours: 2 }),
    },
  });

  const isHostedExternally = watch("isHostedExternally");
  const isFree = watch("isFree");

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
        description: "", // Will be added in advanced form if needed
        maxAttendees: 100, // Default value
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
        onOpenChange();
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
    onOpenChange();
    router.push("/admin/events/create");
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              Quick Add Event
            </ModalHeader>
            <ModalBody className="gap-4">
              <Controller
                name="title"
                control={control}
                rules={{ required: "Event title is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Event Title"
                    placeholder="Enter event title"
                    isRequired
                    errorMessage={errors.title?.message}
                    isInvalid={!!errors.title}
                  />
                )}
              />

              <LocationInput
                control={control as any}
                setLocationValueInReactHookForm={
                  setLocationValueInReactHookForm
                }
                errors={errors}
              />

              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Category"
                    placeholder="Select a category"
                    isRequired
                    errorMessage={errors.category?.message}
                    isInvalid={!!errors.category}
                  >
                    {categories.map((category) => (
                      <SelectItem key={category.id}>{category.name}</SelectItem>
                    ))}
                  </Select>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <StartDatePickerInput
                  control={control as any}
                  errors={errors}
                  isSubmitting={isSubmitting}
                  onChange={handleStartDateChange}
                />
                <EndDatePickerInput
                  control={control as any}
                  errors={errors}
                  isSubmitting={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="isFree"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      isSelected={field.value}
                      onValueChange={field.onChange}
                    >
                      Free Event
                    </Checkbox>
                  )}
                />
                <Controller
                  name="isHostedExternally"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      isSelected={field.value}
                      onValueChange={field.onChange}
                    >
                      External Event
                    </Checkbox>
                  )}
                />
              </div>

              {!isFree && (
                <Controller
                  name="price"
                  control={control}
                  rules={{
                    required: !isFree ? "Price is required" : false,
                    pattern: {
                      value: /^\d+(\.\d{0,2})?$/,
                      message: "Please enter a valid price",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      label="Price"
                      placeholder="0.00"
                      startContent="$"
                      isRequired={!isFree}
                      errorMessage={errors.price?.message}
                      isInvalid={!!errors.price}
                    />
                  )}
                />
              )}

              {isHostedExternally && (
                <>
                  <Controller
                    name="externalUrl"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="url"
                        label="Event Website URL"
                        placeholder="https://example.com/event"
                      />
                    )}
                  />
                  <Controller
                    name="externalRegistrationUrl"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="url"
                        label="Registration URL"
                        placeholder="https://example.com/register"
                      />
                    )}
                  />
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={handleAdvancedCreate}>
                Create Advanced
              </Button>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isSubmitting}>
                Create Event
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default QuickAddEventModal;
