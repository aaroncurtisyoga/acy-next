import { FC, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { Category as CategoryType } from "@prisma/client";
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
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    void (async () => {
      const categoryList = await getAllCategories();
      categoryList && setCategories(categoryList as CategoryType[]);
    })();
  }, []);

  return (
    <Controller
      control={control}
      name={"category"}
      rules={rules}
      render={({ field }) => (
        <FormField
          label="Category"
          error={errors.category?.message}
          required={!!rules?.required}
        >
          <Select
            value={field.value || ""}
            onValueChange={field.onChange}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      )}
    />
  );
};

export default CategoryDropdown;
