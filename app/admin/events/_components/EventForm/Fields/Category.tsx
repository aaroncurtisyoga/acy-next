import React, { FC, useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { Category } from "@prisma/client";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Inputs } from "@/app/admin/events/_components/EventForm/Steps/BasicInfo";
import { getAllCategories } from "@/_lib/actions/category.actions";

interface CategoryDropdownProps {
  control: Control;
  isSubmitting: boolean;
  errors: FieldErrors<Inputs>;
}

const CategoryDropdown: FC<CategoryDropdownProps> = ({
  control,
  errors,
  isSubmitting,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const getCategories = async () => {
    const categoryList = await getAllCategories();
    categoryList && setCategories(categoryList as Category[]);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Controller
      control={control}
      name={"category"}
      render={({ field }) => {
        return (
          <Select
            onChange={(e) => field.onChange(e)}
            isDisabled={isSubmitting}
            defaultSelectedKeys={[field.value]}
            errorMessage={errors.category?.message}
            label={"Category"}
            isInvalid={!!errors.category}
            variant={"bordered"}
            {...field}
          >
            {categories.length > 0 &&
              categories.map((category) => (
                <SelectItem key={category.id}>{category.name}</SelectItem>
              ))}
          </Select>
        );
      }}
    />
  );
};

export default CategoryDropdown;
