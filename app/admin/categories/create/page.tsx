"use client";

import { FC } from "react";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { createCategory } from "@/app/_lib/actions/category.actions";
import { CategoryFormSchema } from "@/app/_lib/schema";
import { handleError } from "@/app/_lib/utils";

type Inputs = z.infer<typeof CategoryFormSchema>;

const CreateCategory: FC = () => {
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
        // Todo: Just display a success msg here & ensure /categories page
        //  is updated when navigated to
        // setCategories((prev) => [...prev, result.newCategory]);
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
              isDisabled={isSubmitting}
              label="Category"
              variant="bordered"
              errorMessage={errors.category?.message}
              {...field}
            />
          );
        }}
      />
      <Button type={"submit"}> Create</Button>
    </form>
  );
};

export default CreateCategory;
