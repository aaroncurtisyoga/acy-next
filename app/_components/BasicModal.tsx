import React, { FC } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

interface BasicModalProps {
  children?: React.ReactNode;
  header?: string | React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  primaryAction?: () => void;
  primaryActionLabel?: string;
  placement?: "auto" | "top" | "center" | "bottom";
  hideButtons?: boolean;
}

const BasicModal: FC<BasicModalProps> = ({
  children,
  header,
  isOpen,
  onOpenChange,
  primaryAction,
  primaryActionLabel,
  placement,
  hideButtons = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement={placement ? placement : "auto"}
    >
      <ModalContent className={"pb-8"}>
        {(onClose) => (
          <>
            {header && <ModalHeader>{header}</ModalHeader>}
            <ModalBody>{children}</ModalBody>
            {
              // If hideButtons is false, render the buttons
              !hideButtons && (
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
              )
            }
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default BasicModal;
