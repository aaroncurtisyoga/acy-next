"use client";

import { FC, useEffect, useState, useRef } from "react";
import { Category } from "@prisma/client";
import { Button, Input, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  getAllCategories,
  createCategory,
} from "@/app/_lib/actions/category.actions";
import { CategoryFormSchema } from "@/app/_lib/schema";
import { handleError } from "@/app/_lib/utils";
import TableCategoryManagement from "@/app/admin/categories/_components/TableCategoryManagement";
import { CheckCircle, Plus, X, Layers } from "lucide-react";

type Inputs = z.infer<typeof CategoryFormSchema>;

const AdminCategories: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      category: "",
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isAddingCategory && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isAddingCategory]);

  const handleAddCategory: SubmitHandler<Inputs> = async (data) => {
    try {
      const result = await createCategory({
        categoryName: data.category.trim(),
      });
      if (result.status) {
        setShowSuccess(true);
        // Refresh categories list
        const updatedCategories = await getAllCategories();
        setCategories(updatedCategories);
        reset();
        setIsAddingCategory(false);
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }
    } catch (e) {
      handleError("Error creating category", e);
      setError("category", {
        type: "server",
        message: "There was an issue creating the category.",
      });
    }
  };

  const handleCancel = () => {
    setIsAddingCategory(false);
    reset();
    setError("category", undefined);
  };

  return (
    <div className="wrapper max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Categories</h1>
        <Chip color="primary" variant="flat" size="lg">
          {categories.length}{" "}
          {categories.length === 1 ? "Category" : "Categories"}
        </Chip>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-success-50 text-success-700 rounded-lg animate-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Category created successfully!</span>
        </div>
      )}

      <Card className="shadow-lg">
        <CardHeader className="flex flex-col gap-3">
          {/* Collapsed State - Just a button */}
          {!isAddingCategory ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                <p className="text-lg font-semibold">Manage Categories</p>
              </div>
              <Button
                color="primary"
                variant="flat"
                startContent={<Plus className="w-4 h-4" />}
                onPress={() => setIsAddingCategory(true)}
                className="font-medium"
              >
                Add Category
              </Button>
            </div>
          ) : (
            /* Expanded State - Show form */
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Add New Category</p>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={handleCancel}
                  className="text-default-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form
                onSubmit={handleSubmit(handleAddCategory)}
                className="flex gap-2"
              >
                <Controller
                  name={"category"}
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => {
                    return (
                      <Input
                        ref={inputRef}
                        isDisabled={isSubmitting}
                        placeholder="Enter category name (e.g., Workshop, Social, Training)"
                        variant="bordered"
                        size="md"
                        errorMessage={errors.category?.message}
                        isInvalid={!!errors.category}
                        classNames={{
                          input: "text-foreground",
                          inputWrapper:
                            "hover:border-primary data-[hover=true]:border-primary",
                        }}
                        {...field}
                      />
                    );
                  }}
                />
                <Button
                  type="submit"
                  color="primary"
                  isLoading={isSubmitting}
                  className="font-medium px-6"
                >
                  {isSubmitting ? "Adding..." : "Add"}
                </Button>
                <Button
                  type="button"
                  variant="flat"
                  onPress={handleCancel}
                  isDisabled={isSubmitting}
                  className="font-medium"
                >
                  Cancel
                </Button>
              </form>
            </div>
          )}
        </CardHeader>

        <CardBody className="pt-2">
          {categories.length > 0 ? (
            <TableCategoryManagement
              categories={categories}
              setCategories={setCategories}
            />
          ) : (
            <div className="text-center py-8 text-default-500">
              <Layers className="w-12 h-12 mx-auto mb-3 text-default-300" />
              <p>No categories yet. Add your first category to get started.</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminCategories;
