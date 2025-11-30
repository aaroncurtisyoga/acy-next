"use client";

import { FC } from "react";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import QuickAddFormFields from "@/app/(root)/_components/QuickAddEvent/QuickAddFormFields";
import { useQuickAddForm } from "@/app/(root)/_components/QuickAddEvent/useQuickAddForm";

interface QuickAddEventModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  categories: Array<{ id: string; name: string }>;
}

const QuickAddEventModal: FC<QuickAddEventModalProps> = ({
  isOpen,
  onOpenChange,
  categories,
}) => {
  const {
    form,
    isSubmitting,
    isHostedExternally,
    isFree,
    setLocationValue,
    handleStartDateChange,
    onSubmit,
    handleAdvancedCreate,
  } = useQuickAddForm(onOpenChange);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              Quick Add Event
            </ModalHeader>

            <QuickAddFormFields
              control={control}
              errors={errors}
              categories={categories}
              isSubmitting={isSubmitting}
              isFree={isFree}
              isHostedExternally={isHostedExternally}
              setLocationValue={setLocationValue}
              onStartDateChange={handleStartDateChange}
            />

            <ModalFooter>
              <Button variant="flat" onPress={handleAdvancedCreate}>
                Create Advanced
              </Button>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isSubmitting}>
                Create Event
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default QuickAddEventModal;
