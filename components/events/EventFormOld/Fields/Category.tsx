import React, { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { ICategory } from "@/lib/mongodb/database/models/category.model";
import { getAllCategories } from "@/lib/actions/category.actions";

const Category = ({ control, errors, isSubmitting }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const getCategories = async () => {
    const categoryList = await getAllCategories();
    categoryList && setCategories(categoryList as ICategory[]);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Controller
      control={control}
      name={"categoryId"}
      render={({ field }) => (
        <Select
          onChange={(e) => field.onChange(e)}
          disabled={isSubmitting}
          errorMessage={errors.categoryId?.message}
          label={"Category"}
          variant={"bordered"}
          {...field}
        >
          {categories.length > 0 &&
            categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
        </Select>
      )}
    />
  );
};

export default Category;
