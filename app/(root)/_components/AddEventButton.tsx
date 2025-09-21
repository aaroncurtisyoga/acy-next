"use client";

import { FC, useState, useEffect } from "react";
import { useDisclosure } from "@heroui/react";
import { Button } from "@heroui/react";
import { useUser } from "@clerk/nextjs";
import QuickAddEventModal from "./QuickAddEventModal";
import { getAllCategories } from "@/app/_lib/actions/category.actions";

const AddEventButton: FC = () => {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);

  useEffect(() => {
    if (isAdmin) {
      getAllCategories().then(setCategories);
    }
  }, [isAdmin]);

  if (!isAdmin) return null;

  return (
    <>
      <Button
        color="secondary"
        variant="flat"
        onPress={onOpen}
        size="sm"
        className="shadow-sm hover:shadow-md transition-shadow"
        aria-label="Add Event"
      >
        New Event
      </Button>

      <QuickAddEventModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        categories={categories}
      />
    </>
  );
};

export default AddEventButton;
