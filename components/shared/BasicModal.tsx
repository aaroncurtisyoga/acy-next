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
  primaryAction?: () => void;
  primaryActionLabel: string;
}

const BasicModal: FC<BasicModalProps> = ({
  children,
  header,
  isOpen,
  onOpenChange,
  primaryAction,
  primaryActionLabel,
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
              {primaryAction && (
                <Button color="primary" onPress={primaryAction}>
                  {primaryActionLabel}
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default BasicModal;
