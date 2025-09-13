"use client";

import { FC } from "react";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from "@heroui/react";
import { Plus, Calendar } from "lucide-react";
import TableEventManagement from "@/app/admin/events/_components/TableEventManagement";
import EventFormWrapper from "@/app/admin/events/_components/EventForm/EventFormWrapper";
import BasicInfo from "@/app/admin/events/_components/EventForm/Steps/BasicInfo";

const AdminEventsPage: FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="wrapper">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Events</h1>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={onOpen}
          className="font-medium"
        >
          Create Event
        </Button>
      </div>

      <TableEventManagement />

      {/* Drawer for creating events */}
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="right"
        size="4xl"
        classNames={{
          base: "bg-background",
          header: "border-b border-divider",
          body: "py-6",
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-xl font-semibold">Create New Event</span>
              </DrawerHeader>
              <DrawerBody>
                <EventFormWrapper mode="create">
                  <BasicInfo />
                </EventFormWrapper>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default AdminEventsPage;
