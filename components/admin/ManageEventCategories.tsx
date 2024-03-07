import { createCategory } from "@/lib/actions/category.actions";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import { z } from "zod";
import { categoryFormSchema } from "@/lib/schema";

type Inputs = z.infer<typeof categoryFormSchema>;
const ManageEventCategories = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<Inputs>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      category: "",
    },
  });
  const handleAddCategory = (category) => {
    createCategory({
      categoryName: category.trim(),
    }).then((category) => {
      // Add new category to state
      // todo: notify user that category was added
    });
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log("data", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name={"category"}
        control={control}
        rules={{ required: true }}
        render={({ field }) => {
          return (
            <Input
              label="Category"
              variant="bordered"
              errorMessage={errors.category?.message}
              {...field}
            />
          );
        }}
      />
      <p>create category</p>
    </form>
  );
};

export default ManageEventCategories;
