import React, { Dispatch, FC, SetStateAction } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Category } from "@prisma/client";
import { deleteCategory } from "@/lib/actions/category.actions";
import { handleError } from "@/lib/utils";

interface ModalToDeleteCategoryProps {
  category: Category;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  setCategories: Dispatch<SetStateAction<Category[]>>;
}

const ModalToDeleteCategory: FC<ModalToDeleteCategoryProps> = ({
  category,
  isOpen,
  onOpenChange,
  setCategories,
}) => {
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const result = await deleteCategory(categoryId);
      if (result.status) {
        setCategories((prev) =>
          prev.filter((category) => category.id !== categoryId),
        );
        onOpenChange(false);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Delete Category</ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this Category?</p>
              <p>{category.name}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="default" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  handleDeleteCategory(category.id);
                }}
                type="button"
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalToDeleteCategory;