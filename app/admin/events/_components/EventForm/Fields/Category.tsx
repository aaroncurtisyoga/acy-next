import React, { FC, useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Category } from "@prisma/client";
import { getAllCategories } from "@/_lib/actions/category.actions";
import { Inputs } from "@/app/admin/events/_components/EventForm/Steps/BasicInfo";

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

  if (categories.length === 0) return null;

  return (
    <Controller
      control={control}
      name={"categoryId"}
      render={({ field }) => {
        return (
          <Select
            onChange={(e) => field.onChange(e)}
            disabled={isSubmitting}
            defaultSelectedKeys={[field.value]}
            errorMessage={errors.categoryId?.message}
            label={"Category"}
            variant={"bordered"}
            {...field}
          >
            {categories.map((category) => (
              <SelectItem key={category.id}>{category.name}</SelectItem>
            ))}
          </Select>
        );
      }}
    />
  );
};

export default CategoryDropdown;
