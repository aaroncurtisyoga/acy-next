import React, { FC } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

interface BasicModalProps {
  children?: React.ReactNode;
  header?: string | React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const BasicModal: FC<BasicModalProps> = ({
  children,
  header,
  isOpen,
  onOpenChange,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            {header && <ModalHeader>{header}</ModalHeader>}
            <ModalBody>{children}</ModalBody>
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
