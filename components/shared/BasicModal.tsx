import { FC } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

// I think that the parent would have this:
// const { isOpen, onOpen, onOpenChange } = useDisclosure();

interface BasicModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const BasicModal: FC<BasicModalProps> = ({ isOpen, onOpenChange }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <p>todo: modal header and stuff here</p>
            </ModalHeader>
            <ModalBody>
              <p>modal body stuff here</p>
            </ModalBody>
            <ModalFooter>
              <Button color="default" onPress={onClose}>
                Cancel
              </Button>
              <p>todo: modal buttons and stuff here</p>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default BasicModal;
