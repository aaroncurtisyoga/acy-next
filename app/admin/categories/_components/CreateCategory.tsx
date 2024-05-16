"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { CirclePlus } from "lucide-react";
import { z } from "zod";
import { createCategory } from "@/lib/actions/category.actions";
import { CategoryFormSchema } from "@/lib/schema";
import { handleError } from "@/lib/utils";

type Inputs = z.infer<typeof CategoryFormSchema>;
const CreateCategory: FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<Inputs>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      category: "",
    },
  });

  const handleAddCategory: SubmitHandler<Inputs> = async (data) => {
    try {
      await createCategory({
        categoryName: data.category.trim(),
      });
      reset();
    } catch (e) {
      handleError("Error creating category", e);
      // Displays error in UI
      setError("category", {
        type: "server",
        message: "There was an issue creating the category.",
      });
    }
  };

  return (
    <>
      <Button startContent={<CirclePlus />} onPress={onOpen}>
        New
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <form onSubmit={handleSubmit(handleAddCategory)}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Modal Title
                </ModalHeader>
                <ModalBody>
                  <Controller
                    name={"category"}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => {
                      return (
                        <Input
                          disabled={isSubmitting}
                          label="Category"
                          variant="bordered"
                          errorMessage={errors.category?.message}
                          {...field}
                        />
                      );
                    }}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose} type="submit">
                    Create
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default CreateCategory;