import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@heroui/modal";
import { track } from "@vercel/analytics";
import { deleteEvent } from "@/app/_lib/actions/event.actions";
import { EventWithLocationAndCategory } from "@/app/_lib/types";

export function useEventCard(initialEvent: EventWithLocationAndCategory) {
  const [event, setEvent] = useState(initialEvent);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  const handleSaveEdit = (updatedEvent: EventWithLocationAndCategory) => {
    setEvent(updatedEvent);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    track("event_management", {
      action: "edit_event_click",
      event_id: event.id,
      event_title: event.title,
    });
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    track("event_management", {
      action: "delete_event_click",
      event_id: event.id,
      event_title: event.title,
    });
    onOpen();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    track("event_management", {
      action: "delete_event",
      event_id: event.id,
      event_title: event.title,
    });
    try {
      const response = await deleteEvent(event.id);
      if (response.success) {
        setIsDeleted(true);
        onOpenChange();
        router.refresh();
      } else {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelEdit = () => setIsEditing(false);

  const isToday = () => {
    const today = new Date();
    const eventDate = new Date(event.startDateTime);
    const todayET = new Date(
      today.toLocaleString("en-US", { timeZone: "America/New_York" }),
    );
    const eventET = new Date(
      eventDate.toLocaleString("en-US", { timeZone: "America/New_York" }),
    );
    return (
      todayET.getDate() === eventET.getDate() &&
      todayET.getMonth() === eventET.getMonth() &&
      todayET.getFullYear() === eventET.getFullYear()
    );
  };

  return {
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
  };
}
