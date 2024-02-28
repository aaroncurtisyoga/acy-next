import Link from "next/link";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Edit, Trash } from "lucide-react";

import { deleteEvent } from "@/lib/actions/event.actions";

type EventCardAdminButtonsProps = {
  id: string;
  pathname: string;
};

const EventCardAdminButtons = ({
  id,
  pathname,
}: EventCardAdminButtonsProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="flex flex-row gap-4 p-3 justify-between">
        <Link href={`/orders?eventId=${id}`} className="flex gap-2">
          <p className="text-primary-500">Order Details</p>
        </Link>
        <div className={"flex gap-2"}>
          <Button isIconOnly variant={"ghost"} color={"primary"}>
            <Link href={`/events/${id}/update`}>
              <Edit width={20} height={20} />
            </Link>
          </Button>
          <Button isIconOnly onPress={onOpen} color={"danger"}>
            <Trash width={20} height={20} />
          </Button>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Delete
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this event?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={async () => {
                    await deleteEvent({ eventId: id, path: pathname });
                  }}
                >
                  Delete Event
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EventCardAdminButtons;
