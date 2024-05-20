"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Dispatch, FC, SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import { CirclePlus } from "lucide-react";
import { z } from "zod";
import { Category } from "@prisma/client";
import { createCategory } from "@/lib/actions/category.actions";
import { CategoryFormSchema } from "@/lib/schema";
import { handleError } from "@/lib/utils";
import BasicModal from "@/components/shared/BasicModal";

type Inputs = z.infer<typeof CategoryFormSchema>;

interface CreateCategoryProps {
  setCategories: Dispatch<SetStateAction<Category[]>>;
}

const CreateCategory: FC<CreateCategoryProps> = ({ setCategories }) => {
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
      const result = await createCategory({
        categoryName: data.category.trim(),
      });
      if (result.status) {
        setCategories((prev) => [...prev, result.newCategory]);
        onOpenChange();
      }
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
      <BasicModal
        header={"Create Category"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        primaryAction={handleSubmit(handleAddCategory)}
        primaryActionLabel={"Create"}
      >
        <form onSubmit={handleSubmit(handleAddCategory)}>
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
        </form>
      </BasicModal>
    </>
  );
};

export default CreateCategory;
