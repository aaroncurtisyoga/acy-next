"use client";

import { Dispatch, FC, SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { Category } from "@prisma/client";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { createCategory } from "@/_lib/actions/category.actions";
import { CategoryFormSchema } from "@/_lib/schema";
import { handleError } from "@/_lib/utils";

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
