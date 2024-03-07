"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { z } from "zod";
import { createCategory } from "@/lib/actions/category.actions";
import { categoryFormSchema } from "@/lib/schema";

type Inputs = z.infer<typeof categoryFormSchema>;
const ManageEventCategories = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<Inputs>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      category: "",
    },
  });

  const handleAddCategory: SubmitHandler<Inputs> = async (data) => {
    try {
      await createCategory({
        categoryName: data.category.trim(),
      });
    } catch (e) {
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
