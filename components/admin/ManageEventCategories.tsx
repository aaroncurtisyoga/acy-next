"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { z } from "zod";
import { createCategory } from "@/lib/actions/category.actions";
import { CategoryFormSchema } from "@/lib/schema";
import { handleError } from "@/lib/utils";

type Inputs = z.infer<typeof CategoryFormSchema>;
const ManageEventCategories = () => {
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
      <Button color={"primary"} type="submit" className={"my-unit-3"}>
        Add Category
      </Button>
      {isSubmitSuccessful && <p>Category added successfully</p>}
    </form>
  );
};

export default ManageEventCategories;
