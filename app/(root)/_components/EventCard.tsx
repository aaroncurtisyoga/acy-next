"use client";

import { FC } from "react";
import { Card, CardBody } from "@heroui/card";
import { useUser } from "@clerk/nextjs";
import BasicModal from "@/app/_components/BasicModal";
import EventCardAdminBadges from "@/app/(root)/_components/EventCard/EventCardAdminBadges";
import EventCardContent from "@/app/(root)/_components/EventCard/EventCardContent";
import { useEventCard } from "@/app/(root)/_components/EventCard/useEventCard";
import { EventWithLocationAndCategory } from "@/app/_lib/types";
import { formatDateTime } from "@/app/_lib/utils";

interface EventCardProps {
  event: EventWithLocationAndCategory;
  isHighlighted?: boolean;
}

const EventCard: FC<EventCardProps> = ({
  event: initialEvent,
  isHighlighted = false,
}) => {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const {
    event,
    isEditing,
    isDeleting,
    isDeleted,
    isOpen,
    onOpenChange,
    isToday,
    handleSaveEdit,
    handleEditClick,
    handleDeleteClick,
    handleDelete,
    cancelEdit,
  } = useEventCard(initialEvent);

  const dateTime = formatDateTime(event.startDateTime);
  const dayLabel = isToday() ? "TODAY" : dateTime.weekdayShort.toUpperCase();

  if (isDeleted) return null;

  return (
    <>
      <div className="w-full mb-4">
        {isAdmin && !isEditing && (
          <EventCardAdminBadges
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        )}

        <Card
          id={`event-${event.id}`}
          className={`w-full border ${isHighlighted ? "border-2 border-primary bg-blue-50/50 dark:bg-primary/5 shadow-lg" : "border-divider"} shadow-none hover:shadow-sm transition-shadow duration-200 rounded-2xl @container`}
        >
          <CardBody className="p-0">
            <div className="flex flex-col gap-0">
              <EventCardContent
                event={event}
                isEditing={isEditing}
                dayLabel={dayLabel}
                onCancelEdit={cancelEdit}
                onSaveEdit={handleSaveEdit}
              />
            </div>
          </CardBody>
        </Card>
      </div>

      <BasicModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        header="Confirm Delete"
        primaryAction={handleDelete}
        primaryActionLabel={isDeleting ? "Deleting..." : "Delete"}
      >
        <div className="py-4">
          <p className="text-foreground-700">
            Are you sure you want to delete the event{" "}
            <strong>&ldquo;{event.title}&rdquo;</strong>?
          </p>
          <p className="text-sm text-foreground-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
      </BasicModal>
    </>
  );
};

export default EventCard;
