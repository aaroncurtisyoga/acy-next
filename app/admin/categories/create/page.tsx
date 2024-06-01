"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Dispatch, FC, SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import { z } from "zod";
import { Category } from "@prisma/client";
import { createCategory } from "@/_lib/actions/category.actions";
import { CategoryFormSchema } from "@/_lib/schema";
import { handleError } from "@/_lib/utils";

type Inputs = z.infer<typeof CategoryFormSchema>;

interface CreateCategoryProps {
  setCategories: Dispatch<SetStateAction<Category[]>>;
}

const CreateCategory: FC<CreateCategoryProps> = ({ setCategories }) => {
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
  );
};

export default CreateCategory;
