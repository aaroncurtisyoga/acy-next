"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const AddEventButton: FC = () => {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const router = useRouter();

  if (!isAdmin) return null;

  const handleAddEvent = () => {
    router.push("/admin/events/create");
  };

  return (
    <Button
      color="primary"
      variant="solid"
      startContent={<Plus className="w-4 h-4" />}
      onPress={handleAddEvent}
      size="sm"
      className="font-medium shadow-sm hover:shadow-md transition-shadow"
    >
      Add Event
    </Button>
  );
};

export default AddEventButton;
