"use client";

import { FC, useState } from "react";
import { Input, Button, DatePicker, addToast } from "@heroui/react";
import { Check, X } from "lucide-react";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { updateEvent } from "@/app/_lib/actions/event.actions";
import { EventWithLocationAndCategory } from "@/app/_lib/types";

interface EventCardInlineEditProps {
  event: EventWithLocationAndCategory;
  onCancel: () => void;
  onSave: (updatedEvent: EventWithLocationAndCategory) => void;
}

const EventCardInlineEdit: FC<EventCardInlineEditProps> = ({
  event,
  onCancel,
  onSave,
}) => {
  const [title, setTitle] = useState(event.title);
  const [startDateTime, setStartDateTime] = useState(() => {
    const date = new Date(event.startDateTime);
    return parseAbsoluteToLocal(date.toISOString());
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      addToast({
        title: "Error",
        description: "Title cannot be empty",
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Convert the calendar datetime to ISO string
      const startDateTimeISO = startDateTime.toDate().toISOString();

      // Calculate end time (assuming 1.5 hours duration for now)
      const endDate = new Date(startDateTimeISO);
      endDate.setMinutes(endDate.getMinutes() + 90);
      const endDateTimeISO = endDate.toISOString();

      // Prepare the update data
      const updateData = {
        id: event.id,
        _id: event.id,
        title: title.trim(),
        startDateTime: startDateTimeISO,
        endDateTime: endDateTimeISO,
        // Include all other required fields from the original event
        description: event.description,
        price: event.price,
        isFree: event.isFree,
        imageUrl: event.imageUrl,
        category:
          typeof event.category === "object"
            ? event.category.id
            : event.category,
        location: event.location
          ? {
              formattedAddress: event.location.formattedAddress,
              lat: event.location.lat,
              lng: event.location.lng,
              name: event.location.name,
              placeId: event.location.placeId,
            }
          : undefined,
        maxAttendees: event.maxAttendees,
        isHostedExternally: event.isHostedExternally,
        externalRegistrationUrl: event.externalRegistrationUrl,
        externalUrl: event.externalUrl,
      };

      await updateEvent({
        event: updateData,
        path: "/",
      });

      // Update the local state with the new values
      const updatedEvent = {
        ...event,
        title: title.trim(),
        startDateTime: new Date(startDateTimeISO),
        endDateTime: new Date(endDateTimeISO),
      };

      addToast({
        title: "Success",
        description: "Event updated successfully",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      onSave(updatedEvent);
    } catch (error) {
      console.error("Failed to update event:", error);
      addToast({
        title: "Error",
        description: "Failed to update event",
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Title Input */}
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Event title"
        size="sm"
        variant="bordered"
        label="Title"
        labelPlacement="outside"
        classNames={{
          label: "text-xs font-medium text-foreground-600",
          input: "font-semibold",
        }}
        disabled={isLoading}
      />

      {/* Date Time Picker */}
      <DatePicker
        label="Date & Time"
        labelPlacement="outside"
        value={startDateTime as any}
        onChange={(value: any) => setStartDateTime(value)}
        size="sm"
        variant="bordered"
        hideTimeZone
        showMonthAndYearPickers
        classNames={{
          label: "text-xs font-medium text-foreground-600",
        }}
        isDisabled={isLoading}
      />

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button
          size="sm"
          color="primary"
          startContent={!isLoading && <Check className="w-3.5 h-3.5" />}
          onClick={handleSave}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Save
        </Button>
        <Button
          size="sm"
          variant="flat"
          startContent={<X className="w-3.5 h-3.5" />}
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EventCardInlineEdit;
