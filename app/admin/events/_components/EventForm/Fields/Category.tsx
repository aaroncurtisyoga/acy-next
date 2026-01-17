import { FC, useEffect, useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Category } from "@prisma/client";
import {
  Control,
  Controller,
  FieldErrors,
  RegisterOptions,
} from "react-hook-form";
import { getAllCategories } from "@/app/_lib/actions/category.actions";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";

interface CategoryDropdownProps {
  control: Control<EventFormValues>;
  isSubmitting: boolean;
  errors: FieldErrors<EventFormValues>;
  rules?: RegisterOptions<EventFormValues, "category">;
}

const CategoryDropdown: FC<CategoryDropdownProps> = ({
  control,
  errors,
  isSubmitting,
  rules,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    void (async () => {
      const categoryList = await getAllCategories();
      categoryList && setCategories(categoryList as Category[]);
    })();
  }, []);

  return (
    <Controller
      control={control}
      name={"category"}
      rules={rules}
      render={({ field }) => {
        return (
          <Select
            onChange={(e) => field.onChange(e.target.value)}
            isDisabled={isSubmitting}
            selectedKeys={field.value ? [field.value] : []}
            errorMessage={errors.category?.message}
            label={"Category"}
            isInvalid={!!errors.category}
            variant={"bordered"}
            isRequired={!!rules?.required}
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
