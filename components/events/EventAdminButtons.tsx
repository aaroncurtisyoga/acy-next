import Link from "next/link";
import { FC } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { deleteEvent } from "@/lib/actions/event.actions";

interface EventCardAdminButtonsProps {
  id: string;
  pathname: string;
}

const EventAdminButtons: FC<EventCardAdminButtonsProps> = ({
  id,
  pathname,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="flex flex-row gap-3 mb-5">
        <Button size={"sm"} color={"default"}>
          <Link href={`/orders?eventId=${id}`} className="flex gap-2">
            Order Details
          </Link>
        </Button>
        <Button size={"sm"} color={"primary"}>
          <Link href={`/events/${id}/update`}>Edit</Link>
        </Button>
        <Button onClick={onOpen} size={"sm"} color={"danger"}>
          Delete
        </Button>
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

export default EventAdminButtons;
